import { Strategy, ExtractJwt } from "passport-jwt";
import { userService } from "../container/index.js";
import env from "./environment.config.js";
import tryCatch from "../utils/try-catch.js";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.JWT_ACCESS_SECRET_KEY,
  algorithms: ["HS256"],
  //issuer: "yourdomain.com",
  //audience: "yourdomain.com",
  ignoreExpiration: false,
  //passReqToCallback: false
};

const verifyUser = async (payload, done) => {
  const user = await userService.getByEmail(payload.email);
  if (!user) return done(null, false);
  return done(null, user);
};

export const jwtStrategy = new Strategy(
  jwtOptions,
  tryCatch(verifyUser, (error, payload, done) => {
    return done(error, false);
  })
);