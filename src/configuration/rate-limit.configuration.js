import errorFactory from "../common/errors/error-factory.js";

const limiterConfiguration = {
  windowMs: Number(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => next(errorFactory.createError("TOO_MANY_REQUESTS", "Rate limit exceeded, please try again later"))
};

export default limiterConfiguration;