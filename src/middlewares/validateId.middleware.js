import { idSchema } from "../schemas/id.schema.js";

export const validateIdMiddleware = (req, res, next) => {
    const validation = idSchema.safeParse({ id: req.params.id });
    if (!validation.success) return res.status(400).send("Bad request, invalid ID format.");
    next();
}