import rateLimit from "express-rate-limit";
import limiterConfiguration from "../configuration/rate-limit.configuration.js";

const limiter = rateLimit(limiterConfiguration);

export default limiter;