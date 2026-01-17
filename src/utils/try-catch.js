import logger from "../logger/index.js";

const isExpressContext = (args) => {
  const [ , res, next] = args;
  return typeof next === "function"
    && typeof res?.status === "function"
    && typeof res?.json === "function";
};

const tryCatch = (fn, customErrorHandler) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch(error) {
      if (customErrorHandler) return customErrorHandler(error, ...args);
      
      if (isExpressContext(args)) {
        const next = args[2];
        return next(error);
      };

      logger.error({ error }, "Execution failed silently");
      return null;
    };
  };
};

export default tryCatch;