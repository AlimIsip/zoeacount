from django.urls import path
from .views import get_table, create_entry, get_dashboard_stats




urlpatterns = [
    path('table', get_table, name='table'),
    path('table/dashboard', get_dashboard_stats, name='dashboard'),
    path('table/create', create_entry, name='create'),
    # path('table/<int:pk>', zoea_entry_func, name='zoea_entry'),
]

