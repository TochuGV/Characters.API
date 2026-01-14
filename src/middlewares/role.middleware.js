import errorFactory from "../errors/error-factory.js";

const isAdmin = (req, res, next) => {
  const unauthorizedError = errorFactory.unauthorized("User not authenticated");
  const forbiddenError = errorFactory.forbidden("Access denied");
  if (!req.user) return next(unauthorizedError);
  if (req.user.role !== "ADMIN") return next(forbiddenError);
  next();
};

export default isAdmin;