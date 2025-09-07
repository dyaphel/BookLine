## Overview
BookLine is a distributed system for managing a library’s catalog, users, and reservations. It follows a microservices architecture with a React frontend and multiple Django-based backend services. Services communicate over HTTP and share a single PostgreSQL database (per current docker-compose), with clear ownership of tables per service. The system is containerized and orchestrated via Docker Compose for local development.

Goals:
- Provide guests and registered users with catalog browsing, search, filtering, and detailed book views.
- Enable registered users to reserve books, join waitlists, manage their profile, and receive notifications.
- Provide librarians with tools for catalog management, reservation processing, QR-based verification, and analytics dashboards.


## Actors

- Guest: browses, searches, filters books.
- Registered User: authenticates, reserves/queues books, manages profile, gets notifications.
- Librarian: manages catalog, verifies reservations via QR, oversees reservations and analytics.

## High-Level Architecture 
Containers:
- Frontend (React/Vite) — Port 5173: SPA consuming backend APIs, implements routing and UI components per user stories.
- Users Service (Django) — Port 8003: user registration, authentication, profile management, user roles (user/librarian), profile images.
- Books Service (Django) — Port 8001: catalog CRUD, search, filter/sort, media for book covers.
- Reservations Service (Django) — Port 8002: reservations lifecycle, waitlists/queues, status transitions (to be fulfilled, borrowed, to be returned), notifications trigger points.
- QRCode Service (Django) — Port 8004: generate/validate QR codes for reservation verification.
- PostgreSQL — Port 5432: shared database instance across services (DATABASE_URL used by each service).
- pgAdmin — Port 5050: DB administration UI for developers.

Communication:
- Frontend → Microservices: REST over HTTP (fetch/axios in the SPA).
- Inter-service: REST over HTTP; services call one another where needed (e.g., reservations → books/users).
- Data: Single PostgreSQL instance with service-specific schemas/tables owned logically by their service.

##  Frontend Architecture
Tech stack:
- React (Vite dev server) with componentized UI in source/frontend/src.
- Routing under src/Routes; reusable UI under src/components and src/Utils.

## Backend Microservices

5.1 Users Service (users_service)
Responsibilities:
- Registration, login/logout, password reset.
- User profiles (first/last name, avatar), roles (end-user, librarian).
- Issue and validate authentication (session or token-based; project can evolve to JWT).
Public endpoints (indicative):
- POST /users/register, POST /users/login, POST /users/logout
- GET/PUT /users/me
- GET /users/health/
Data:
- users_user (+ profile tables, migrations under users/migrations), media/profile_images.

5.2 Books Service (books_service)
Responsibilities:
- Catalog CRUD (title, author, genre, year, availability, cover image path).
- Search, filter, sort; book details.
Public endpoints (indicative):
- GET /books, GET /books/{id}
- POST/PUT/DELETE /books (librarian only)
- GET /books/health/
Data:
- books_book and related tables; media/book_covers.

5.3 Reservations Service (reservations_service)
Responsibilities:
- Create reservation for available books.
- Manage waitlists when books are unavailable; queue advancement.
- Track reservation states: to be fulfilled, borrowed, to be returned, returned.
- Trigger notifications (conceptual), expose admin views for librarians.
Public endpoints (indicative):
- POST /reservations, GET /reservations/{id}, GET /reservations?userId=…
- POST /reservations/{id}/fulfill, POST /reservations/{id}/return
- GET /reservations/health/
Data:
- reservations_reservation, queue tables; references to user and book IDs.

5.4 QRCode Service (qrcode_service)
Responsibilities:
- Generate QR codes for reservations pick-up.
- Validate QR code scans to confirm reservation/checkout events.
Public endpoints (indicative):
- POST /qrcode/generate (reservationId)
- POST /qrcode/validate (payload or image/contents)
- GET /qrcode/health/
Data:
- Lightweight; may store issued codes or use stateless signing.

