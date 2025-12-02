import errorFactory from "../errors/error-factory.js";

const handleDatabaseError = (error) => {
  if(error.code === "ELOGIN") throw errorFactory.createError("DATABASE", "Invalid database credentials");
  if(error.code === "ETIMEOUT") throw errorFactory.createError("DATABASE", "Database connection timeout");
  if(error.code === "EPARAM") throw errorFactory.createError("DATABASE", `Invalid parameter ${error.message}`);
  throw errorFactory.createError("DATABASE", `Unexpected database error: ${error.message} || Unknown error`);
};

export default handleDatabaseError;