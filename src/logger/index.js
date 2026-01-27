import pino from "pino";
import loggerOptions from "../config/logger.options.js";

const logger = pino(loggerOptions);

export default logger;