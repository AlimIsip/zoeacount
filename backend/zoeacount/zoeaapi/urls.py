from django.urls import path
from .views import *

urlpatterns = [
    path('', home),
    path('table', get_table, name='table'),
    path('table/dashboard', get_dashboard_stats, name='dashboard'),
    path('table/create', create_entry, name='create'),
    path('charts', get_chart_stats, name='dashboard_stats'),
    path('detect_larva', upload_raw_img, name='upload_raw_img'),
    path('users', user_list, name='user_list'),
    path('users/create', user_create, name='user_create'),
    path('users/edit', user_edit, name='user_edit'),


    # path('video_feed', video_feed, name='video_feed')
    # path('table/<int:pk>', zoea_entry_func, name='zoea_entry'),
]

