import {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    ValidationError,
    ConflictError,
    InternalServerError,
    DatabaseError
} from "./customErrors.js"

export class ErrorFactory {
    static createError(type, details = null, message){
        switch(type){
            case "BAD_REQUEST":
                return new BadRequestError(details, message);
            case "UNAUTHORIZED":
                return new UnauthorizedError(details, message);
            case "NOT_FOUND":
                return new NotFoundError(details, message);
            case "CONFLICT":
                return new ConflictError(details, message);
            case "VALIDATION":
                return new ValidationError(details, message);
            case "INTERNAL_SERVER":
                return new InternalServerError(details);
            case "DATABASE":
                return new DatabaseError(details);
            default:
                return new InternalServerError();
        };
    };
};