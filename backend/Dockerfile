FROM python:3.10

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run migrations and create superuser
CMD bash -c "python manage.py migrate && python create_superuser.py && python manage.py runserver 0.0.0.0:8000"