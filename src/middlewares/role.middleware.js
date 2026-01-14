import ErrorFactory from "../errors/error-factory.js";

const isAdmin = (req, res, next) => {
  const unauthorizedError = ErrorFactory.unauthorized("User not authenticated");
  const forbiddenError = ErrorFactory.forbidden("Access denied");
  if (!req.user) return next(unauthorizedError);
  if (req.user.role !== "ADMIN") return next(forbiddenError);
  next();
};

export default isAdmin;