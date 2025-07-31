from django.db import models
from django.utils import timezone
from users.models import CustomUser
from bookline.models import Book

class Reservation(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now)
    fulfilled = models.BooleanField(default=False)  # Currently holds a copy
    ready_for_pickup = models.BooleanField(default=False)  # When the copy becomes available
    returned = models.BooleanField(default=False)  # User has returned the book
    position = models.PositiveIntegerField(null=True, blank=True) #Position in the queue

    class Meta:
        unique_together = ('user', 'book')  # Prevent duplicate reservations
        ordering = ['timestamp']  # Automatically order by time of request

    def __str__(self):
        return f"{self.user.email} - {self.book.title} ({'Fulfilled' if self.fulfilled else 'Waiting'})"