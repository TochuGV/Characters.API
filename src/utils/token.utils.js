import jwt from "jsonwebtoken";
import { CONFIG } from "../common/config.constants.js";

const secret = CONFIG.JWT_SECRET_KEY;

export const generateToken = (user) => {
  const expiresIn = CONFIG.JWT_EXPIRES_IN;
  return jwt.sign({ id: user.ID, email: user.Email }, secret, { expiresIn });
};

export const isValidToken = (token) => {
  return Boolean(jwt.verify(token, secret, (err) => !err));
};