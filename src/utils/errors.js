export class AppError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    };
};

export class BadRequestError extends AppError{
    constructor(details, message = "Bad request"){
        super(message, 400);
        this.details = details;
    };
};

export class UnauthorizedError extends AppError{
    constructor(message = "Unauthorized"){
        super(message, 401);
    };
};

export class NotFoundError extends AppError{
    constructor(message = "Resource not found"){
        super(message, 404);
    };
};

export class ValidationError extends AppError{
    constructor(details, message = "Unprocessable entity"){
        super(message, 422);
        this.details = details;
    };
};

export class InternalServerError extends AppError{
    constructor(message = "Internal server error"){
        super(message, 500);
    };
};