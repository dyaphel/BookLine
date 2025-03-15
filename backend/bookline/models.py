from django.db import models

class Book(models.Model):
    # ISBN as the primary key
    isbn = models.CharField(max_length=13, primary_key=True)  # Assuming ISBN is a 13-digit number, use CharField
    title = models.TextField()
    description = models.TextField(blank=True)
    abstract = models.TextField(blank=True)
    author = models.TextField()
    published = models.DateField()
    cover = models.ImageField(upload_to='book_covers/', null=True, blank=True)  # Store image files in 'book_covers/' folder
    genre = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.title