# SYSTEM DESCRIPTION:

<system of the system>

# USER STORIES:

<list of user stories>


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
