import { idSchema } from "../schemas/id.schema.js";
import { BadRequestError } from "../utils/errors.js";

export const validateIdMiddleware = (req, res, next) => {
    const validation = idSchema.safeParse({ id: req.params.id });
    if (!validation.success) throw new BadRequestError("Invalid ID format.");
    next();
}