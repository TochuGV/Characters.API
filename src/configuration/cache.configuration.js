const cacheConfiguration = {
  stdTTL: parseInt(process.env.CACHE_TTL) || 3600,
  checkperiod: parseInt(process.env.CACHE_CHECK_PERIOD) || 600,
  useClones: false,
  deleteOnExpire: true
};

export default cacheConfiguration;