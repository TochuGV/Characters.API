import env from "./enviroment.config.js";

const redisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  retryStrategy: (times) => Math.min(times * 500, 5000),
  enableOfflineQueue: false,
  commandTimeout: 1000
};

export default redisOptions;