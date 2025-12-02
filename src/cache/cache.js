import NodeCache from "node-cache";
import cacheConfig from "../config/cache.config.js";

const cache = new NodeCache(cacheConfig);

export default cache;