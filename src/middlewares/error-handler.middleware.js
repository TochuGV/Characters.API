import logger from "../logger/index.js";
import { isPrismaError, handlePrismaError } from "../errors/prisma-error.handler.js";

const errorHandler = (err, req, res, next) => {
  if (isPrismaError(err)) err = handlePrismaError(err);
  logger.error({ err, method: req.method, path: req.path }, "Exception caught");
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.isOperational ? err.message : "Something went wrong!"
  const response = {
    status,
    message,
    ...(err.details && { details: err.details })
  };
  return res.status(statusCode).json(response);
};

export default errorHandler;