import { AppError } from "./app-error.js";

export class BadRequestError extends AppError{
    constructor(details = null, message = "Bad Request"){
        super(message, 400);
        if(details) this.details = details;
    };
};

export class UnauthorizedError extends AppError{
    constructor(details = null, message = "Unauthorized"){
        super(message, 401);
        if(details) this.details = details;
    };
};

export class ForbiddenError extends AppError{
    constructor(details = null, message = "Forbidden"){
        super(message, 403);
        if(details) this.details = details;
    };
};

export class NotFoundError extends AppError{
    constructor(details = null, message = "Not Found"){
        super(message, 404);
        if(details) this.details = details;
    };
};

export class ConflictError extends AppError{
    constructor(details = null, message = "Conflict"){
        super(message, 409);
        if(details) this.details = details;
    };
};

export class ValidationError extends AppError{
    constructor(details = null, message = "Unprocessable Entity"){
        super(message, 422);
        if(details) this.details = details;
    };
};

export class TooManyRequestsError extends AppError{
    constructor(details = null, message = "Too Many Requests"){
        super(message, 429);
        if(details) this.details = details;
    };
};

export class InternalServerError extends AppError{
    constructor(details = null){
        super("Internal Server Error", 500, false);
        if(details) this.details = details;
    };
};

export class DatabaseError extends AppError{
    constructor(details = null){
        super("Service Unavailable", 503, false);
        if(details) this.details = details;
    };
};
