import { Strategy, ExtractJwt } from "passport-jwt";
import { userService } from "../container/index.js";
import env from "./enviroment.config.js";

const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.signedCookies?.jwt]),
  secretOrKey: env.JWT_SECRET_KEY,
  algorithms: ["HS256"],
  //issuer: "yourdomain.com",
  //audience: "yourdomain.com",
  ignoreExpiration: false,
  //passReqToCallback: false
};

export const jwtStrategy = new Strategy(options, async (jwt_payload, done) => {
  try {
    const user = await userService.getByEmail(jwt_payload.email);
    if(!user) return done(null, false);
    return done(null, user);
  } catch(error){
    return done(error, false);
  };
});