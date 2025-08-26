# SYSTEM DESCRIPTION:

Bookline is a system that supports libraries in managing book reservations and circulation.
Users will be able to search for books in the catalog, reserve them, and join a queue when a book is already on loan. The system will notify the next user in line once the book becomes available.
In case a reserved book is not collected within the given timeframe, the reservation will be automatically reassigned to the next user.
Libraries will have access to a dashboard with statistics on reservations and borrowing trends, allowing them to identify the most popular books and genres.

# USER STORIES:

1. As a Guest, I want to browse all available books so that I can explore the entire catalog.
2. As a Guest, I want to search for books by author, genre, title, or publication date so that I can easily find specific books of interest.
3. As a Guest, I want to filter and sort books in the catalog so that I can quickly find the books I’m looking for.
4. As a Guest, I want to view detailed information about a book so that I can evaluate it before deciding to borrow or reserve it.
5. As a Guest, I want to create a personal account so that I can register and access additional services.
6. As a Registered User, I want to log in using my email and password so that I can access my profile and personalized services.
7. As a Registered User, I want to browse the entire book catalog so that I can explore all available options.
8. As a Registered User, I want to reserve available books so that I can visit the library and collect them later.
9. As a Registered User, I want to receive a confirmation when I successfully reserve a book so that I can confirm my reservation with the library staff.
10. As a Registered User, I want to join a waitlist when a book is unavailable so that I can be notified when it becomes available.
11. As a Registered User, I want to know when it’s my turn to collect a reserved book so that I can promptly visit the library.
12. As a Registered User, I want to view my personal area so that I can track my reservations, favorite books, and reading statistics.
13. As a Registered User, I want to edit my profile information so that I can keep my preferences and interests up to date.
14. As a Registered User, I want to receive personalized book recommendations so that I can find books based on my interests and reading habits.
15. As a Registered User, I want to delete my account from a settings page so that I can permanently remove my data from the system.
16. As a Librarian, I want to add or delete books from the catalog so that users always have access to the most current collection.
17. As a Librarian, I want to process and edit book information so that I can ensure the catalog is always accurate and up to date.
18. As a Librarian, I want to access a reservation management page so that I can track borrowed and returned books.
19. As a Librarian, I want to scan QR codes to verify book reservations so that I can manage the borrowing process efficiently.
20. As a Librarian, I want to access the library dashboard so that I can review user trends and improve library services accordingly.

# CONTAINERS:

## CONTAINER_NAME: users_service

### DESCRIPTION:
Manages user accounts, authentication (session-based), profiles, and roles (User, Librarian, Admin). Handles registration, login/logout, profile retrieval and update, password change, and account deletion. Serves profile images via Django media.

### USER STORIES:
5 ) Create a personal account (register)  
6 ) Log in using email and password  
12 ) View personal area/profile  
13 ) Edit profile information  
15 ) Delete account

### PORTS:
8003:8000

### PERSISTENCE EVALUATION
Requires persistent storage. Uses PostgreSQL to store user accounts, credentials (hashed), roles, and profile image paths. Media files are stored on disk within the service container volume (MEDIA_ROOT).

### EXTERNAL SERVICES CONNECTIONS
No external services. Frontend interacts directly via HTTP; CSRF/session cookies are used.

### MICROSERVICES:

#### MICROSERVICE: users_service
- TYPE: backend
- DESCRIPTION: Django REST views providing registration, authentication, profile, and account management.
- PORTS: 8000
- TECHNOLOGICAL SPECIFICATION:
  - Language/Framework: Python 3.10, Django 5.x, Django REST Framework
  - Auth: SessionAuthentication, CSRF tokens
  - DB: PostgreSQL (via docker-compose service db)
  - Media: profile_images under MEDIA_ROOT
  - CORS: allowed origin http://localhost:5173
- SERVICE ARCHITECTURE:
  - apps: users (models, serializers, views, urls)
  - endpoints mounted under /users/
  - custom user model (AUTH_USER_MODEL=users.CustomUser)

- ENDPOINTS:

  | HTTP METHOD | URL | Description | User Stories |
  | ----------- | --- | ----------- | ------------ |
  | GET | /users/health/ | Health check | - |
  | POST | /users/register/ | Register new user | 5 |
  | POST | /users/login/ | Login with username or email + password (session-based) | 6 |
  | GET | /users/csrf/ | Get CSRF token | 6 |
  | GET | /users/check-auth/ | Check session authentication | 6, 12 |
  | POST | /users/logout/ | Logout current session | 6 |
  | GET | /users/get_profile/ | Get current user profile | 12 |
  | GET | /users/get_by/<id> | Get user by id (auth required) | 12 |
  | DELETE | /users/delete_user/ | Delete current user | 15 |
  | POST | /users/change_password/ | Change password | 13 |
  | PUT | /users/update_profile/ | Update username/profile image | 13 |

- DB STRUCTURE:

  - Table users_customuser:
    | id | email (unique) | first_name | last_name | username (unique) | profile_image | role [USER|LIBRARIAN|ADMIN] | is_active | is_staff | password |


## CONTAINER_NAME: books_service

### DESCRIPTION:
Provides catalog management and discovery: list/search/sort books, view details, edit book metadata and cover (librarian use). Stores book covers in media.

### USER STORIES:
1 ) Browse all available books (guest)  
2 ) Search by author/genre/title/publication date  
3 ) Filter and sort books in the catalog  
4 ) View detailed information about a book  
16 ) Librarian add/delete books  
17 ) Librarian process/edit book information

### PORTS:
8001:8000

### PERSISTENCE EVALUATION
Requires persistent storage for catalog data and cover images (MEDIA_ROOT/book_covers). Uses PostgreSQL.

### EXTERNAL SERVICES CONNECTIONS
No external services.

### MICROSERVICES:

#### MICROSERVICE: books_service
- TYPE: backend
- DESCRIPTION: Django app serving book catalog endpoints and media for cover images.
- PORTS: 8000
- TECHNOLOGICAL SPECIFICATION:
  - Python 3.10, Django 5.x, DRF
  - DB: PostgreSQL
  - Media: book_covers under MEDIA_ROOT
- SERVICE ARCHITECTURE:
  - app: books (models, serializers, views, urls)
  - mounted under /books/

- ENDPOINTS:

  | HTTP METHOD | URL | Description | User Stories |
  | ----------- | --- | ----------- | ------------ |
  | GET | /books/health/ | Health check | - |
  | GET | /books/ | List books with search and filters (q, title, author, published, genre) | 1, 2, 3 |
  | GET | /books/<isbn>/ | Get book details by ISBN | 4 |
  | PUT/PATCH | /books/changeimage/<isbn>/ | Change book cover image | 16, 17 |
  | PUT/PATCH | /books/edit/<isbn>/ | Edit book fields (partial update) | 16, 17 |

- DB STRUCTURE:

  - Table books_book:
    | isbn (PK) | title | description | abstract | author | published (date) | cover (image) | genre | language | available_copies |


## CONTAINER_NAME: reservations_service

### DESCRIPTION:
Handles reservations lifecycle and queue management, including creation, cancellation, fulfillment, returns, availability checks, and listing by user/book. Enforces role-based access (User, Librarian, Admin) and updates queue and availability counters accordingly.

### USER STORIES:
8 ) Reserve available books  
9 ) Receive a confirmation upon successful reservation  
10 ) Join a waitlist when a book is unavailable  
11 ) Know when it’s your turn to collect a reserved book  
18 ) Librarian access reservation management (track borrowed/returned)

### PORTS:
8002:8000

### PERSISTENCE EVALUATION
Requires persistent storage. Uses PostgreSQL with relationships to books and users (imported unmanaged models for cross-service schema alignment). No external queues.

### EXTERNAL SERVICES CONNECTIONS
No external external services; interacts logically with books and users data through shared DB schema. Deployed in same Postgres instance.

### MICROSERVICES:

#### MICROSERVICE: reservations_service
- TYPE: backend
- DESCRIPTION: Django app to manage reservations and queue logic.
- PORTS: 8000
- TECHNOLOGICAL SPECIFICATION:
  - Python 3.10, Django 5.x, DRF
  - Auth: SessionAuthentication with role checks
  - DB: PostgreSQL
- SERVICE ARCHITECTURE:
  - app: reservations (models, serializers, views, urls)
  - mounted under /reservations/

- ENDPOINTS:

  | HTTP METHOD | URL | Description | User Stories |
  | ----------- | --- | ----------- | ------------ |
  | GET | /reservations/whoami/ | Return current authenticated user info | 12 |
  | GET | /reservations/all | List all reservations (librarian/admin only) | 18 |
  | GET | /reservations/<reservation_id>/ | Get reservation by id (librarian/admin) | 18 |
  | GET | /reservations/book/<isbn>/ | List reservations by book (librarian/admin) | 18 |
  | GET | /reservations/user/<user_id>/ | List reservations by user (self or librarian/admin) | 12, 18 |
  | GET | /reservations/book/<isbn>/availability/ | Check available copies considering active reservations | 1, 4 |
  | POST | /reservations/create/ | Create reservation; handles queue and ready_for_pickup | 8, 9, 10 |
  | PATCH | /reservations/fulfill/<reservation_id>/ | Mark as fulfilled (librarian/admin) | 18 |
  | POST | /reservations/return/<reservation_id>/ | Mark as returned and promote next in queue | 18 |
  | DELETE | /reservations/cancel/<reservation_id>/ | Cancel reservation and reflow queue | 10, 18 |

- DB STRUCTURE:

  - Table reservations_reservation:
    | id | user_id (FK users_customuser) | book_id (FK books_book) | timestamp | fulfilled (bool) | ready_for_pickup (bool) | returned (bool) | position (int, queue) | cancelled (bool) |


## CONTAINER_NAME: qrcode_service

### DESCRIPTION:
Generates QR codes representing reservation tokens/identifiers to support librarian scanning and verification flows.

### USER STORIES:
19 ) Librarian scans QR codes to verify book reservations

### PORTS:
8004:8000

### PERSISTENCE EVALUATION
No DB persistence required. Codes are generated on demand and returned as images/bytes by the service.

### EXTERNAL SERVICES CONNECTIONS
No external services.

### MICROSERVICES:

#### MICROSERVICE: qrcode_service
- TYPE: backend
- DESCRIPTION: Django service exposing QR code generation endpoint.
- PORTS: 8000
- TECHNOLOGICAL SPECIFICATION:
  - Python 3.10, Django 4.x/5.x
  - Likely uses qrcode/Pillow libraries for generation
- SERVICE ARCHITECTURE:
  - app: qrcodes (views, urls)
  - mounted under /qrcodes/

- ENDPOINTS:

  | HTTP METHOD | URL | Description | User Stories |
  | ----------- | --- | ----------- | ------------ |
  | GET/POST | /qrcodes/generate/ | Generate a QR code for provided payload (implementation specific) | 19 |


## CONTAINER_NAME: bookline_frontend

### DESCRIPTION:
Single Page Application for guests, registered users, and librarians. Provides browsing, search, reservation flows, personal area, and librarian dashboards (analytics, reservations, QR scanning access).

### USER STORIES:
1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 18, 19, 20

### PORTS:
5173:5173

### PERSISTENCE EVALUATION
No persistent DB. Uses browser storage for transient UI state only.

### EXTERNAL SERVICES CONNECTIONS
No third-party services. Talks to backend services over HTTP at localhost ports via docker-compose or Vite dev server.

### MICROSERVICES:

#### MICROSERVICE: bookline_frontend
- TYPE: frontend
- DESCRIPTION: React (Vite) SPA for Bookline.
- PORTS: 5173
- PAGES:

  | Name | Description | Related Microservice | User Stories |
  | ---- | ----------- | -------------------- | ------------ |
  | Home | Landing/catalog browsing, search, sort | books_service | 1, 2, 3 |
  | Login | Authentication page | users_service | 6 |
  | Register | Registration page | users_service | 5 |
  | Profile | Personal area (reservations, favorites, stats UI) | users_service, reservations_service | 12, 13, 15 |
  | Book Details | View details and reserve | books_service, reservations_service | 4, 8, 10, 11 |
  | Librarian Dashboard | Analytics, reservations management, QR scan entry | reservations_service, qrcode_service | 18, 19, 20 |


## CONTAINER_NAME: bookline_db

### DESCRIPTION:
PostgreSQL database hosting all schemas used by services (users, books, reservations). Shared across backend containers.

### USER STORIES:
Supports persistence for stories involving accounts, catalog, and reservations (5–6, 8–15, 16–20).

### PORTS:
5432:5432

### PERSISTENCE EVALUATION
Requires volume-backed storage to persist data across restarts (db_data volume).

### EXTERNAL SERVICES CONNECTIONS
Exposed to backend services only via internal Docker network.

### MICROSERVICES:

#### MICROSERVICE: postgres
- TYPE: database
- DESCRIPTION: PostgreSQL instance with healthcheck.
- PORTS: 5432
- DB STRUCTURE:
  - users_service creates table users_customuser (custom user model)
  - books_service creates table books_book (book catalog)
  - reservations_service creates table reservations_reservation (reservations)


## CONTAINER_NAME: bookline_pgadmin

### DESCRIPTION:
Web-based administration tool to manage the PostgreSQL database.

### USER STORIES:
Developer/administrator convenience (supporting librarian/admin features and data checks).

### PORTS:
5050:80

### PERSISTENCE EVALUATION
Stores its own configuration in a dedicated volume (pgadmin-data). No business data.

### EXTERNAL SERVICES CONNECTIONS
Connects to the PostgreSQL container.

### MICROSERVICES:

#### MICROSERVICE: bookline_pgadmin
- TYPE: admin tool
- DESCRIPTION: pgAdmin 4 Docker image configured via docker-compose.
- PORTS: 80
