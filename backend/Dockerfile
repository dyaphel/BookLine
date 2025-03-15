# Backend Dockerfile
FROM python:3.10

WORKDIR /app

COPY requirements.txt .
COPY ./backend /app/backend
COPY ./static /app/static
COPY ./templates /app/templates
COPY ./media /app/media
COPY ./bookline /app/bookline

RUN pip install --no-cache-dir -r requirements.txt

# Expose port for Django
EXPOSE 8000

#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]