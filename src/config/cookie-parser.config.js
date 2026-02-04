import cookieParser from "cookie-parser";
import env from "./environment.config.js";

export default cookieParser(env.JWT_REFRESH_SECRET_KEY);