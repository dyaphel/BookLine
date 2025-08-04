
from django.db import models

class Book(models.Model):
    # STATUS_CHOICES = [
    #     ('available', 'Available'), #copies > reservations
    #     ('reserved', 'Reserved'), # user made a reservation
    #     ('not_available', 'not available'), # copies <= reservations
    #     ('in_queue', 'In Queue'), # user is in queue for the book,
    #     # ('lost', 'Lost'),
    # ]
    # ISBN as the primary key
    isbn = models.CharField(max_length=13, primary_key=True)  # Assuming ISBN is a 13-digit number, use CharField
    title = models.TextField()
    description = models.TextField(blank=True)
    abstract = models.TextField(blank=True)
    author = models.TextField()
    published = models.DateField()
    # status = models.CharField(
    #     max_length=20, 
    #     choices=STATUS_CHOICES, 
    #     default='available'
    # )
    cover = models.ImageField(upload_to='book_covers/', null=True, blank=True)  # Store image files in 'book_covers/' folder
    genre = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=50, blank=True)
    # copies = models.PositiveIntegerField(blank = False, default=1)
    available_copies = models.PositiveIntegerField(default=1)
    # queue = models.PositiveIntegerField(default=0)  # Number of users in queue for the book

    # queued user to the book;
    def __str__(self):
        return self.title