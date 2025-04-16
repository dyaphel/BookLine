import json
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.contrib.auth import login as auth_login  # Renamed import

from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser
from .serializers import RegisterSerializer
from .models import CustomUser

import logging
logger = logging.getLogger(__name__)



@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    if not request.data.get('username', '').strip():
        return Response(
            {'username': 'This field is required and cannot be empty.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    else:
        # Log or print detailed errors to help troubleshoot
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):  # Renamed function
    try:
        data = request.data
        username_or_email = data.get('username')
        password = data.get('password')
        
        if not username_or_email or not password:
            return Response({
                'success': False,
                'message': 'Both username/email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, username=username_or_email, password=password)
        
        if user is None and '@' in username_or_email:
            try:
                email_user = CustomUser.objects.get(email=username_or_email)
                user = authenticate(request, username=email_user.username, password=password)
            except CustomUser.DoesNotExist:
                pass
        
        if user is not None:
            auth_login(request, user)  # Using the renamed import
            return Response({
                'success': True,
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            }, status=status.HTTP_200_OK)
            
        return Response({
            'success': False,
            'message': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
        
    except Exception as e:
        logger.exception("Login error")  # Better logging
        return Response({
            'success': False,
            'message': 'An error occurred during login'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)