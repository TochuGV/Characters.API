import logger from "../logger/index.js";
import { isPrismaError, handlePrismaError } from "../errors/prisma-error.handler.js";

const errorHandler = (err, req, res, next) => {
  if (isPrismaError(err)) err = handlePrismaError(err);
  logger.error({ err, method: req.method, path: req.path }, "Exception caught");
  let statusCode = err.statusCode || 500;
  if (!err.statusCode && (err.message?.includes("Database") || err.message?.includes("connect"))) statusCode = 503;
  const response = { error: err.isOperational ? err.message : "Something went wrong!" };
  if (err.details && err.isOperational) response.details = err.details;
  return res.status(statusCode).json(response);
};

export default errorHandler;