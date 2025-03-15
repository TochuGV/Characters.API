import { ErrorFactory } from "../common/errors/error-factory.js";

/*
const throwDatabaseError = (errorCode, message) => {
	throw ErrorFactory.createError("DATABASE", `${errorCode}: ${message}`);
}
*/

export const handleDatabaseError = (error) => {
	if(error.code === "ELOGIN") throw ErrorFactory.createError("DATABASE", "Invalid database credentials");
	if(error.code === "ETIMEOUT") throw ErrorFactory.createError("DATABASE", "Database connection timeout");
	if(error.code === "EPARAM") throw ErrorFactory.createError("DATABASE", `Invalid parameter ${error.message}`);
	throw ErrorFactory.createError("DATABASE", `Unexpected database error: ${error.message} || Unknown error`);
};