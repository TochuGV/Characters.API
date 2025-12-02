import env from "./enviroment.configuration.js";

const cacheConfiguration = {
  stdTTL: env.CACHE_TTL,
  checkperiod: env.CACHE_CHECK_PERIOD,
  useClones: false,
  deleteOnExpire: true
};

export default cacheConfiguration;