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
  let type = "INTERNAL_SERVER";
  let message = "Unexpected database error";
  let details = null;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    details = error.meta || null;
    switch (error.code) {
      case "P2002":
        type = "CONFLICT";
        message = "Unique constraint violation: Data already exists";
        break;
      case "P2025":
        type = "NOT_FOUND";
        message = "Record not found to perform the operation";
        if (details?.operation) delete details.operation;
        break;
      case "P2003":
        type = "BAD_REQUEST";
        message = "Foreign key constraint failed: Related record not found";
        break;
      default:
        type = "DATABASE";
        message = `Database error code: ${error.code}`;
    };
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    type = "DATABASE";
    message = "Failed to connect to the database server";
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    type = "BAD_REQUEST";
    message = "Invalid database query structure or data types";
  };

  return errorFactory.createError(type, details, message);
};