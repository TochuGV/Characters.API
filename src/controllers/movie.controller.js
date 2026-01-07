import { movieSchema, movieQuerySchema } from "../schemas/movie.schema.js";
import { uuidSchema } from "../schemas/uuid.schema.js";
import tryCatch from "../utils/try-catch.js";
import errorFactory from "../errors/error-factory.js";
import { validateRequest } from "../utils/validate-request.util.js";
import { checkCache, setCache, deleteCache } from "../utils/cache.utils.js";
import logger from "../logger/index.js";

export default class MovieController {
  constructor(movieService) {
    this.movieService = movieService;
  }

  getAllMovies = tryCatch(async (req, res) => {
    logger.info("This is a get operation");
    const queryData = validateRequest(movieQuerySchema, req.query);
    const cachedResult = checkCache("getAllMovies", queryData);
    if (cachedResult) return res.status(200).json(cachedResult);
    const result = await this.movieService.getAll(queryData);
    if (!result || result.items.length === 0) return res.status(200).send("No movies found");
    setCache("getAllMovies", queryData, result);
    return res.status(200).json(result);
  });
  
  getMovieById = tryCatch(async (req, res) => {
    logger.info(`Request URL Param: ${req.params.id}`);
    logger.info("This is a get operation");
    const params = validateRequest(uuidSchema, req.params);
    const cachedResult = checkCache("getMovieById", params);
    if (cachedResult) return res.status(200).json(cachedResult);
    const result = await this.movieService.getById(params.id);
    if (!result) throw errorFactory.createError("NOT_FOUND", "Movie not found");
    setCache("getMovieById", params, result);
    return res.status(200).json(result);
  });
  
  createMovie = tryCatch(async (req, res) => {
    logger.info("This is a post operation");
    const data = validateRequest(movieSchema, req.body);
    const result = await this.movieService.create(data);
    if (!result) throw errorFactory.createError("INTERNAL_SERVER", "Failed to create movie");
    deleteCache('getAllMovies', {});
    return res.status(201).json(result);
  });
  
  updateMovieById = tryCatch(async (req, res) => {
    logger.info(`Request URL Param: ${req.params.id}`);
    logger.info("This is a update operation");
    const params = validateRequest(uuidSchema, req.params);
    const data = validateRequest(movieSchema, req.body);
    const result = await this.movieService.updateById(params.id, data);
    if (!result) throw errorFactory.createError("NOT_FOUND", "Movie not found");
    deleteCache('getAllMovies', {});
    deleteCache('getMovieById', params);
    return res.status(200).json(result);
  });
  
  deleteMovieById = tryCatch(async (req, res) => {
    logger.info(`Request URL Param: ${req.params.id}`);
    logger.info("This is a delete operation");
    const params = validateRequest(uuidSchema, req.params);
    const result = await this.movieService.deleteById(params.id);
    if (!result) throw errorFactory.createError("NOT_FOUND", "Movie not found");
    deleteCache('getAllMovies', {});
    return res.status(204).send();
  });
};