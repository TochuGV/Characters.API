import jwt from "jsonwebtoken";
import env from "../config/enviroment.config.js";
import crypto from 'node:crypto';

const signToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const generateAccessToken = (user) => {
  return signToken(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    env.JWT_ACCESS_SECRET_KEY,
    env.JWT_ACCESS_EXPIRES_IN
  );
};

export const generateRefreshToken = (user) => {
  const tokenId = crypto.randomUUID();
  const token = signToken(
    {
      id: user.id,
      tokenId
    },
    env.JWT_REFRESH_SECRET_KEY,
    env.JWT_REFRESH_EXPIRES_IN
  );
  return { token, tokenId };
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET_KEY);
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};

export const createSessionPayload = (userId, token, tokenId) => {
  return {
    id: tokenId,
    token,
    userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };
};