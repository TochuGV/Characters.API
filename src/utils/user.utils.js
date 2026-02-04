import bcrypt from "bcrypt"
import env from "../config/environment.config.js";

export const getHashedPassword = (password) => {
  return bcrypt.hash(password, env.SALT_ROUNDS);
};

export const comparePasswords = (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};