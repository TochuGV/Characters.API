import { PrismaClient } from "@prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";
import env from "./environment.config.js";

const sqlConfig = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  server: env.DB_SERVER,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    trustedConnection: true
  }
};

const adapter = new PrismaMssql(sqlConfig);
const prisma = new PrismaClient({ adapter })

export default prisma;