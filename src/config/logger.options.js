import env from "./enviroment.config.js";

const loggerOptions = {
  level: env.LOG_LEVEL,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
      ignore: "pid,hostname"
    },
  }
};

export default loggerOptions;