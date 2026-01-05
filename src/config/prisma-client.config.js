import { PrismaClient } from "@prisma/client";
import env from "./enviroment.config.js";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DB_URL
    }
  }
});

export default prisma;