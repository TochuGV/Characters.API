import AppError from "./app-error.js";

export default class ErrorFactory {
  static build(name, message, statusCode, details) {
    const error = new AppError(message, statusCode, details);
    error.name = name; // Se ve el tipo de error específico en los logs.
    return error;
  };

  static badRequest(message = "Bad Request", details = null) {
    return this.build("BadRequestError", message, 400, details);
  };

  static unauthorized(message = "Unauthorized", details = null) {
    return this.build("UnauthorizedError", message, 401, details);
  };

  static forbidden(message = "Forbidden", details = null) {
    return this.build("ForbiddenError", message, 403, details);
  };

  static notFound(message = "Not Found", details = null) {
    return this.build("NotFoundError", message, 404, details);
  };

  static conflict(message = "Conflict", details = null) {
    return this.build("ConflictError", message, 409, details);
  };

  static validation(message = "Unprocessable Entity", details = null) {
    return this.build("ValidationError", message, 422, details);
  };

  static tooManyRequests(message = "Too Many Requests", details = null) {
    return this.build("TooManyRequestsError", message, 429, details);
  };

  static internalServer(message = "Internal Server Error", details = null) {
    const error = this.build("InternalServerError", message, 500, details);
    error.isOperational = false;
    return error;
  };

  static database(message = "Database Error", details = null) {
    const error = this.build("DatabaseError", message, 503, details);
    error.isOperational = false;
    return error;
  };
};