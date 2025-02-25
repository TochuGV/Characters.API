import passport from "passport";
import "dotenv/config"
import { ErrorFactory } from "../common/errors/errorFactory.js";

export const authMiddleware = (req, res, next) => {
    let token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    if (!token) throw ErrorFactory.createError("UNAUTHORIZED");
    passport.authenticate('jwt', {session: false}, (err, user) => {
        if(err || !user) throw ErrorFactory.createError("UNAUTHORIZED");
        req.user = user
        next();
    })(req, res, next);
};