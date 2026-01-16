import cacheManager from "../cache/cache.manager.js";
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

export const checkCache = async (prefix, params) => {
  try {
    const cacheKey = generateCacheKey(prefix, params);
    const result = await cacheManager.get(cacheKey);

    if (result) {
      logger.debug(`Cache: [HIT] --> ${cacheKey}`);
      return result;
    };
    logger.debug(`Cache: [MISS] --> ${cacheKey}`);
    return null;
  } catch (error) {
    logger.error({ error }, "Cache: Check operation failed");
    return null;
  }
};

export const setCache = async (prefix, params, data, ttl) => {
  try {
    const cacheKey = generateCacheKey(prefix, params);
    await cacheManager.set(cacheKey, data, ttl);
    logger.debug(`Cache: [SET] --> ${cacheKey}`);
  } catch (error) {
    logger.error({ error }, "Cache: Set operation failed");
  };
};

export const deleteCache = async (prefix) => {
  try {
    await cacheManager.deleteByPrefix(prefix);
    logger.debug(`Cache: [DELETE] --> Prefix: ${prefix}`);
  } catch (error) {
    logger.error({ error }, "Cache: Delete operation failed");
  };
};