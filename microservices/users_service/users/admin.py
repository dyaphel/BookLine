from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from django.utils.html import format_html

class CustomUserAdmin(UserAdmin):
    model = CustomUser

    # Fields to display in the admin list view
    list_display = ['email', 'username', 'first_name', 'last_name', 'show_profile_image', 'role', 'is_staff', 'is_active']
    
    # Method to display profile image thumbnail
    def show_profile_image(self, obj):
        if obj.profile_image:
            return format_html('<img src="{}" width="50" height="50" />', obj.profile_image.url)
        return "No Image"
    show_profile_image.short_description = 'Profile Image'

    # Fields to filter by in the sidebar
    list_filter = ['role', 'is_staff', 'is_superuser']

    # Fields to use in the user edit form
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('username', 'first_name', 'last_name', 'profile_image')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
        ('Role', {'fields': ('role',)}),
    )

    # Fields to use when creating a user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name', 'password1', 'password2', 'profile_image', 'role'),
        }),
    )

    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['email']

admin.site.register(CustomUser, CustomUserAdmin)