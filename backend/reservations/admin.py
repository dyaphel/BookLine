from django.contrib import admin
from .models import Reservation

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'timestamp', 'fulfilled', 'position']
    list_filter = ['fulfilled']
    search_fields = ['user__email', 'book__title']