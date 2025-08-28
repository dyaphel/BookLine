from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
        # Se il problema persiste, prova ad aggiungere:
        extra_kwargs = {
            'isbn': {'required': True}
        }