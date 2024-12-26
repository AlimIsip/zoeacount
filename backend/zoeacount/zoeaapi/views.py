from django.shortcuts import render
from django.http.response import JsonResponse, FileResponse
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status

from .models import ZoeaTable
from .serializer import ZoeaTableSerializer

from .cv_app import TFLite_detection_image

from django.core.files.storage import default_storage, FileSystemStorage
from django.conf import settings
from pathlib import Path

import os
from io import BytesIO
import base64
import cv2


# Create your views here.

@api_view(['GET'])
def get_table(request):
    table = ZoeaTable.objects.order_by('-timestamp')[:7]
    serializer = ZoeaTableSerializer(table, many=True, context={'request': request})
    return JsonResponse(serializer.data,safe=False)

@api_view(['GET'])
def get_dashboard_stats(request):
    latest = ZoeaTable.objects.latest('timestamp')
    serializer = ZoeaTableSerializer(latest, context={'request': request})
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def get_chart_stats(request):
    chart_stats = ZoeaTable.objects.order_by('timestamp')[:7]
    serializer = ZoeaTableSerializer(chart_stats, many=True, context={'request': request})
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def create_entry(request):
    serializer = ZoeaTableSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def upload_raw_img(request):
    # Retrieve uploaded image
    image = request.FILES['img_blob']
    print("received: ", image)
    # Save the uploaded image to the cv_app_path
    base_dir = Path(__file__).resolve().parent.parent
    cv_app_path = base_dir / "zoeaapi" / "cv_app"
    fs = FileSystemStorage(location=cv_app_path)
    filename = fs.save(image.name, image)

    # Perform object detection
    # image_path = os.path.join(cv_app_path, filename)
    TFLite_detection_image.object_detect(0.5, image.name)
    image_path = base_dir / "zoeaapi" / "cv_app" / "results" / "larvae_image.jpg"

    # Load the processed image
    img = cv2.imread(str(image_path))
    if img is None:
        return JsonResponse({"error": "Failed to load the image"}, status=400)

    # Encode the image as JPEG
    success, buffer = cv2.imencode('.jpg', img)
    if not success:
        return JsonResponse({"error": "Failed to encode the image"}, status=500)

    return FileResponse(BytesIO(buffer), content_type='image/jpeg')




# @api_view(['GET', 'PUT', 'DELETE'])
# def zoea_entry_func(request, pk):
#     try:
#         zoea_entry = ZoeaTable.objects.get(pk=pk)
#     except zoea_entry.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
#
#     if request.method == 'GET':
#         serializer = ZoeaTableSerializer(zoea_entry)
#         return Response(serializer.data)
#
#     elif request.method == 'PUT':
#         serializer = ZoeaTableSerializer(zoea_entry, data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
