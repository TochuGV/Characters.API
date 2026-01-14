import rateLimit from "express-rate-limit";
import env from "./enviroment.config.js";
import errorFactory from "../errors/error-factory.js";

const limiterOptions = {
  windowMs: env.RATE_LIMIT_WINDOW,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => next(errorFactory.tooManyRequests("Rate limit exceeded, please try again later"))
};

export default rateLimit(limiterOptions);