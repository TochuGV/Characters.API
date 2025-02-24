import "dotenv/config";

export const CONFIG = {
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    SALT_ROUNDS: 10,
    TOKEN_EXPIRES_IN: "1h",
};