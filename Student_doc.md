# SYSTEM DESCRIPTION:

Bookline is a system that supports libraries in managing book reservations and circulation.
Users will be able to search for books in the catalog, reserve them, and join a queue when a book is already on loan. The system will notify the next user in line once the book becomes available.
In case a reserved book is not collected within the given timeframe, the reservation will be automatically reassigned to the next user.
Libraries will have access to a dashboard with statistics on reservations and borrowing trends, allowing them to identify the most popular books and genres.

# USER STORIES:

1. As a Guest, I want to browse all available books so that I can explore the entire catalog.
2. As a Guest, I want to search for books by author, genre, title, or publication date so that I can easily find specific books of interest.
3. As a Guest, I want to create a personal account so that I can register and access additional services.
4. As a Guest, I want to log in when I already have an account so that I can access user-specific benefits.
5. As a Guest, I want to filter and sort books in the catalog so that I can quickly find the books I’m looking for.
6. As a Guest, I want to view detailed information about a book so that I can evaluate it before deciding to borrow or reserve it.
7. As a Guest, I want to receive recommendations based on trending books so that I can discover popular titles.
8. As a Registered User, I want to browse the entire book catalog so that I can explore all available options.
9. As a Registered User, I want to reserve available books so that I can visit the library and collect them later.
10. As a Registered User, I want to receive a confirmation when I successfully reserve a book so that I can confirm my reservation with the library staff.
11. As a Registered User, I want to join a waitlist when a book is unavailable so that I can be notified when it becomes available.
12. As a Registered User, I want to be notified when it’s my turn to collect a reserved book so that I can promptly visit the library.
13. As a Registered User, I want to view my personal area so that I can track my reservations, favorite books, and reading statistics.
14. As a Registered User, I want to edit my profile information so that I can keep my preferences and interests up to date.
15. As a Registered User, I want to log in using my email and password so that I can access my profile and personalized services.
16. As a Registered User, I want to delete my account from a settings page so that I can permanently remove my data from the system.
17. As a Registered User, I want to receive personalized book recommendations so that I can find books based on my interests and reading habits.
18. As a Librarian, I want to process and edit book information so that I can ensure the catalog is always accurate and up to date.
19. As a Librarian, I want to add or delete books from the catalog so that users always have access to the most current collection.
20. As a Librarian, I want to access the library dashboard so that I can review user trends and improve library services accordingly.
21. As a Librarian, I want to scan QR codes to verify book reservations so that I can manage the borrowing process efficiently.
22. As a Librarian, I want to access a reservation management page so that I can track borrowed and returned books.
23. As a Librarian, I want to automatically notify users about overdue books so that returns are timely and stock remains available.

# CONTAINERS:

## CONTAINER_NAME: <name of the container>

### DESCRIPTION:
<description of the container>

### USER STORIES:
<list of user stories satisfied>

### PORTS:
<used ports>

### DESCRIPTION:
<description of the container>

### PERSISTENCE EVALUATION
<description on the persistence of data>

### EXTERNAL SERVICES CONNECTIONS
<description on the connections to external services>

### MICROSERVICES:

#### MICROSERVICE: <name of the microservice>
- TYPE: backend
- DESCRIPTION: <description of the microservice>
- PORTS: <ports to be published by the microservice>
- TECHNOLOGICAL SPECIFICATION:
  <description of the technological aspect of the microservice>
- SERVICE ARCHITECTURE:
  <description of the architecture of the microservice>

- ENDPOINTS: <put this bullet point only in the case of backend and fill the following table>

  | HTTP METHOD | URL | Description | User Stories |
  	| ----------- | --- | ----------- | ------------ |
  | ... | ... | ... | ... |

- PAGES: <put this bullet point only in the case of frontend and fill the following table>

  | Name | Description | Related Microservice | User Stories |
  	| ---- | ----------- | -------------------- | ------------ |
  | ... | ... | ... | ... |

- DB STRUCTURE: <put this bullet point only in the case a DB is used in the microservice and specify the structure of the tables and columns>

  **_<name of the table>_** :	| **_id_** | <other columns>

#### <other microservices>

## <other containers>
