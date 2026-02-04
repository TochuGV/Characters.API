import env from "./environment.config.js";

const CACHE_TTL = {
  STANDARD: env.CACHE_TTL_REDIS,
  SHORT: env.CACHE_TTL_LOCAL,
  INSTANT: 5
};

export default CACHE_TTL;