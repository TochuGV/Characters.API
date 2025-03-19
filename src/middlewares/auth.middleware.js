import passport from "passport";
import errorFactory from "../common/errors/error-factory.js";

export const authMiddleware = (req, res, next) => {
	let token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
	if (!token) throw errorFactory.createError("UNAUTHORIZED");
	passport.authenticate('jwt', {session: false}, (err, user) => {
		if(err || !user) throw errorFactory.createError("UNAUTHORIZED");
		req.user = user
		next();
	})(req, res, next);
};