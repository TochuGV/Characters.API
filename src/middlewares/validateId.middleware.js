import { idSchema } from "../schemas/id.schema.js";
import { validateRequest } from "../utils/validate-request.util.js";

export const validateIdMiddleware = (req, res, next) => {
    validateRequest(idSchema, {id: req.params.id});
    next();
}