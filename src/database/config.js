import sql from "mssql"
import errorFactory from '../common/errors/error-factory.js';
import { handleDatabaseError } from './errors.js';
import env from '../configuration/enviroment.configuration.js';

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