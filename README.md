# 🎭 Characters.API

> [!WARNING]
> **Documentation Outdated:** This project has been recently refactored, but this README still reflects the old architecture (March 2025). Updates coming soon.

📌 **Characters.API** is a RESTful API for managing characters and movies, built with **Node.js**, **Express** and **SQL Server**. It includes secure authentication, data validation, performance optimization, enhanced security, and comprehensive API documentation.

## 🚀 Installation Guide
### 1️⃣ Clone the repository:
~~~
git clone https://github.com/TochuGV/Characters.API.git
cd Characters.API
~~~
### 2️⃣ Install dependencies:
~~~
npm install
~~~
### 3️⃣ Set up the environment variables:
- Create a `.env` file in the root directory.
- Copy and paste the following template, then replace the values with your own:

![EnvironmentVariables](./assets/images/env-example.pngd)

>[!IMPORTANT]
>Before starting the server, make sure to execute the `script.sql` file inside your **SQL Server** database.
>This will create the required tables and relationships for the API to function correctly.

### 4️⃣ Start the server:
~~~
npm start
~~~
✅ The API should now be running on `http://localhost:your_port`.

## 🛠️ Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Core** | [**Node.js**](https://nodejs.org/) / [**Express**](https://expressjs.com/) | Main runtime and web framework. |
| **Database & ORM** | [**Prisma**](https://www.prisma.io/) / [**SQL Server**](https://www.microsoft.com/sql-server) | Type-safe ORM and relational database. |
| **Validation** | [**Zod**](https://zod.dev/) | Schema validation and strict type inference. |
| **Authentication** | [**Passport**](https://www.passportjs.org/) / [**JWT**](https://jwt.io/) | Hybrid Auth (Stateless Access + Stateful Refresh). |
| **Security** | [**Helmet**](https://helmetjs.github.io/) / [**Bcrypt**](https://www.npmjs.com/package/bcrypt) <br> [**Cookie Parser**](https://www.npmjs.com/package/cookie-parser) | HTTP headers hardening and password hashing. <br> Secure HTTP-Only cookie parsing. |
| **Caching** | [**Redis**](https://redis.io/) / [**NodeCache**](https://www.npmjs.com/package/node-cache) | Hybrid caching strategy (Distributed vs. In-Memory). |
| **Logging** | [**Pino**](https://getpino.io/) | High-performance, low-overhead structured logging. |
| **Performance** | [**Compression**](https://www.npmjs.com/package/compression) <br> [**Rate Limit**](https://www.npmjs.com/package/express-rate-limit) | Gzip response compression for lower latency. <br> DDOS protection and traffic control. |
| **Testing** | [**Jest**](https://jestjs.io/) / [**Supertest**](https://www.npmjs.com/package/supertest) | Integration testing for API endpoints. |
| **Infrastructure** | [**Docker**](https://www.docker.com/) / [**Docker Compose**](https://docs.docker.com/compose/) | Containerization and local service orchestration. |
| **Documentation** | [**Swagger UI**](https://swagger.io/tools/swagger-ui/) | Interactive API documentation and testing interface. |

## 🏗️ Architecture & Design Decisions

> [!IMPORTANT]  
> **Production-Grade Simulation:** Although this project is a portfolio demonstration and not intended for a live production environment, it was engineered following **industry-standard best practices**, focusing on scalability, security, and maintainability as if it were a real-world critical system.

### 📐 Architectural Style
The project follows a **Layered Architecture** where **Dependency Injection** is used to decouple components. A centralized `Container` injects Repositories into Services, and Services into Controllers, ensuring modularity and testability.

* **Controllers:** Handle HTTP requests, parsing, and response formatting.
* **Services:** Encapsulate business logic, ensuring that rules are applied consistently.
* **Repositories (DAL):** Abstract the data access layer. The rest of the application is agnostic to the underlying database implementation (Prisma/SQL Server).
* **Schemas (DTO):** Strict schema validation ensures that only valid data reaches the service layer.

### 🧩 Design Patterns
Specific technical solutions implemented to solve common problems:
| Pattern | Type | Implementation & Usage |
| :--- | :--- | :--- |
| **Singleton** | *Creational* | Ensures a single instance for `PrismaClient`, `Logger`, and the `CacheManager`. |
| **Factory Method** | *Creational* | Implemented in `ErrorFactory` to standardize error object creation across the app. |
| **Adapter** | *Structural* | The `CacheManager` acts as an adapter, unifying `Redis` and `Node-Cache` interfaces into a single API. |
| **Chain of Responsibility**| *Behavioral*| Utilized by **Express Middleware** pipeline (Auth, Validation, Error Handling) to process requests sequentially. |
| **Strategy** | *Behavioral* | Implemented via **Passport.js** to handle authentication logic (JWT Strategy) interchangeable with other methods. |

### ⚡ Hybrid Caching Strategy
A custom **Dual-Layer Caching System** implementing the **Fallback Pattern**:
1.  **Primary Layer (Redis):** Distributed cache ideal for production environments.
2.  **Fallback Layer (In-Memory):** If Redis is unavailable or disabled (e.g., local development), the system automatically downgrades to `node-cache` (RAM).
>[!NOTE]
> This ensures the API remains fast and resilient even if the external cache service fails.

### 🔄 Idempotency
To prevent data inconsistency during network retries, **Idempotency** is implemented on critical creation endpoints (`POST`).
* **Mechanism:** Clients can include a unique `Idempotency-Key` header in the request.
* **Behavior:** The server caches the response of the first successful operation. Subsequent requests with the same key return the cached result instantly, preventing duplicate resource creation.

### 🩺 Observability
* **Health Checks:** A dedicated `/health` endpoint monitors the uptime and the connectivity status of the Database and Redis.
* **Custom Metrics:** The `/metrics` endpoint provides real-time insights into memory usage (Heap/RSS) and request throughput without external heavy dependencies.

## 📂 Project Structure

```bash
📂
├──📂assets                 # 🖼️ Static resources (architecture diagrams, screenshots)
├──📂postman                # 📮 Postman collection for automated testing
├──📂prisma                 # 🏛️ Database schema, migrations and seed data
├──📂src
│   ├──📂cache              # 🗄️ Hybrid caching strategy (Redis + In-Memory)
│   ├──📂collectors         # 📊 System metrics collection logic
│   ├──📂config             # 🛠️ Environment and third-party configurations
│   ├──📂container          # 💉 Dependency Injection setup
│   ├──📂controllers        # 🎮 HTTP request handlers (entry points)
│   ├──📂errors             # ❌ Custom error handling & factory
│   ├──📂logger             # 📝 Structured logging configuration (Pino)
│   ├──📂middlewares        # 🚦 Request pipeline (auth, validation, limits)
│   ├──📂repositories       # 💾 Data Access Layer (DAL) - Database interactions
│   ├──📂routes             # 🛤️ API route definitions
│   ├──📂schemas            # 📜 Zod validation schemas (DTOs)
│   ├──📂scripts            # 🤖 Maintenance and utility scripts
│   ├──📂services           # 🧠 Business logic (Pure & Reusable)
│   ├──📂swagger            # 📑 OpenAPI/Swagger documentation components
│   ├──📂tests              # 🧪 Integration tests
│   └──📂utils              # 🧰 Shared helper functions
├──⚙️.env.example           # 🔐 Environment variables template
├──🐳docker-compose.yml     # 🧩 Container orchestration definition
└──🐋Dockerfile             # 📦 Application container image definition
```

## 📌 Endpoints

### 🎭 Characters

| Method | Endpoint | 🔒 Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/characters` | 🟢 Public | Get all characters (supports filtering by `name`, `age`, `weight`, `movie`, `page`, `limit`). |
| **GET** | `/characters/:id` | 🟢 Public | Get character by ID. |
| **POST** | `/characters` | 🛡️ Admin | Create a new character. **(Supports 🔄 Idempotency)** |
| **PUT** | `/characters/:id` | 🛡️ Admin | Update an existing character. |
| **DELETE** | `/characters/:id` | 🛡️ Admin | Delete a character. |

### 🎬 Movies

| Method | Endpoint | 🔒 Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/movies` | 🟢 Public | Get all movies (supports filtering by `title`, `order`, `page`, `limit`). |
| **GET** | `/movies/:id` | 🟢 Public | Get movie by ID. |
| **POST** | `/movies` | 🛡️ Admin | Create a new movie. **(Supports 🔄 Idempotency)** |
| **PUT** | `/movies/:id` | 🛡️ Admin | Update an existing movie. |
| **DELETE** | `/movies/:id` | 🛡️ Admin | Delete a movie. |
| **POST** | `/movies/:id/characters` | 🛡️ Admin | Add a character to a movie. **(Supports 🔄 Idempotency)** |
| **DELETE** | `/movies/:id/characters/:characterId` | 🛡️ Admin | Remove a character from a movie. |

### 🔐 Authentication

| Method | Endpoint | 🔒 Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | 🟢 Public | Register a new user. |
| **POST** | `/auth/login` | 🟢 Public | Login an existing user and receive access/refresh tokens. |
| **POST** | `/auth/logout` | 🟢 Public | Logout the current user revoking refresh token. |
| **POST** | `/auth/refresh` | 🟢 Public | Request a new access token using a valid refresh token cookie. |

### ⚙️ System & Monitoring

| Method | Endpoint | 🔒 Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/health` | 🟢 Public | **Health Check.** Returns server status and database connectivity. |
| **GET** | `/metrics` | 🟢 Public | **Custom System Metrics.** Returns process memory, uptime, and request statistics (JSON). |

> [!NOTE]  
> The full API documentation can be found at [http://localhost:3000/api-docs](http://localhost:3000/api-docs). This includes all available endpoints, query parameters, request bodies, and responses.

## 🔐 Authentication

### 1️⃣ User Registration:

📌 **Endpoint:** `POST /auth/register`<br>
📌 **Description:** Creates a new user with an encrypted password.

📍 **Request Body:**
~~~
{
  "Email": "user.example@gmail.com",
  "Password": 123456
}
~~~

### 2️⃣ User Login:

📌 **Endpoint:** `POST /auth/login`<br>
📌 **Description:** Authenticates the user and returns a JWT token in an HTTP-only cookie. Because of this cookie's attribute, it means it's not accessible to JavaScript running in the browser.

📍 **Request Body:**
~~~
{
  "Email": "user.example@gmail.com",
  "Password": 123456
}
~~~

### 3️⃣ Accessing Protected Routes:

📌 **Description:** To access protected routes, the user must send the JWT token in their HTTP request. This is validated using a middleware that checks the presence of the token in the cookie or in the Authorization Header.

This is the middleware mentioned above:

![AuthMiddleware](./assets/images/auth-middleware-code.png)

### 4️⃣ Token Expiration & Refresh:

📌 **Description:** Tokens have an expiration time. Once expired, users need to re-authenticate.

### 5️⃣ User Logout:

📌 **Endpoint:** `POST /auth/logout`<br>
📌 **Description:** Clears the authentication cookie, logging the user out.

![LogoutUser](./assets/images/logout-user-code.png)

## 🌱 Future Improvements

- [ ] 🔐 Implement roles and permissions for users.
- [ ] 📊 Add logs and monitoring to the API.
- [ ] 🔑 Implement access and refresh tokens for enhanced security.
- [ ] 📌 Implement automated tests.
- [ ] 📄 More detailed documentation of the endpoints in Swagger.
- [ ] 🗄️ Improve error handling with more specific error codes, especially for SQL Server database errors.
