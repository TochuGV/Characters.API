import z from "zod";
import { parseNumericQueryParam } from "../utils/character.utils.js";

export const characterSchema = z.object({
    image: z.string({
        required_error: "Image is required"
    }).max(255).url().endsWith(".jpg"),
    name: z.string({
        required_error: "Name is required"
    }).max(100),
    age: z.number().int().min(0).optional(),
    weight: z.number().positive().optional(),
    story: z.string().optional()
});

export const characterQuerySchema = z.object({
    name: z.string().max(100).optional(),
    age: z.preprocess(parseNumericQueryParam, z.number().int().min(0).optional()),
    weight: z.preprocess(parseNumericQueryParam, z.number().positive().optional()),
    movies: z.preprocess(parseNumericQueryParam, z.string().uuid({ message: "Invalid UUID format" }).optional())
});

export const validateCharacter = (input) => {
    return characterSchema.safeParse(input);
};

export const validateCharacterQuery = (input) => {
    return characterQuerySchema.safeParse(input);
};