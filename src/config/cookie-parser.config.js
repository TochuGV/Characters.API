import cookieParser from "cookie-parser";
import env from "./enviroment.config.js";

export default cookieParser(env.JWT_REFRESH_SECRET_KEY);