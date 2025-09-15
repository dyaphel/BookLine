from django.db import models


class Book(models.Model):
    isbn = models.CharField(max_length=13, primary_key=True)
    title = models.TextField()
    description = models.TextField(blank=True)
    abstract = models.TextField(blank=True)
    author = models.TextField()
    published = models.DateField()
    cover = models.ImageField(upload_to='book_covers/', null=True, blank=True)
    genre = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=50, blank=True)
    available_copies = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return self.title