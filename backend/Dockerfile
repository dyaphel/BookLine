FROM python:3.10


WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose port for Django
EXPOSE 8000

# Run migrations and create superuser
CMD bash -c "python manage.py migrate && python manage.py createsuperuser --noinput && python manage.py runserver 0.0.0.0:8000"