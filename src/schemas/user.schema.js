import z from "zod";

export const userSchema = z.object({
    email: z.string({
        required_error: "Email is required"
    }).email().max(255),
    password: z.string({
        required_error: "Password is required"
    }).min(6).max(255),
});

export const validateUser = (input) => {
    return userSchema.safeParse(input);
};