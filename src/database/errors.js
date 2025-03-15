import { ErrorFactory } from "../common/errors/error-factory.js";

export const handleDatabaseError = (error) => {
	if(error.code === "ELOGIN") throw ErrorFactory.createError("DATABASE", "Invalid database credentials");
	if(error.code === "ETIMEOUT") throw ErrorFactory.createError("DATABASE", "Database connection timeout");
	throw ErrorFactory.createError("DATABASE", `Unexpected database error: ${error.message} || Unknown error`);
};