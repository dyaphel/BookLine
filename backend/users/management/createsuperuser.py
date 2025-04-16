from django.contrib.auth.management.commands import createsuperuser
from django.core.management import CommandError
from users.models import CustomUser

class Command(createsuperuser.Command):
    def handle(self, *args, **options):
        # Override the logic to use `email` instead of `username`
        email = options.get('email')
        if not email:
            raise CommandError('You must specify the email address.')

        # Create superuser with email instead of username
        options['username'] = email  # Set the email as the username field
        
        # Call the parent class's handle method to perform the actual superuser creation
        super().handle(*args, **options)
