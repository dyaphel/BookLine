from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            'isbn',
            'title', 
            'author',
            'description',
            'abstract',
            'genre',
            'language',
            'available_copies',
            'cover'
        ]
        extra_kwargs = {
            'isbn': {'read_only': True}  # Prevent ISBN from being changed
        }