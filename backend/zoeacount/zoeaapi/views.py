from django.shortcuts import render
from django.http.response import JsonResponse
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status

from .models import ZoeaTable
from .serializer import ZoeaTableSerializer


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
    print(request.data)
    serializer = ZoeaTableSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
