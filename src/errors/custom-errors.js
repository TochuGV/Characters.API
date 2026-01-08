import AppError from "./app-error.js";

export class BadRequestError extends AppError {
  constructor(details = null, message = "Bad Request") {
    super(message, 400, details);
  };
};

export class UnauthorizedError extends AppError {
  constructor(details = null, message = "Unauthorized") {
    super(message, 401, details);
  };
};

export class ForbiddenError extends AppError {
  constructor(details = null, message = "Forbidden") {
    super(message, 403, details);
  };
};

export class NotFoundError extends AppError {
  constructor(details = null, message = "Not Found") {
    super(message, 404, details);
  };
};

export class ConflictError extends AppError {
  constructor(details = null, message = "Conflict") {
    super(message, 409, details);
  };
};

export class ValidationError extends AppError{
  constructor(details = null, message = "Unprocessable Entity") {
    super(message, 422, details);
  };
};

export class TooManyRequestsError extends AppError{
  constructor(details = null, message = "Too Many Requests") {
    super(message, 429, details);
  };
};

export class InternalServerError extends AppError{
  constructor(details = null) {
    super("Internal Server Error", 500, details, false);
  };
};

export class DatabaseError extends AppError{
  constructor(details = null) {
    super("Service Unavailable", 503, details, false);
  };
};
