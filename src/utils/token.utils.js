import jwt from "jsonwebtoken";
import { CONFIG } from "../common/config.constants.js";

export const generateToken = (user) => {
    const secret = CONFIG.JWT_SECRET_KEY;
    const expiresIn = CONFIG.JWT_EXPIRES_IN;
    return jwt.sign({ id: user.ID, email: user.Email }, secret, { expiresIn });
};