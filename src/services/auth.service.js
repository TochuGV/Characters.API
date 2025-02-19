import jwt from "jsonwebtoken";
import { CONFIG } from "../common/config.constants.js";

export const generateToken = (user) => {
    return jwt.sign({
        id: user.ID,
        email: user.Email
    }, CONFIG.JWT_SECRET_KEY, {
        expiresIn: CONFIG.TOKEN_EXPIRES_IN
    });
};