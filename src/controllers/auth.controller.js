import { userSchema } from "../schemas/user.schema.js";
import { generateToken, isValidToken } from "../utils/token.utils.js";
import { comparePasswords } from "../utils/user.utils.js";
import tryCatch from "../utils/try-catch.js";
import cookieOptions from "../config/cookie.config.js";
import errorFactory from "../common/errors/error-factory.js";
import { validateRequest } from "../utils/validate-request.util.js";
import logger from "../logger/index.js";

export default class AuthController {
  constructor(userService) {
    this.userService = userService;
  };

  registerUser = tryCatch(async (req, res) => {
    logger.info("This is a post operation");
    validateRequest(userSchema, req.body);
    const {Email: email, Password: password} = req.body;
    const userExists = await userService.getByEmail(email);
    if(userExists) throw errorFactory.createError("CONFLICT", "User already exists");
    const isUserCreated = await this.userService.create(email, password);
    if(!isUserCreated) throw errorFactory.createError("DATABASE", "User creation failed due to a database issue");
    return res.status(201).send("User created successfully");
  });
  
  loginUser = tryCatch(async (req, res) => {
    logger.info("This is a post operation");
    validateRequest(userSchema, req.body);
    const {Email: email, Password: password} = req.body;
    const user = await this.userService.getByEmail(email);
    if(!user) throw errorFactory.createError("UNAUTHORIZED", "Invalid credentials");
    const isValidPassword = await comparePasswords(password, user.Password);
    if(!isValidPassword) throw errorFactory.createError("UNAUTHORIZED", "Invalid credentials");
    const token = generateToken(user);
    res.cookie("jwt", token, cookieOptions);
    return res.status(200).send("Login successful");
  });
  
  logoutUser = (req, res) => {
    logger.info("This is a post operation");
    const token = req.cookies?.jwt;
    if(!token) throw errorFactory.createError("UNAUTHORIZED", "User is not logged in");
    if(!isValidToken(token)) throw errorFactory.createError("UNAUTHORIZED", "Invalid session");
    res.clearCookie("jwt", cookieOptions);
    return res.status(200).send("Logout successful");
  };
};