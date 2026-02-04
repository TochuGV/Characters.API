import env from "./environment.config.js";
import CACHE_TTL from "./cache.constants.js";

const nodeCacheOptions = {
  stdTTL: CACHE_TTL.SHORT,
  checkperiod: env.CACHE_CHECK_PERIOD_LOCAL,
  useClones: false,
  deleteOnExpire: true
};

export default nodeCacheOptions;