from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'password', 'role']
        extra_kwargs = {
            'role': {'default': 'USER'}
        }

    def create(self, validated_data):
        role = validated_data.pop('role', 'USER')
        user = CustomUser.objects.create_user(role=role, **validated_data)
        return user