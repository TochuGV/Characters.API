import z from "zod";

export const characterSchema = z.object({
    //id: z.number().int().positive(), --> No debería utilizarlo acá porque en ningún momento interactúo con este campo
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

export const validateCharacter = (input) =>{
    return characterSchema.safeParse(input);
};