import pino from "pino";
import loggerConfiguration from "../configuration/logger.configuration.js";

const logger = pino(loggerConfiguration);

export default logger;