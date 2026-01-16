import env from "./enviroment.config.js";

const redisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  retryStrategy: (times) => Math.min(times * 50, 2000)
};

export default redisOptions;