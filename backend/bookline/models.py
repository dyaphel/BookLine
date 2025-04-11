#per gestire meglio gli utenti >>>
#---------------------------------------------------------------------------------------------------------------------------------
# from django.contrib.auth.models import AbstractUser
# from django.core.validators import EmailValidator

# from django.db import models
# class User(AbstractUser):
#     email = models.EmailField(unique=True, blank=False, null=False,
#             validators=[EmailValidator(message="Enter a valid email address.")]
#             )
#     profile_image = models.ImageField( null=True, blank=True)
#     background_image = models.ImageField(null=True, blank=True)
#     bio = models.TextField(blank=True, null=True)  # A short bio/description
#     location = models.CharField(max_length=100, blank=True, null=True)  # User's location
#     instagram  = models.URLField(blank=True, null=True)  # Personal website or social media link
#     facebook  = models.URLField(blank=True, null=True)  # Personal website or social media link
#     X  = models.URLField(blank=True, null=True)  # Personal website or social media link

# def __str__(self):
#     return self.username
#---------------------------------------------------------------------------------------------------------------------------------


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

    # add the status : available, not available, reserved;
    # queued user to the book;
    def __str__(self):
        return self.title