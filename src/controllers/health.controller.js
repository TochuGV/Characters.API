import prisma from "../config/prisma-client.config.js";
import cacheManager from "../cache/cache.manager.js";
import env from "../config/environment.config.js";
import tryCatch from "../utils/try-catch.js";
import logger from "../logger/index.js";

const timeoutPromise = (ms, promise) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("Timeout"));
    }, ms);
    
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
};

const silentErrorHandler = () => null;

const checkDatabase = tryCatch(async () => {
  return await timeoutPromise(3000, prisma.$queryRaw`SELECT 1`);
}, silentErrorHandler);

const checkRedis = tryCatch(async () => {
  return await timeoutPromise(1000, cacheManager.redisClient.ping());
}, silentErrorHandler);

const getHealth = tryCatch(async (req, res) => {
  logger.debug("[GET] /health - Performing health check");

  const startTime = Date.now();

  const healthStatus = {
    status: "UP",
    timestamp: new Date(),
    uptime: Math.floor(process.uptime()),
    responseTime: 0,
    services: {
      database: { status: "UNKNOWN", responseTime: 0 },
      cache: { status: "UNKNOWN", responseTime: 0 }
    }
  };

  const databaseStart = Date.now();
  const databaseResult = await checkDatabase();
  healthStatus.services.database.responseTime = Date.now() - databaseStart;

  if (databaseResult) {
    healthStatus.services.database.status = "UP";
  } else {
    healthStatus.services.database.status = "DOWN";
    healthStatus.status = "DOWN";
  };

  if (env.USE_REDIS) {
    const cacheStart = Date.now();
    const redisResult = await checkRedis();
    healthStatus.services.cache.responseTime = Date.now() - cacheStart;

    if (redisResult === "PONG") {
      healthStatus.services.cache.status = "UP (Redis)";
    } else {
      healthStatus.services.cache.status = "DOWN (Redis)";
      if (healthStatus.status !== "DOWN") healthStatus.status = "DEGRADED";
    };
  } else {
    healthStatus.services.cache.status = "UP (Local Memory)";
    healthStatus.services.cache.responseTime = 0;
  };

  healthStatus.responseTime = Date.now() - startTime;
  const statusCode = healthStatus.status === "DOWN" ? 503 : 200;
  
  return res.status(statusCode).json({
    status: healthStatus.status === "DOWN" ? "error" : "success",
    data: healthStatus
  });
});

export default getHealth;