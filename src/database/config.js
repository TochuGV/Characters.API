import 'dotenv/config'
import sql from "mssql"

if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_SERVER || !process.env.DB_NAME){
  throw new Error("Database must be configured in the .env file");
};

export const dbSettings = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    trustedConnection: true
  },
};

export const getConnection = async () => {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch(error){
    console.error(error);
  };
};

export { sql };
