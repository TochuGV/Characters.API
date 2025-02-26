import rateLimit from "express-rate-limit";
import { ErrorFactory } from "../common/errors/error-factory.js";

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(ErrorFactory.createError("TOO_MANY_REQUESTS", "Rate limit exceeded, please try again later"));
    }
});