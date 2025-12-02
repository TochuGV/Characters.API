import NodeCache from "node-cache";
import cacheConfiguration from "../configuration/cache.configuration.js";

const cache = new NodeCache(cacheConfiguration);

export default cache;