export const errorHandler = (err, req, res, next) => {
  console.error(err);
  let statusCode = err.statusCode || 500;
  if (err.message.includes("Database") || err.message.includes("Failed to connect to the database")) statusCode = 503;
  const response = { error: err.isOperational ? err.message : "Something went wrong!" };
  if (err.details && err.isOperational) response.details = err.details;
  return res.status(statusCode).json(response);
};