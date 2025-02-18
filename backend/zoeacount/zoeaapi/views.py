from django.shortcuts import render
from django.http.response import JsonResponse, FileResponse, StreamingHttpResponse
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.db.models import Max

#Local imports for authentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

#Local imports for Timeline Table Data
from .models import ZoeaTable
from .serializer import ZoeaTableSerializer, ZoeaBatchSerializer, UserSerializer

#Local imports for Object Detection
from django.core.files.storage import default_storage, FileSystemStorage
from django.conf import settings
from pathlib import Path
import os
from io import BytesIO
import base64
import cv2
from zoeaapi.cv_app.TFLite_detection_image import slice_image, detect_objects_tflite, reconstruct_image


User = get_user_model()

#Local imports for Video Feed
# from picamera2 import Picamera2
# camera = Picamera2()
# camera.configure(camera.create_preview_configuration(main={"format": 'XRGB8888', "size": (640, 480)}))
# camera.start()

# def generate_frames():
#     while True:
#         frame = camera.capture_array()
#         ret, buffer = cv2.imencode('.jpg', frame)
#         frame = buffer.tobytes()
#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


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
    table = ZoeaTable.objects.order_by('-timestamp')
    serializer = ZoeaTableSerializer(table, many=True, context={'request': request})
    return JsonResponse(serializer.data,safe=False)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_dashboard_stats(request):
    latest = ZoeaTable.objects.latest('timestamp')
    serializer = ZoeaTableSerializer(latest, context={'request': request})
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_chart_stats(request):
    chart_stats = ZoeaTable.objects.order_by('timestamp')[:7]
    serializer = ZoeaTableSerializer(chart_stats, many=True, context={'request': request})
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Requires authentication
def user_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_create(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def user_edit(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_entry(request):
    serializer = ZoeaTableSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

            yield f"[INFO] Inference completed. Processed image saved.\n"
            yield f'{{"processed_image_url": "/api/get_processed_image/{filename}", "count_data": {len(detections)} }}\n'

        return StreamingHttpResponse(inference_logs(), content_type="text/event-stream")

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_processed_image(request):
    """
    Returns the URL of the processed image along with the incremented latest batch.
    """
    # Retrieve the latest batch from ZoeaTable
    latest_entry = ZoeaTable.objects.aggregate(latest_batch=Max("batch"))
    latest_batch = latest_entry.get("latest_batch", 0)  # Default to 0 if no batch exists

    # Define the relative path to the processed image
    relative_image_path = f"results/processed_{latest_batch}.jpg"

    # Construct the absolute file path
    base_dir = Path(__file__).resolve().parent.parent
    output_image_path = base_dir / "zoeaapi" / "cv_app" / relative_image_path

    if not output_image_path.exists():
        return JsonResponse({"error": "Processed image not found"}, status=404)

    # Construct the URL where the image can be accessed
    image_url = f"{request.scheme}://{request.get_host()}/{relative_image_path}"

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
    
# @api_view(['GET'])
# def video_feed(request):
#     return StreamingHttpResponse(generate_frames(), content_type='multipart/x-mixed-replace; boundary=frame')


