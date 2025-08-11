# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class CustomUser(models.Model):
    id = models.BigAutoField(primary_key=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    date_joined = models.DateTimeField()
    email = models.CharField(unique=True, max_length=254)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    username = models.CharField(unique=True, max_length=50)
    profile_image = models.CharField(max_length=100, blank=True, null=True)
    role = models.CharField(max_length=10)
    is_active = models.BooleanField()
    is_staff = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'users_customuser'


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
