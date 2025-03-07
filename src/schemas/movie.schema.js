import z from "zod";
import { parseNumericQueryParam } from "../utils/query.utils.js";

export const movieSchema = z.object({
    Image: z.string({
        required_error: "Movie image is required",
        invalid_type_error: "Movie image must be a string"
    }).max(255, { 
        message: "Must be 255 or fewer characters long" 
    }).url({ 
        message: "Invalid URL" 
    }).endsWith(".jpg", { 
        message: "Only '.jpg' files are allowed" 
    }),
    Title: z.string({
        required_error: "Movie title is required",
        invalid_type_error: "Movie title must be a string"
    }).max(100, { 
        message: "Must be 100 or fewer characters long" 
    }),
    CreationDate: z.string({
        required_error: "Movie creation date is required",
        invalid_type_error: "Movie creation date must be a date"
    }).date(),
    Rating: z.number({
        invalid_type_error: "Movie rating must be a number"
    }).int({
        message: "Must be an integer"
    }).min(1, { 
        message: "Must be greater than 1" 
    }).max(5, { 
        message: "Must be less than 5" 
    }).optional()
});

export const movieQuerySchema = z.object({
    title: z.string({
        invalid_type_error: "Character image must be a string"
    }).max(100, { 
        message: "Must be 100 or fewer characters long" 
    }).optional(),
    order: z.enum(["ASC", "DESC"]).optional(),
    page: z.preprocess(parseNumericQueryParam, z.number({
        invalid_type_error: "Page must be a number"
    }).int({
        message: "Must be an integer"
    }).min(1, { 
        message: "Must be greater than 1"
    }).optional().default(1)),
    limit: z.preprocess(parseNumericQueryParam, z.number({
        invalid_type_error: "Limit must be a number"
    }).int({
        message: "Must be an integer"
    }).min(1, { 
        message: "Must be greater than 1"
    }).max(100, { 
        message: "Must be less than 100" 
    }).optional().default(10))
});