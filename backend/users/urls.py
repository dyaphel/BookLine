from django.urls import path
from .views import register, login_view, get_csrf_token

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('csrf/', get_csrf_token, name='get_csrf_token'),
]