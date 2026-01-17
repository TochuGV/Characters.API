import cacheManager from "../cache/cache.manager.js";
import tryCatch from "./try-catch.js";
import logger from "../logger/index.js";

const generateCacheKey = (prefix, params) => {
  if (!params || Object.keys(params).length === 0) return prefix;

  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {});
  
  return `${prefix}:${JSON.stringify(sortedParams)}`;
};

const handleError = (operation) => (error) => {
  logger.error({ error }, `Cache: [ERROR] -> ${operation} operation failed`);
  return null;
};

export const checkCache = tryCatch(
  async (prefix, params) => {
    const cacheKey = generateCacheKey(prefix, params);
    const result = await cacheManager.get(cacheKey);

    if (result) {
      logger.debug(`Cache: [HIT]  --> ${cacheKey}`);
      return result;
    };
    logger.debug(`Cache: [MISS] --> ${cacheKey}`);
    return null;
  },
  handleError("Check")
);

export const setCache = tryCatch(
  async (prefix, params, data, ttl) => {
    const cacheKey = generateCacheKey(prefix, params);
    await cacheManager.set(cacheKey, data, ttl);
    logger.debug(`Cache: [SET] --> ${cacheKey}`);
  },
  handleError("Set")
);

export const deleteCache = tryCatch(
  async (prefix) => {
    await cacheManager.deleteByPrefix(prefix);
    logger.debug(`Cache: [DELETE] --> Prefix: ${prefix}`);
  },
  handleError("Delete")
);