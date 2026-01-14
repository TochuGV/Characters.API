import { Prisma } from "@prisma/client";
import errorFactory from "./error-factory.js";

export const isPrismaError = (error) => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientValidationError
  );
};

export const handlePrismaError = (error) => {
  let message = "Unexpected database error";
  let details = null;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    details = error.meta || null;
    switch (error.code) {
      case "P2002":
        message = "Unique constraint violation: Data already exists";
        if (details?.operation) delete details.operation;
        return errorFactory.conflict(message, details);
      case "P2025":
        message = "Record not found to perform the operation";
        if (details?.operation) delete details.operation;
        return errorFactory.notFound(message, details);
      case "P2003":
        message = "Foreign key constraint failed: Related record not found";
        return errorFactory.badRequest(message, details);
      default:
        message = `Database error code: ${error.code}`;
        return errorFactory.database(message, details);
    };
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    message = "Failed to connect to the database server";
    return errorFactory.database(message, details);
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    message = "Invalid database query structure or data types";
    return errorFactory.badRequest(message, details);
  };

  return errorFactory.database(message, details);
};