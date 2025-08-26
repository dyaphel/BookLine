from django.db import models
from django.utils import timezone
from .external_models import Book
from users.models import CustomUser  # Local copy of unmanaged models

class Reservation(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now)
    fulfilled = models.BooleanField(default=False)  # Currently holds a copy
    ready_for_pickup = models.BooleanField(default=False)  # When the copy becomes available
    returned = models.BooleanField(default=False)  # User has returned the book
    position = models.PositiveIntegerField(null=True, blank=True) #Position in the queue
    cancelled = models.BooleanField(default=False) #User/Librarian cancelled the reservation

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'book_id'],
                condition=models.Q(returned=False, cancelled=False),
                name='unique_active_reservation'
            )
        ]
        ordering = ['timestamp']  # Automatically order by time of request

    def __str__(self):
        return f"{self.user.email} - {self.book.title} ({'Fulfilled' if self.fulfilled else 'Waiting'})"