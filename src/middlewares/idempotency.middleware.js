import cacheManager from "../cache/cache.manager.js";
import tryCatch from "../utils/try-catch.js";
import logger from "../logger/index.js";
import CACHE_TTL from "../config/cache.constants.js";

const idempotencyMiddleware = tryCatch(async (req, res, next) => {
  if (req.method !== 'POST') return next();

  const key = req.headers['idempotency-key'];
  if (!key) return next();

  const userId = req.user?.id;
  const cacheKey = `idempotency:${userId}:${key}`;
  const cachedData = await cacheManager.get(cacheKey);

  if (cachedData) {
    logger.info(`Idempotency Hit: Key [${key}] for User [${userId}]`);
    const parsedResponse = typeof cachedData === 'string'
      ? JSON.parse(cachedData)
      : cachedData;
    return res.status(parsedResponse.statusCode).json(parsedResponse.body);
  };

  const originalJson = res.json;
  res.json = async (body) => {
    const { statusCode } = res;

    if (statusCode >= 200 && statusCode < 300) {
      const responseToCache = { statusCode, body };
      logger.debug(`Saving idempotency key: ${cacheKey}`);
      
      const ttl = CACHE_TTL * 24;
      await cacheManager.set(cacheKey, JSON.stringify(responseToCache), ttl);
    };
    return originalJson.call(res, body);
  };
  next();
});

export default idempotencyMiddleware;