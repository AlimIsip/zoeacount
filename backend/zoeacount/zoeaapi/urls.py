from django.urls import path
from .views import get_table, create_entry, get_dashboard_stats, get_chart_stats, upload_raw_img

urlpatterns = [
    path('table', get_table, name='table'),
    path('table/dashboard', get_dashboard_stats, name='dashboard'),
    path('table/create', create_entry, name='create'),
    path('charts/', get_chart_stats, name='dashboard_stats'),
    path('detect_larva', upload_raw_img, name='upload_raw_img')
    # path('table/<int:pk>', zoea_entry_func, name='zoea_entry'),
]

