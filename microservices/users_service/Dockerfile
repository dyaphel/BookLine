FROM python:3.10

WORKDIR /app

# Install system dependencies
# Install lsb-release to determine the Debian release codename
RUN apt-get update && \
    apt-get install -y wget gnupg2 lsb-release && \
    sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list' && \
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg && \
    apt-get update && \
    apt-get install -y postgresql-client-17 && \
    rm -rf /var/lib/apt/lists/*


# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose port for Django
EXPOSE 8000

# Run migrations and create superuser

CMD bash -c 'python manage.py makemigrations users && python manage.py migrate && python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); exit(0) if User.objects.filter(email=\"admin@user.com\").exists() else exit(1)" || python manage.py createsuperuser --noinput --username admin --email admin@user.com && python manage.py loaddata initial_users.json && python manage.py runserver 0.0.0.0:8000'

# && python manage.py loaddata initial_users.json