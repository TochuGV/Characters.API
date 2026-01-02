import pino from "pino";
import loggerConfig from "../config/logger.config.js";

const logger = pino(loggerConfig);

export default logger;