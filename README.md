# 🎭 Characters.API

📌 **Characters.API** is a RESTful API for managing characters and movies, built with **Node.js**, **Express** and **SQL Server**. It provides: 
- **Secure authentication** with `jsonwebtoken` and `bcrypt` for password hashing.
- **Data validation** using `Zod` to ensure correct input handling.
- **Performance optimization**, including caching with `node-cache` and response compression with `compression`.
- **Security enhancements** using `helmet`, `cors` for CORS management, and `express-rate-limit` for rate limiting.
- **Database integration** with `mssql` for seamless SQL Server interaction.
- **API documentation** with `swagger-ui-express`.
- **Cookie handling** with `cookie-parser` and authentication support via `passport` and `passport-jwt`.

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

```
# Database configuration
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_SERVER=your_database_server
DB_NAME=your_database_name

# Database tables
DB_CHARACTER_TABLE=your_character_table_name
DB_MOVIE_TABLE=your_movie_table_name
DB_CHARACTERSXMOVIES_TABLE=your_charactersxmovies_table_name
DB_USER_TABLE=your_user_table_name

# Server configuration
PORT=your_port

# Security
JWT_SECRET_KEY=your_jwt_secret_key # Use a secure key and store it securely

# Rate limit configuration
RATE_LIMIT_WINDOW=your_rate_limit_window # Time window in minutes
RATE_LIMIT_MAX=your_rate_limit_max # Maximum requests per window

# Compression configuration
COMPRESSION_THRESHOLD=your_compression_threshold # Minimum size in bytes to compress responses
COMPRESSION_LEVEL=your_compression_level # Compression level (0-9)

# Cache configuration
CACHE_TTL=your_cache_ttl # Cache lifetime in seconds
CACHE_CHECK_PERIOD=your_cache_check_period # Interval to clear the cache in seconds
```
<!--![dotenv](./src/assets/dotenv-code.png)-->

### 4️⃣ Start the server:
~~~
npm start
~~~
✅ The API should now be running on `http://localhost:your_port`.
