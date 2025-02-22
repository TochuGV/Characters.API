import { validateUser } from "../schemas/user.schema.js";
import { generateToken } from "../services/auth.service.js";
import userService from "../services/user.service.js";
import { BadRequestError } from "../utils/errors.js";
import { comparePasswords } from "../utils/user.utils.js";
import { tryCatch } from "../utils/try-catch.js";
import { cookieOptions } from "../config/cookie.config.js";

export const registerUser = tryCatch(async (req, res) => {
    console.log("This is a post operation");
    const validation = validateUser(req.body);
    if(!validation.success) throw new BadRequestError(JSON.parse(validation.error.message));
    const {email, password} = req.body
    const userExists = await userService.getUserByEmail(email);
    if(userExists) throw new BadRequestError("User already exists");
    const result = await userService.createUser(email, password);
    if(!(result.rowsAffected[0] > 0)) throw new BadRequestError("Bad Request");
    return res.status(201).send("User created successfully");
});

export const loginUser = tryCatch(async (req, res) => {
    console.log("This is a post operation");
    const validation = validateUser(req.body);
    if(!validation.success) throw new BadRequestError(JSON.parse(validation.error.message));
    const {email, password} = req.body;
    const user = await userService.getUserByEmail(email);
    if(!user) throw new BadRequestError("Invalid credentials");
    const isValidPassword = await comparePasswords(password, user.Password);
    if(!isValidPassword) throw new BadRequestError("Invalid credentials, wrong password");
    const token = generateToken(user);
    res.cookie("jwt", token, cookieOptions);
    return res.status(200).send("Login successful");
});

export const logoutUser = (req, res) => {
    console.log("This is a post operation");
    res.clearCookie("jwt", cookieOptions);
    return res.status(200).send("Logout successful");
};