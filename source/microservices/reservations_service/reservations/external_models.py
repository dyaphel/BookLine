# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models

class Book(models.Model):
    isbn = models.CharField(primary_key=True, max_length=13)
    title = models.TextField()
    description = models.TextField()
    abstract = models.TextField()
    author = models.TextField()
    published = models.DateField()
    cover = models.CharField(max_length=100, blank=True, null=True)
    genre = models.CharField(max_length=100)
    language = models.CharField(max_length=50)
    available_copies = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'books_book'
