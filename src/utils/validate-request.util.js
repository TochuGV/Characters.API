import { ErrorFactory } from "../common/errors/error-factory.js";

export const validateRequest = (schema, data) => {
    const validation = schema.safeParse(data);
    if(!validation.success){
        const formattedErrors = validation.error.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message
        }));
        throw ErrorFactory.createError("VALIDATION", formattedErrors);
    };
};