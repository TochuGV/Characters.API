import NodeCache from "node-cache";
import cacheConfig from "../config/node-cache.options.js";

const cache = new NodeCache(cacheConfig);

export default cache;