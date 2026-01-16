import NodeCache from "node-cache";
import Redis from "ioredis";
import logger from "../logger/index.js";
import env from "../config/enviroment.config.js";
import redisOptions from "../config/redis.options.js";
import nodeCacheOptions from "../config/node-cache.options.js";
import CACHE_TTL from "../config/cache.constants.js";

class CacheManager {
  constructor() {
    this.useRedis = env.USE_REDIS;
    this.client = null;
  
    if (this.useRedis) {
      logger.info("Initializing Redis cache...");
      this.client = new Redis(redisOptions);

      this.client.on("connect", () => {
        logger.info("Connected to Redis server");
      });

      this.client.on("error", (err) => {
        logger.error("Redis error:", err);
      });
    } else {
      logger.info("Initializing local in-memory cache...");
      this.client = new NodeCache(nodeCacheOptions);
    };
  };

  async get(key) {
    if (this.useRedis) {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    };
    return this.client.get(key) || null; // NodeCache returns undefined if not found
  };

  async set(key, value, ttlSeconds) {
    if (!ttlSeconds) ttlSeconds = this.useRedis ? CACHE_TTL.STANDARD : CACHE_TTL.SHORT;
  
    if (this.useRedis) {
      await this.client.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } else {
      this.client.set(key, value, ttlSeconds);
    };
  };

  async del(key) {
    if (this.useRedis) {
      await this.client.del(key);
    } else {
      this.client.del(key);
    };
  };

  async deleteByPrefix(prefix) {
    if (this.useRedis) {
      const keys = await this.client.keys(`${prefix}:*`);
      if (keys.length > 0) {
        await this.client.del(keys);
        logger.debug(`Redis cleared keys for prefix: ${prefix}`);
      };
    } else {
      const keys = this.client.keys();
      const keysToDelete = keys.filter(key => key.startsWith(prefix));
      if (keysToDelete.length > 0) {
        this.client.del(keysToDelete);
        logger.debug(`Local cache cleared keys for prefix: ${prefix}`);
      };
    };
  };
};

export default new CacheManager();