from django.contrib import admin
from .models import Book


admin.site.register(Book)
@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('isbn', 'title', 'author', 'published')  # Fields to display in the admin panel
    search_fields = ('title', 'author') 