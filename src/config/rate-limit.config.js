import env from "./enviroment.config.js";
import errorFactory from "../errors/error-factory.js";

const limiterConfig = {
  windowMs: env.RATE_LIMIT_WINDOW,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => next(errorFactory.createError("TOO_MANY_REQUESTS", "Rate limit exceeded, please try again later"))
};

export default limiterConfig;