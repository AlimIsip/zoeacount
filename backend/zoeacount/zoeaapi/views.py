from django.shortcuts import render
from django.http.response import JsonResponse, FileResponse, StreamingHttpResponse
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.db.models import Max
from django.contrib.auth.password_validation import validate_password
from libcamera import controls
import time

#Local imports for authentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

#Local imports for Timeline Table Data
from .models import ZoeaTable
from .serializer import ZoeaTableSerializer, ZoeaBatchSerializer, UserSerializer, UserCreateSerializer

#Local imports for Object Detection
from django.core.files.storage import default_storage, FileSystemStorage
from django.conf import settings
from pathlib import Path
import os
from io import BytesIO
import base64
import cv2
import json
from zoeaapi.cv_app.TFLite_detection_image import slice_image, detect_objects_tflite, reconstruct_image
from picamera2 import Picamera2
import atexit
import threading


User = get_user_model()

camera_lock = threading.Lock()
camera = None

def initialize_camera():
    """Initializes the camera only once."""
    global camera
    with camera_lock:
        if camera is None:
            camera = Picamera2()
            camera.configure(camera.create_preview_configuration(
                main={"format": 'XRGB8888', "size": (1280, 720)}, buffer_count=3))
            camera.start()



def close_camera():
    """Closes the camera when the app shuts down."""
    global camera
    with camera_lock:
        if camera:
            camera.close()
            camera = None

# Register cleanup function
atexit.register(close_camera)

def generate_frames():
    """Video streaming generator function."""
    initialize_camera()  # Ensure camera is initialized

    try:
        while True:
            with camera_lock:
                frame = camera.capture_array()
            
            _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    except GeneratorExit:
        pass  # Client disconnected

    except Exception as e:
        print(f"Error in generate_frames: {e}")

    finally:
        close_camera()  # Ensure camera is released

@api_view(['GET'])
@permission_classes([AllowAny])
def video_feed(request):
    return StreamingHttpResponse(generate_frames(), content_type='multipart/x-mixed-replace; boundary=frame')
# Create your views here.

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def home(request):
    content = {'message': 'Hello, World!'}
    return Response(content)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_table(request):
    table = ZoeaTable.objects.order_by('-datestamp', '-timestamp')
    serializer = ZoeaTableSerializer(table, many=True, context={'request': request})
    return JsonResponse(serializer.data,safe=False)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_dashboard_stats(request):
    latest = ZoeaTable.objects.latest('datestamp')
    serializer = ZoeaTableSerializer(latest, context={'request': request})
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_chart_stats(request):
    chart_stats = ZoeaTable.objects.order_by('-datestamp', '-timestamp')[:7]  # Get last 7 records
    chart_stats = reversed(chart_stats)  # Reverse to keep oldest first
    serializer = ZoeaTableSerializer(chart_stats, many=True, context={'request': request})
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
@permission_classes([AllowAny])  # Requires authentication
def user_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_create(request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "id": user.id,
            "username": user.username,
            "role": user.groups.first().name if user.groups.exists() else None
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['PUT', 'PATCH'])  # Allow PATCH for partial updates
@permission_classes([IsAuthenticated])
def user_edit(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserCreateSerializer(user, data=request.data, partial=True)  # Allow partial updates
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_change_password(request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    if not user.check_password(old_password):
        return Response({'error': 'Incorrect old password'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(new_password, user)
    except Exception as e:
        return Response({'error': list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()
    return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_entry(request):
    serializer = ZoeaTableSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def initialize_camera_capture():
    """Initializes the camera only once (shared between video feed and still capture)."""
    global camera
    with camera_lock:
        if camera is None:
            camera = Picamera2()
            camera.configure(camera.create_still_configuration(main={'size': (4608, 2592)}))
            camera.start()

def capture_image():
    """Captures a single still image after autofocus success."""
    initialize_camera_capture()  # Ensure camera is initialized

    with camera_lock:
        camera.set_controls({"AfMode": controls.AfModeEnum.Continuous})

        # Wait for autofocus success
        for _ in range(10):  # Try for up to ~7 seconds
            if camera.autofocus_cycle():
                break
            time.sleep(0.7)
        else:
            close_camera()
            return None  # Autofocus failed

        # Save captured image
        base_dir = Path(__file__).resolve().parent.parent
        image_path = base_dir / "zoeaapi" / "cv_app" / "to_detect" / "captured_image.jpg"
        camera.capture_file(image_path)

    close_camera()
    return image_path   

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_captured_img(request):
    image_path = capture_image()

    if image_path is None:
        return Response({"error": "Autofocus failed. Please try again."}, status=400)

    try:
        base_dir = Path(__file__).resolve().parent.parent
        cv_app_path = base_dir / "zoeaapi" / "cv_app" / "to_detect"
        fs = FileSystemStorage(location=cv_app_path)
        filename = fs.save("captured_image.jpg", open(image_path, "rb"))

        # Construct the URL where the image can be accessed
        image_url = f"{request.scheme}://{request.get_host()}/captured/{filename}"

        return Response({
            "message": "Image captured and uploaded successfully.",
            "imageUrl": image_url,
            "filename" : filename
        }, status=201)

    except Exception as e:
        return Response({"error": f"Failed to save image: {str(e)}"}, status=500)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_raw_img(request):
    # Retrieve uploaded image
    image = request.FILES['image']
    print("received: ", image)
    # Save the uploaded image to the cv_app_path
    base_dir = Path(__file__).resolve().parent.parent
    cv_app_path = base_dir / "zoeaapi" / "cv_app" / "to_detect"
    fs = FileSystemStorage(location=cv_app_path)
    filename = fs.save(image.name, image)
    return Response({"message": "Image uploaded successfully", "filename": filename}, status=201)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def img_inference(request):
    """
    Perform object detection and return the count data.
    Streams logs while processing.
    """
    try:
        filename = request.data.get("filename")
        if not filename:
            return JsonResponse({"error": "Filename not provided"}, status=400)

        base_dir = Path(__file__).resolve().parent.parent
        input_image_path = base_dir / "zoeaapi" / "cv_app" / "to_detect" / filename

        if not input_image_path.exists():
            return JsonResponse({"error": "Uploaded file not found"}, status=404)

        slices_folder = base_dir / "zoeaapi" / "cv_app" / "slices"
        output_image_path = base_dir / "zoeaapi" / "cv_app" / "processed" / filename
        model_path = base_dir / "zoeaapi" / "cv_app" / "custom_model_lite" / "detect.tflite"
        label_path = base_dir / "zoeaapi" / "cv_app" / "labelmap.txt"

        def inference_logs():
            yield f"[INFO] Starting inference for {filename}\n"
            yield f"[INFO] Slicing image...\n"

            slices = slice_image(str(input_image_path), str(slices_folder))
            yield f"[INFO] Total slices created: {len(slices)}\n"

            yield f"[INFO] Running object detection on slices...\n"
            detections = detect_objects_tflite(str(model_path), str(label_path), slices)

            yield f"[INFO] Reconstructing detected objects into final image...\n"
            reconstruct_image(str(input_image_path), detections, str(output_image_path))

            # ✅ Ensure valid JSON response in the final chunk
            processed_image_url = f"{request.scheme}://{request.get_host()}/results/{filename}"
            result = {
                "processed_image_url": processed_image_url,
                "count_data": len(detections),
            }
            yield json.dumps(result)  # ✅ Ensure proper JSON format

        return StreamingHttpResponse(inference_logs(), content_type="text/event-stream")

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@api_view(["POST"])
@permission_classes([AllowAny])
def get_processed_image(request):
    """
    Returns the URL of the processed image along with the incremented latest batch.
    """
    # Retrieve the latest batch from ZoeaTable
    latest_entry = ZoeaTable.objects.aggregate(latest_batch=Max("batch"))
    latest_batch = latest_entry.get("latest_batch", 0)  # Default to 0 if no batch exists
    latest_batch = latest_batch + 1
    filename = request.data.get("filename")
    # Define the relative path to the processed image
    image_path = f"processed/{filename}"

    # Construct the absolute file path
    base_dir = Path(__file__).resolve().parent.parent
    output_image_path = base_dir / "zoeaapi" / "cv_app" / image_path

    if not output_image_path.exists():
        return JsonResponse({"error": "Processed image not found"}, status=404)

    # Construct the URL where the image can be accessed
    image_url = f"{request.scheme}://{request.get_host()}/results/{filename}"

    return JsonResponse({
        "imageUrl": image_url,
        "latestBatch": latest_batch  # Returning the current batch without incrementing
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_new_entry(request):
    print("Received data:", request.data)  # Debugging line
    print("Received files:", request.FILES)  # Debugging line
    try:
        # Extract form data
        batch = request.data.get("batch")
        age = request.data.get("age")
        megalopa_datestamp = request.data.get("megalopa_datestamp")
        count_data = request.data.get("count_data")
        captured_by = request.data.get("captured_by")
        datestamp = request.data.get("datestamp")
        timestamp = request.data.get("timestamp")

        # Validate required fields
        if not all([batch, age, datestamp, timestamp, count_data, captured_by]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        # Extract and validate the image
        img_blob = request.FILES.get("img_blob")
        if not img_blob:
            return Response({"error": "Image is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new entry
        entry = ZoeaTable.objects.create(
            batch=batch,
            img_blob=img_blob,
            datestamp=datestamp,
            timestamp=timestamp,
            age=age,
            megalopa_datestamp=megalopa_datestamp,
            count_data=count_data,
            captured_by=captured_by,
        )

        # Serialize and return the response
        serializer = ZoeaTableSerializer(entry)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def img_inference(request):
#     """
#     Perform object detection on the most recently uploaded image and return the processed image.
#     """
#     try:

#         filename = request.data.get("filename")
#         if not filename:
#             return JsonResponse({"error": "Filename not provided"}, status=400)


#         # Define full paths


#         # Check if the uploaded file exists
#         if not input_image_path.exists():
#             return JsonResponse({"error": "Uploaded file not found"}, status=404)

#         # Perform object detection
#         count_data = TFLite_detection_image.object_detect(0.3, str(input_image_path))

#          # Ensure processed image exists
#         if not output_image_path.exists():
#             return JsonResponse({"error": "Processed image not found"}, status=500)

#         # Load the processed image
#         img = cv2.imread(str(output_image_path))
#         if img is None:
#             return JsonResponse({"error": "Failed to load the image"}, status=400)

#         # Encode the image as JPEG
#         success, buffer = cv2.imencode('.jpg', img)
#         if not success:
#             return JsonResponse({"error": "Failed to encode the image"}, status=500)

#         # Return the processed image
#         return FileResponse(BytesIO(buffer), content_type="image/jpeg")

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)
    


