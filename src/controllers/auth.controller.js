import { userSchema } from "../schemas/user.schema.js";
import { comparePasswords } from "../utils/user.utils.js";
import generateToken from "../utils/token.utils.js";
import tryCatch from "../utils/try-catch.js";
import cookieOptions from "../config/cookie.options.js";
import errorFactory from "../errors/error-factory.js";
import validateRequest from "../utils/validate-request.util.js";
import logger from "../logger/index.js";

export default class AuthController {
  constructor(userService) {
    this.userService = userService;
  };

  registerUser = tryCatch(async (req, res) => {
    logger.info(`[POST] /auth/register - Registration attempt for: ${req.body.email}`);
    const data = validateRequest(userSchema, req.body);
    const userExists = await this.userService.getByEmail(data.email);
    if (userExists) throw errorFactory.createError("CONFLICT", "User already exists");
    const newUser = await this.userService.create(data);
    return res.status(201).json({
      message: "User created successfully",
      userId: newUser.id
    });
  });
  
  loginUser = tryCatch(async (req, res) => {
    logger.info(`[POST] /auth/login - Login attempt for: ${req.body.email}`);
    const { email, password } = validateRequest(userSchema, req.body);
    const user = await this.userService.getByEmail(email);
    if (!user) throw errorFactory.createError("UNAUTHORIZED", "Invalid credentials");
    const isValidPassword = await comparePasswords(password, user.password);
    if (!isValidPassword) throw errorFactory.createError("UNAUTHORIZED", "Invalid credentials");
    const token = generateToken(user);
    res.cookie("jwt", token, cookieOptions);
    return res.status(200).json({ message: "Login successful" });
  });
  
  logoutUser = (req, res) => {
    logger.info("[POST] /auth/logout - Clearing user session");
    res.clearCookie("jwt", cookieOptions);
    return res.status(200).json({ message: "Logout successful" });
  };
};