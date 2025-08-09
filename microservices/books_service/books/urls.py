from django.urls import path
from .views import docker_health_check

urlpatterns = [
    path('health/', docker_health_check, name='docker-health-check'),
]