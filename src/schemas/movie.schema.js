import z from "zod";

export const movieSchema = z.object({
    //id: z.number().int().positive(), --> No debería utilizarlo acá porque en ningún momento interactúo con este campo
    image: z.string({
        required_error: "Movie image is required"
    }).max(255).url().endsWith(".jpg"),
    title: z.string({
        required_error: "Movie title is required"
    }).max(100),
    creationDate: z.date({
        required_error: "Movie creation date is required"
    }),
    rating: z.number().int().min(1).max(5).optional()
});

export const movieQuerySchema = z.object({
    title: z.string().max(100).optional(),
    order: z.enum(["ASC", "DESC"]).optional()
});

export const validateMovie = (input) => {
    return movieSchema.safeParse(input);
};

export const validateMovieQuery = (input) => {
    return movieQuerySchema.safeParse(input);
};