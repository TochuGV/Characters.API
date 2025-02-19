import passport from "passport";
import "dotenv/config"

export const authMiddleware = (req, res, next) => {
    let token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send("Unauthorized");
    passport.authenticate('jwt', {session: false}, (err, user) => {
        if(err || !user) return res.status(401).send("Unauthorized");
        req.user = user
        next();
    })(req, res, next);
};