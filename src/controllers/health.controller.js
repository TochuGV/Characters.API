import prisma from "../config/prisma-client.config.js";
import cacheManager from "../cache/cache.manager.js";
import env from "../config/environment.config.js";
import tryCatch from "../utils/try-catch.js";
import logger from "../logger/index.js";

const TIMEOUT_MS = 5000;

const timeoutPromise = (ms) => new Promise((_, reject) =>
  setTimeout(() => reject(new Error("Operation timed out")), ms)
);

const serviceDownHandler = (error) => {
  logger.error({ error: error.message }, "Health check service failed");
  return { status: 'DOWN', latency: null };
};

const checkService = tryCatch(async (promise) => {
  const start = Date.now();
  await Promise.race([promise, timeoutPromise(TIMEOUT_MS)]);
  return { status: 'UP', latency: `${Date.now() - start}ms` };
}, serviceDownHandler);

const getHealth = tryCatch(async (req, res) => {
  const cacheHealthPromise = env.USE_REDIS
    ? cacheManager.redisClient.ping()
    : Promise.resolve();

  const [database, cache] = await Promise.all([
    checkService(prisma.$queryRaw`SELECT 1`),
    checkService(cacheHealthPromise)
  ]);

  let status = 'UP';
  let httpCode = 200;

  if (database.status !== 'UP') {
    status = 'DOWN';
    httpCode = 503;
  } else if (cache.status !== 'UP') {
    status = 'DEGRADED';
    httpCode = 200;
  }

  const healthStatus = {
    status,
    timestamp: new Date(),
    uptime: Math.floor(process.uptime()),
    services: {
      database,
      cache: {
        ...cache,
        strategy: env.USE_REDIS ? 'Redis' : 'Local Memory'
      }
    }
  };

  return res.status(httpCode).json(healthStatus);
});

export default getHealth;