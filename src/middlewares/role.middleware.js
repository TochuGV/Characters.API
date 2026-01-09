import errorFactory from "../errors/error-factory.js";

const isAdmin = (req, res, next) => {
  const unauthorizedError = errorFactory.createError("UNAUTHORIZED", "User not authenticated");
  const forbiddenError = errorFactory.createError("FORBIDDEN", "Access denied");
  if (!req.user) return next(unauthorizedError);
  if (req.user.role !== "ADMIN") return next(forbiddenError);
  next();
};

export default isAdmin;