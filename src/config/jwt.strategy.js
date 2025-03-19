import { Strategy, ExtractJwt } from "passport-jwt";
import userService from "../services/user.service.js";
import { CONFIG } from "../common/config.constants.js";

const options = {
	jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies?.jwt]),
	secretOrKey: CONFIG.JWT_SECRET_KEY,
	algorithms: ["HS256"],
	//issuer: "yourdomain.com",
	//audience: "yourdomain.com",
	ignoreExpiration: false,
	//passReqToCallback: false
};

export const jwtStrategy = new Strategy(options, async (jwt_payload, done) => {
	try {
		const user = await userService.getUserByEmail(jwt_payload.email);
		if(!user) return done(null, false);
		return done(null, user);
	} catch(error){
		return done(error, false);
	};
});