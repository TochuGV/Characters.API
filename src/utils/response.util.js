const successResponse = (res, data, statusCode = 200, location = null) => {
  if (location) res.location(location);
  if (statusCode === 204) return res.status(204).send();

  return res.status(statusCode).json({
    status: 'success',
    data
  });
};

export default successResponse;