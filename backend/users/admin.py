from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser

    # Fields to display in the admin list view
    list_display = ['email',  'username','first_name', 'last_name', 'role', 'is_staff', 'is_active']

    # Fields to filter by in the sidebar
    list_filter = ['role', 'is_staff', 'is_superuser']

    # Fields to use in the user edit form
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )

    # Fields to use when creating a user
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role',)}),
    )

    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['email']

admin.site.register(CustomUser, CustomUserAdmin)
