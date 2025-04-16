from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'profile_image', 'first_name', 'last_name', 'password', 'role']
        extra_kwargs = {
            'role': {'default': 'USER'},
             'username': {'required': True, 'allow_blank': False}       
            }
    def validate_username(self, value):
        if not value.strip():
            raise serializers.ValidationError("Username cannot be empty.")
        return value

    def create(self, validated_data):
        role = validated_data.pop('role', 'USER')
        user = CustomUser.objects.create_user(role=role, **validated_data)
        return user