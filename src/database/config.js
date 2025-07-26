import 'dotenv/config'
import sql from "mssql"
import errorFactory from '../common/errors/error-factory.js';
import { handleDatabaseError } from './errors.js';

if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_SERVER || !process.env.DB_NAME) throw errorFactory.createError("DATABASE", "Database must be configured in the .env file");

const dbSettings = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    trustedConnection: true
  }
};

export const getConnection = async () => {
  try {
    return await sql.connect(dbSettings);
  } catch(error){
    handleDatabaseError(error);
  };
};

export { sql };
