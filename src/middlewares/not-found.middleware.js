import ErrorFactory from "../errors/error-factory.js";

const notFoundHandler = (req, res, next) => {
  next(ErrorFactory.notFound(`Route '${req.originalUrl}' not found`));
};

export default notFoundHandler;