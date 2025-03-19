import z from "zod";

export const userSchema = z.object({
	Email: z.string({
		required_error: "User email is required",
		invalid_type_error: "User email must be a string"
	}).email({ 
		message: "Invalid email address" 
	}).max(100, { 
		message: "Must be 100 or fewer characters long" 
	}),
	Password: z.string({
		required_error: "User password is required",
		invalid_type_error: "User password must be a string"
	}).min(6, { 
		message: "Must be 6 or more characters long" 
	}).max(100, { 
		message: "Must be 100 or fewer characters long" 
	})
});