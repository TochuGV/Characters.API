import 'dotenv/config'

if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_SERVER || !process.env.DB_NAME){
  throw new Error("Database must be configured in the .env file")
}

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
    trustedConnection: true,
  },
};

export default config;