import NodeCache from "node-cache";
import Redis from "ioredis";
import logger from "../logger/index.js";
import tryCatch from "../utils/try-catch.js";
import env from "../config/enviroment.config.js";
import redisOptions from "../config/redis.options.js";
import nodeCacheOptions from "../config/node-cache.options.js";
import CACHE_TTL from "../config/cache.constants.js";

class CacheManager {
  constructor() {
    this.useRedis = env.USE_REDIS;
    this.localCache = new NodeCache(nodeCacheOptions);
    this.redisClient = null;
  
    if (this.useRedis) {
      logger.info("Initializing Redis cache...");
      this.redisClient = new Redis(redisOptions);

      this.redisClient.on("connect", () => {
        logger.info("Connected to Redis server");
      });

      this.redisClient.on("error", (err) => {
        if (err.code === "ECONNREFUSED") {
          logger.warn("Redis unreachable. Retrying connection in background...");
          return;
        };
        logger.error("Redis connection error:", err);
      });
    } else {
      logger.info("Redis disabled. Using local in-memory cache only.");
    };
  };

  async get(key) {
    if (this.useRedis && this.redisClient) {
      const redisGet = tryCatch(async () => {
        return await this.redisClient.get(key);
      }, (error) => {
        logger.error("Redis [GET] failed. Falling back to Local Cache.", error);
        return undefined;
      });
      const value = await redisGet();
      if (value !== undefined) return value ? JSON.parse(value) : null;
    };
    return this.localCache.get(key) || null;
  };

  async set(key, value, ttlSeconds) {
    if (!ttlSeconds) ttlSeconds = this.useRedis ? CACHE_TTL.STANDARD : CACHE_TTL.SHORT;
  
    if (this.useRedis && this.redisClient) {
      const redisSet = tryCatch(async () => {
        await this.redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
        return true;
      }, (error) => {
        logger.error("Redis [SET] failed. Falling back to Local Cache.", error);
        return false;
      });

      const success = await redisSet();
      if (success) return;
    };
    this.localCache.set(key, value, ttlSeconds);
  };

  async del(key) {
    if (this.useRedis && this.redisClient) {
      const redisDelete = tryCatch(async () => {
        await this.redisClient.del(key);
        return true;
      }, (error) => {
        logger.error("Redis [DEL] failed. Falling back to Local Cache.", error);
        return false;
      });

      const success = await redisDelete();
      if (success) return;
    };
    this.localCache.del(key);
  };

  async deleteByPrefix(prefix) {
    if (this.useRedis && this.redisClient) {
      const redisDeleteByPrefix = tryCatch(async () => {
        const keys = await this.redisClient.keys(`${prefix}:*`);
        if (keys.length > 0) {
          await this.redisClient.del(keys);
          logger.debug(`Redis cleared keys for prefix: ${prefix}`);
        }
        return true;
      }, (error) => {
        logger.error("Redis [DELETE_PREFIX] failed. Falling back to Local Cache.", error);
        return false;
      });

      const success = await redisDeleteByPrefix();
      if (success) return;
    };

    const keys = this.localCache.keys();
    const keysToDelete = keys.filter(key => key.startsWith(prefix));
    if (keysToDelete.length > 0) {
      this.localCache.del(keysToDelete);
      logger.debug(`Local cache cleared keys for prefix: ${prefix}`);
    };
  };
};

export default new CacheManager();