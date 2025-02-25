import { AppError } from "./appError.js";

export class BadRequestError extends AppError{
    constructor(details = null, message = "Bad request"){
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
    constructor(message = "Resource not found"){
        super(message, 404);
    };
};

export class ValidationError extends AppError{
    constructor(details = null, message = "Unprocessable entity"){
        super(message, 422);
        if(details) this.details = details;
    };
};

export class InternalServerError extends AppError{
    constructor(message = "Internal server error"){
        super(message, 500);
    };
};

export class DatabaseError extends AppError{
    constructor(message = "Service unavailable"){
        super(message, 503);
    };
};
