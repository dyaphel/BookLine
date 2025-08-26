from django.urls import path
from . import views 
from .views import docker_health_check

urlpatterns = [

     path('create/', views.create_book, name='create-book'),
     
    path('health/', docker_health_check, name='docker-health-check'),
    path('',views.book_list, name='book-list'),  # Returns all books
    path('<str:isbn>/', views.book_detail, name='book-detail'),  # Returns a book by ISBN
    path('changeimage/<str:isbn>/',views.change_book_image, name='change_book_image'),
    path('edit/<str:isbn>/', views.edit_book, name='edit_book'),
    path('books_delete/<str:isbn>/', views.delete_book, name='delete-book'),
   
]