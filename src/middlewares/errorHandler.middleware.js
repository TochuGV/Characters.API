export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const response = {
    error: err.message || "Internal Server Error"
  };
  if (err.details) response.details = err.details;
  return res.status(statusCode).json(response);
};