import passport from "passport";
import { jwtStrategy } from "./jwt.strategy.js";

passport.use("jwt", jwtStrategy);

export default passport.initialize();