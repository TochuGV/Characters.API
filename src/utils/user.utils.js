import bcrypt from "bcrypt"
import { CONFIG } from "../common/config.constants.js";

export const getHashedPassword = (password) => {
  return bcrypt.hash(password, CONFIG.SALT_ROUNDS);
};

export const comparePasswords = (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};