import env from "./enviroment.config.js";

const cacheConfig = {
  stdTTL: env.CACHE_TTL,
  checkperiod: env.CACHE_CHECK_PERIOD,
  useClones: false,
  deleteOnExpire: true
};

export default cacheConfig;