import { Strategy, ExtractJwt } from "passport-jwt";
import userService from "../services/user.service.js";
import { CONFIG } from "../common/config.constants.js";

const options = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies?.jwt
    ]), // De dónde extraer el token
    secretOrKey: CONFIG.JWT_SECRET_KEY, // Clave secreta para verificar el token
    algorithms: ["HS256"], // Algoritmo de firma permitido -.env
    //issuer: "yourdomain.com", // Quién emitió el token -.env
    //audience: "yourdomain.com", // Para quién está destinado el token -.env
    ignoreExpiration: false, // Si debe ignorar la expiración del token
    //passReqToCallback: false, // Si quieres pasar `req` al callback de `JwtStrategy`
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