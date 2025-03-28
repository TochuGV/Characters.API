import { userSchema } from "../schemas/user.schema.js";
import { generateToken, isValidToken } from "../utils/token.utils.js";
import userService from "../services/user.service.js";
import { comparePasswords } from "../utils/user.utils.js";
import { tryCatch } from "../utils/try-catch.js";
import { cookieOptions } from "../config/cookie.config.js";
import errorFactory from "../common/errors/error-factory.js";
import { validateRequest } from "../utils/validate-request.util.js";

export const registerUser = tryCatch(async (req, res) => {
	console.log("This is a post operation");
	validateRequest(userSchema, req.body);
	const {Email: email, Password: password} = req.body;
	const userExists = await userService.getByEmail(email);
	if(userExists) throw errorFactory.createError("CONFLICT", "User already exists");
	const isUserCreated = await userService.create(email, password);
	if(!isUserCreated) throw errorFactory.createError("DATABASE", "User creation failed due to a database issue");
	return res.status(201).send("User created successfully");
});

export const loginUser = tryCatch(async (req, res) => {
	console.log("This is a post operation");
	validateRequest(userSchema, req.body);
	const {Email: email, Password: password} = req.body;
	const user = await userService.getByEmail(email);
	if(!user) throw errorFactory.createError("UNAUTHORIZED", "Invalid credentials");
	const isValidPassword = await comparePasswords(password, user.Password);
	if(!isValidPassword) throw errorFactory.createError("UNAUTHORIZED", "Invalid credentials");
	const token = generateToken(user);
	res.cookie("jwt", token, cookieOptions);
	return res.status(200).send("Login successful");
});

export const logoutUser = (req, res) => {
	console.log("This is a post operation");
	const token = req.cookies?.jwt;
	if(!token) throw errorFactory.createError("UNAUTHORIZED", "User is not logged in");
	if(!isValidToken(token)) throw errorFactory.createError("UNAUTHORIZED", "Invalid session");
	res.clearCookie("jwt", cookieOptions);
	return res.status(200).send("Logout successful");
};