import jwt from "jsonwebtoken";
import env from "../config/enviroment.config.js";

const secret = env.JWT_SECRET_KEY;

export const generateToken = (user) => {
  const expiresIn = env.JWT_EXPIRES_IN;
  return jwt.sign({ id: user.ID, email: user.Email }, secret, { expiresIn });
};

export const isValidToken = (token) => {
  return Boolean(jwt.verify(token, secret, (err) => !err));
};