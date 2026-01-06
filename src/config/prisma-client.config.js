import { PrismaClient } from "@prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";
import env from "./enviroment.config.js";

const adapter = new PrismaMssql(env.DB_URL);
const prisma = new PrismaClient({ adapter })

export default prisma;