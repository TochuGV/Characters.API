import { registerSchema, loginSchema } from "../schemas/user.schema.js";
import tryCatch from "../utils/try-catch.js";
import cookieOptions from "../config/cookie.options.js";
import successResponse from "../utils/response.util.js";
import validateRequest from "../utils/validate-request.util.js";
import logger from "../logger/index.js";

export default class AuthController {
  constructor(userService) {
    this.userService = userService;
  };

  registerUser = tryCatch(async (req, res) => {
    logger.info(`[POST] /auth/register - Registration attempt for: ${req.body.email}`);
    const data = validateRequest(registerSchema, req.body);
    const newUser = await this.userService.create(data);
    return successResponse(res, {
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    }, 201);
  });
  
  loginUser = tryCatch(async (req, res) => {
    logger.info(`[POST] /auth/login - Login attempt for: ${req.body.email}`);
    const { email, password } = validateRequest(loginSchema, req.body);
    const { user, accessToken, refreshToken } = await this.userService.login(email, password);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    return successResponse(res, {
      message: "Login successful",
      user,
      accessToken
    });
  });
  
  logoutUser = tryCatch(async (req, res) => {
    logger.info("[POST] /auth/logout - Clearing user session");
    const { refreshToken } = req.signedCookies;
    await this.userService.logout(refreshToken);
    res.clearCookie("refreshToken", cookieOptions);
    return successResponse(res, { message: "Logout successful" } );
  });

  refreshUserToken = tryCatch(async (req, res) => {
    logger.info("[POST] /auth/refresh - Refreshing access token");
    const { refreshToken } = req.signedCookies;
    const { accessToken, refreshToken: newRefreshToken } = await this.userService.refresh(refreshToken);
    res.cookie("refreshToken", newRefreshToken, cookieOptions);
    return successResponse(res, { accessToken });
  });
};