import jwt from "jsonwebtoken";
import env from "../config/enviroment.config.js";

const secret = env.JWT_SECRET_KEY;

const generateToken = (user) => {
  const expiresIn = env.JWT_EXPIRES_IN;
  return jwt.sign({
    id: user.id,
    email: user.email,
    role: user.role
  }, secret, { expiresIn });
};

export default generateToken;