from django.urls import path
from .views import *

urlpatterns = [
    path('', home),
    path('table', get_table, name='table'),
    path('table/dashboard', get_dashboard_stats, name='dashboard'),
    path('table/create', create_entry, name='create'),
    path('charts', get_chart_stats, name='dashboard_stats'),
    path('upload_raw_img', upload_raw_img, name='upload_raw_img'),
    path('img_inference', img_inference, name='img_inference'),  # <- Correct endpoint
    path('get_imagedata', get_processed_image, name='get_processed_image'),
    path('post_new_entry', post_new_entry, name='post_new_entry'),
    path('users', user_list, name='user_list'),
    path('users/create', user_create, name='user_create'),
    path('users/edit/<int:pk>/', user_edit, name='user_edit'),
    path('users/change_password', user_change_password, name='user_change_password'),
    path('capture', upload_captured_img, name='upload_captured_img'),

    path('video_feed', video_feed, name='video_feed')
    # path('table/<int:pk>', zoea_entry_func, name='zoea_entry'),
]

