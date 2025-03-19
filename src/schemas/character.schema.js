import z from "zod";
import { parseNumericQueryParam } from "../utils/query.utils.js";

export const characterSchema = z.object({
	Image: z.string({
		required_error: "Character image is required",
		invalid_type_error: "Character image must be a string"
	}).max(255, { 
		message: "Must be 255 or fewer characters long" 
	}).url({ 
		message: "Invalid URL" 
	}).endsWith(".jpg", { 
		message: "Only '.jpg' files are allowed" 
	}),
	Name: z.string({
		required_error: "Character name is required",
		invalid_type_error: "Character name must be a string"
	}).max(100, { 
		message: "Must be 100 or fewer characters long" 
	}),
	Age: z.number({
		invalid_type_error: "Character age must be a number"
	}).int({
		message: "Must be an integer"
	}).nonnegative({
		message: "Must be non-negative"
	}).optional(),
	Weight: z.number({
		invalid_type_error: "Character weight must be a number"
	}).positive({
		message: "Must be positive"
	}).optional(),
	Story: z.string({
		invalid_type_error: "Character story must be a string"
	}).optional()
});

export const characterQuerySchema = z.object({
	name: z.string({
		invalid_type_error: "Character image must be a string"
	}).max(100, { 
		message: "Must be 100 or fewer characters long" 
	}).optional(),
	age: z.preprocess(parseNumericQueryParam, z.number({
		invalid_type_error: "Character age must be a number"
	}).int({
		message: "Must be an integer"
	}).nonnegative({
		message: "Must be non-negative"
	}).optional()),
	weight: z.preprocess(parseNumericQueryParam, z.number({
		invalid_type_error: "Character weight must be a number"
	}).positive({
		message: "Must be positive"
	}).optional()),
	movie: z.string().uuid({ message: "Invalid UUID format" }).optional(),
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