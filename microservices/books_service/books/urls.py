from django.urls import path
from . import views 
from .views import docker_health_check

urlpatterns = [
    path('health/', docker_health_check, name='docker-health-check'),
    path('',views.book_list, name='book-list'),  # Returns all books
    path('<str:isbn>/', views.book_detail, name='book-detail'),  # Returns a book by ISBN
]