import passport from "passport";
import errorFactory from "../errors/error-factory.js";

const authMiddleware = (req, res, next) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      let message = info?.message || "Invalid credentials";
      if (message.toLowerCase().includes("jwt")) message = message.replace(/jwt/i, "Token");
      message = message.charAt(0).toUpperCase() + message.slice(1);
      return next(errorFactory.createError("UNAUTHORIZED", message));
    };
    req.user = user
    next();
  })(req, res, next);
};

export default authMiddleware;