import { Prisma } from "@prisma/client";
import ErrorFactory from "./error-factory.js";

export const isPrismaError = (error) => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientValidationError
  );
};

export const handlePrismaError = (error) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return ErrorFactory.conflict(
          "Unique constraint violation: Data already exists",
          { target: error.meta?.target || "Unknown field" }
        );
      case "P2025":
        return ErrorFactory.notFound(
          "Record not found to perform the operation",
          { modelName: error.meta?.modelName || "Unknown model" }
        );
      case "P2003":
        return ErrorFactory.notFound(
          "Foreign key constraint failed: Related record not found",
          {
            modelName: error.meta?.modelName || "Unknown model",
            field: error.meta?.field_name || "Foreign Key Relation"
          }
        );
      default:
        return ErrorFactory.database("Unexpected database error");
    };
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    return ErrorFactory.database("Failed to connect to the database server");
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    return ErrorFactory.badRequest("Invalid database query structure or data types");
  };

  return ErrorFactory.database("Unexpected database error");
};