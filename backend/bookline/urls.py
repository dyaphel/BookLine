from django.urls import path
from . import views 

urlpatterns = [
    path('books/', views.book_list, name='book-list'),  # Returns all books
    path('books/<str:isbn>/', views.book_detail, name='book-detail'),  # Returns a book by ISBN
]