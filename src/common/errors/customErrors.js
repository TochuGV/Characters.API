import { AppError } from "./appError.js";

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

export class InternalServerError extends AppError{
    constructor(message = "Internal Server Error"){
        super(message, 500);
    };
};

export class DatabaseError extends AppError{
    constructor(message = "Service Unavailable"){
        super(message, 503);
    };
};
