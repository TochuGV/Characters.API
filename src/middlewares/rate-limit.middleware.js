import rateLimit from "express-rate-limit";
import limiterConfig from "../config/rate-limit.config.js";

const limiter = rateLimit(limiterConfig);

export default limiter;