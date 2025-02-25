import z from "zod";
import { parseNumericQueryParam } from "../utils/character.utils.js";

export const movieSchema = z.object({
    image: z.string({
        required_error: "Movie image is required",
        invalid_type_error: "Movie image must be a string"
    }).max(255, { 
        message: "Must be 255 or fewer characters long" 
    }).url({ 
        message: "Invalid URL" 
    }).endsWith(".jpg", { 
        message: "Only '.jpg' files are allowed" 
    }),
    title: z.string({
        required_error: "Movie title is required",
        invalid_type_error: "Movie title must be a string"
    }).max(100, { 
        message: "Must be 100 or fewer characters long" 
    }),
    creationDate: z.date({
        required_error: "Movie creation date is required",
        invalid_type_error: "Movie creation date must be a date"
    }),
    rating: z.number({
        invalid_type_error: "Movie rating must be a number"
    }).int({
        message: "Must be an integer"
    }).min(1, { 
        message: "Must be 1 or more characters long" 
    }).max(5, { 
        message: "Must be 5 or fewer characters long" 
    }).optional()
});

export const movieQuerySchema = z.object({
    title: z.string({
        invalid_type_error: "Character image must be a string"
    }).max(100, { 
        message: "Must be 100 or fewer characters long" 
    }).optional(),
    order: z.enum(["ASC", "DESC"]).optional(),
    page: z.preprocess(parseNumericQueryParam, z.number().int().min(1).optional().default(1)),
    limit: z.preprocess(parseNumericQueryParam, z.number().int().min(1).max(100).optional().default(10))
});