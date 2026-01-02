import sql from "mssql"
import handleDatabaseError from './error-mapper.js';
import env from '../config/enviroment.config.js';

const dbSettings = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  server: env.DB_SERVER,
  database: env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    trustedConnection: true
  }
};

export const getConnection = async () => {
  try {
    return await sql.connect(dbSettings);
  } catch(error) {
    handleDatabaseError(error);
  };
};

export { sql };