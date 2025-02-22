import passport from "passport";
import "dotenv/config"
import { UnauthorizedError } from "../utils/errors.js";

export const authMiddleware = (req, res, next) => {
    let token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    if (!token) throw new UnauthorizedError("Unauthorized");
    passport.authenticate('jwt', {session: false}, (err, user) => {
        if(err || !user) throw new UnauthorizedError("Unauthorized");
        req.user = user
        next();
    })(req, res, next);
};