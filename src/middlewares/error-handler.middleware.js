export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const response = { error: err.isOperational ? err.message : "Something went wrong!" };
  if (err.details && err.isOperational) response.details = err.details;
  return res.status(statusCode).json(response);
};