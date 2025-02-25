import { userSchema } from "../schemas/user.schema.js";
import { generateToken } from "../services/auth.service.js";
import userService from "../services/user.service.js";
import { comparePasswords } from "../utils/user.utils.js";
import { tryCatch } from "../utils/try-catch.js";
import { cookieOptions } from "../config/cookie.config.js";
import { ErrorFactory } from "../common/errors/errorFactory.js";
import { validateRequest } from "../utils/validate-request.util.js";

export const registerUser = tryCatch(async (req, res) => {
    console.log("This is a post operation");
    validateRequest(userSchema, req.body);
    const {email, password} = req.body
    const userExists = await userService.getUserByEmail(email);
    if(userExists) throw ErrorFactory.createError("CONFLICT", "User already exists");
    const result = await userService.createUser(email, password);
    if(!(result.rowsAffected[0] > 0)) throw ErrorFactory.createError("INTERNAL_SERVER", "User creation failed due to a database issue");
    return res.status(201).send("User created successfully");
});

export const loginUser = tryCatch(async (req, res) => {
    console.log("This is a post operation");
    validateRequest(userSchema, req.body);
    const {email, password} = req.body;
    const user = await userService.getUserByEmail(email);
    if(!user) throw ErrorFactory.createError("UNAUTHORIZED", "Invalid credentials");
    const isValidPassword = await comparePasswords(password, user.Password);
    if(!isValidPassword) throw ErrorFactory.createError("UNAUTHORIZED", "Invalid credentials");
    const token = generateToken(user);
    res.cookie("jwt", token, cookieOptions);
    return res.status(200).send("Login successful");
});

export const logoutUser = (req, res) => {
    console.log("This is a post operation");
    res.clearCookie("jwt", cookieOptions);
    return res.status(200).send("Logout successful");
};