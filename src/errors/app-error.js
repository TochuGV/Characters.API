export default class AppError extends Error {
  constructor(message, statusCode, details = null, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    if (details) this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  };
};