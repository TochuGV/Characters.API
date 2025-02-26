import rateLimit from "express-rate-limit";
import { limiterConfig } from "../config/rate-limit.config.js";

export const limiter = rateLimit(limiterConfig);