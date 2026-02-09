# 🎭 Characters.API

📌 **Characters.API** is a RESTful API for managing characters and movies, built with **Node.js**, **Express** and **SQL Server**. It includes secure authentication, data validation, performance optimization, enhanced security, and comprehensive API documentation.

---

## 🚀 Getting Started

You can run the full application stack (API + DB + Redis) instantly using Docker, without cloning the source code.

### Prerequisites

- [**Docker**](https://docs.docker.com/get-docker/)
- [**Docker Compose**](https://docs.docker.com/compose/install/)
- [**Node.js**](https://nodejs.org/en) (If you want to install for local development)

---

## ⚡ Quick Start (Recommended)

### 1️⃣ Create the compose file:

Create a new folder and inside it, create a file named `docker-compose.yml` with the following content:

```yaml
services:
  api:
    image: tochugv/characters-api:latest
    container_name: characters_api_server
    ports:
      - "3000:3000"
    environment:
      # --- Server configuration ---
      - NODE_ENV=production
      - PORT=3000
          
      # --- Database configuration ---
      - DB_SERVER=sqlserver
      - DB_NAME=Characters.API
      - DB_USER=sa
      - DB_PASSWORD=P@ssw0rd
          
      # --- Security ---
      - JWT_ACCESS_SECRET_KEY=AccessToken
      - JWT_REFRESH_SECRET_KEY=RefreshToken
      - JWT_ACCESS_EXPIRES_IN=15m
      - JWT_REFRESH_EXPIRES_IN=7d
      - SALT_ROUNDS=10

      # --- Rate limit configuration ---
      - RATE_LIMIT_WINDOW=900000
      - RATE_LIMIT_MAX=60

      # --- Compression configuration ---
      - COMPRESSION_THRESHOLD=1000
      - COMPRESSION_LEVEL=6
          
      # --- Caching (Redis enabled) ---
      - USE_REDIS=true
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - CACHE_TTL_REDIS=3600
      - CACHE_TTL_LOCAL=60
      - CACHE_CHECK_PERIOD_LOCAL=600

      # --- Logging ---
      - LOG_LEVEL=info

    depends_on:
      sqlserver:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - app_network

  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: characters_api_sqlserver
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=P@ssw0rd
      - MSSQL_PID=Developer
    ports:
      - "1433:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql
    healthcheck:
      test: /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P P@ssw0rd -Q "SELECT 1" -C
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 30s
    networks:
      - app_network

  redis:
    image: redis:alpine
    container_name: characters_api_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app_network

  redis_commander:
    image: rediscommander/redis-commander:latest
    container_name: redis_ui
    environment:
      - REDIS_HOSTS=local:redis:6379
    ports:
      - "8081:8081"
    depends_on:
      - redis
    networks:
      - app_network

volumes:
  sqlserver_data:
  redis_data:

networks:
  app_network:
    driver: bridge
```

### 2️⃣ Run the stack:

Open your terminal in that folder and run:

```bash
docker-compose up -d
```

> [!NOTE]
> The API image will be pulled automatically from [**Docker Hub**](https://hub.docker.com/r/tochugv/characters-api). <br>
> First startup takes around 30 seconds while SQL Server initializes and migrations run.

### 3️⃣ Verify it's running:

Once all containers are up, you can access:

| Service | URL |
| :--- | :--- |
| 🚀 **API** | [http://localhost:3000](http://localhost:3000) |
| 📚 **API Documentation (Swagger)** | [http://localhost:3000/api-docs](http://localhost:3000/api-docs) |
| ❤️ **Health Check** | [http://localhost:3000/health](http://localhost:3000/health) |
| 📊 **Metrics** | [http://localhost:3000/metrics](http://localhost:3000/metrics) |
| 🔴 **Redis Commander (GUI)** | [http://localhost:8081](http://localhost:8081) |

#### 🛑 Stop the stack

To stop the containers, run:

```bash
# Stop containers and remove network:
docker-compose down

# Stop and remove volumes:
docker-compose down -v
```

---

### 💻 Local Development (Optional)

### 1️⃣ Clone the repository:

```bash
git clone https://github.com/TochuGV/Characters.API.git
cd Characters.API
```

### 2️⃣ Install dependencies:

```bash
npm install
```

### 3️⃣ Set up the environment variables:
- Into `server`, rename `.env.example` file to `.env`.
- Open that file and replace the values with your own:

![EnvironmentVariables](./assets/images/env-example.png)

### 4️⃣ Start infrastructure services:

```bash
npm run services:up
```

### 5️⃣ Run database migrations and seed

```bash
npm run prisma:migrate
npm run prisma:seed
```

### 6️⃣ Start the development server

```bash
npm run dev
```

✅ The API should now be running on `http://localhost:your_port`.

---

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

---

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

---

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

---

## 🔐 Authentication & Security

The API uses a **Hybrid Authentication Strategy** (Stateless JWT + Stateful Cookies) to balance security and usability.

### 1️⃣ The Dual-Token Flow

| Token | Storage | Lifespan | Purpose |
| :--- | :--- | :--- | :--- |
| **Access Token** | Memory (JSON Response) | ⏱️ 15m | Access protected resources via `Authorization: Bearer` header. |
| **Refresh Token** | `HttpOnly` Cookie | 🗓️ 7d | Securely obtain new access tokens without re-login. |

### 2️⃣ Auth Endpoints

| Method | Endpoint | 🔒 Scope | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | 🟢 Public | Register a new user. |
| **POST** | `/auth/login` | 🟢 Public | Login an existing user and receive access/refresh tokens. |
| **POST** | `/auth/logout` | 🟢 Public | Logout the current user revoking refresh token. |
| **POST** | `/auth/refresh` | 🟢 Public | Request a new access token using a valid refresh token cookie. |

---
## 📚 Domain Resources

### 🔑 Access Levels
| Icon | Scope | Requirement |
| :--- | :--- | :--- |
| 👤 | **User** | Requires a valid **Access Token** in the Header. |
| 🛡️ | **Admin** | Requires **Access Token** + **Admin Role**. |

### 🎭 Characters

| Method | Endpoint | 🔒 Scope | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/characters` | 👤 User | Get all characters. <br><sub>🔍 *Supports filtering by: `name`, `age`, `weight`, `movie`, `page`, `limit`.*</sub> |
| **GET** | `/characters/:id` | 👤 User | Get character by ID. |
| **POST** | `/characters` | 🛡️ Admin | Create a new character. <br><sub>🔄 *Supports **Idempotency**.*</sub> |
| **PUT** | `/characters/:id` | 🛡️ Admin | Update an existing character. |
| **DELETE** | `/characters/:id` | 🛡️ Admin | Delete a character. |

### 🎬 Movies

| Method | Endpoint | 🔒 Scope | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/movies` | 👤 User | Get all movies. <br><sub>🔍 *Supports filtering by: `title`, `order`, `page`, `limit`.*</sub> |
| **GET** | `/movies/:id` | 👤 User | Get movie by ID. |
| **POST** | `/movies` | 🛡️ Admin | Create a new movie. <br><sub>🔄 *Supports **Idempotency**.*</sub> |
| **PUT** | `/movies/:id` | 🛡️ Admin | Update an existing movie. |
| **DELETE** | `/movies/:id` | 🛡️ Admin | Delete a movie. |
| **POST** | `/movies/:id/characters` | 🛡️ Admin | Associate a character to a movie. <br><sub>🔄 *Supports **Idempotency**.*</sub> |
| **DELETE** | `/movies/:id/characters/:characterId` | 🛡️ Admin | Remove a character from a movie. |

## 🩺 Observability & Monitoring

Designed for production reliability, the API provides tools to track uptime, resource usage, and connectivity.

### 1️⃣ HTTP Endpoints (DevOps)
These endpoints are optimized for automated health checks (Docker/Kubernetes) and metric scrapers (Prometheus).

| Method | Endpoint | 🔒 Scope | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/health` | 🟢 Public | **Health Check.** Returns server status and database connectivity. |
| **GET** | `/metrics` | 🟢 Public | **Custom System Metrics.** Returns process memory, uptime, and request statistics (JSON). |

### 2️⃣ Terminal Monitor (CLI)
A lightweight script to view real-time server stats directly in your console, without external tools.

**How to use:**
1. Ensure the API is running (`npm run dev` or via Docker).
2. Open a new terminal window and run:

```bash
npm run monitor
```

---

## 🔮 Future Improvements

### ☁️ Infrastructure & Database
- [ ] 🐘 **Migrate to Supabase:** Transition from local **SQL Server** to a managed, cloud-native **PostgreSQL** instance for better scalability and ease of deployment.
- [ ] ⚡ **Performance Optimization:** Implement a `CircularBuffer` class for `MetricsCollector` to ensure predictable memory usage (constant `O(1)` space complexity).

### 🏗️ API & Architecture
- [ ] 📘 **Migrate to TypeScript:** Refactor the entire codebase from **JavaScript** to **TypeScript** to enhance type safety, maintainability, and developer experience.
- [ ] 🚀 **Cursor-Based Pagination:** Implement high-performance pagination using cursors (instead of offset-based) for optimized scrolling on large datasets.
- [ ] 🧩 **Microservices Architecture:** Decouple the Authentication module into a standalone service to isolate responsibilities.

### 💻 Client & Security
- [ ] 🎨 **Frontend Development:** Build a **React/Next.js** interface to consume the API.
- [ ] 🛡️ **Strict CSP Implementation:** Research and implement `nonce` or `hash` strategies for Helmet to allow safe inline scripts in the new Frontend.

### 🧪 Testing & QA
- [ ] 🤖 **CI/CD Pipeline:** Integrate **Postman/Newman** into GitHub Actions for automated E2E testing.
- [ ] ♻️ **Test Suite Refactoring:** Improve expressiveness and maintainability of existing integration tests.
- [ ] 🎯 **Unit Testing:** Increase coverage with **Jest** for specific business logic edge cases.
