import { movieSchema, movieQuerySchema } from "../schemas/movie.schema.js";
import { uuidSchema } from "../schemas/uuid.schema.js";
import { tryCatch } from "../utils/try-catch.js";
import errorFactory from "../common/errors/error-factory.js";
import { validateRequest } from "../utils/validate-request.util.js";
import { checkCache, setCache, deleteCache } from "../utils/cache.utils.js";
import logger from "../logger/index.js";

export default class MovieController {
  constructor(movieService) {
    this.movieService = movieService;
  }

  getAllMovies = tryCatch(async (req, res) => {
    logger.info("This is a get operation");
    validateRequest(movieQuerySchema, req.query);
    const {title, order, page, limit} = req.query;
    const cachedMovies = checkCache("getAllMovies", req.query);
    if (cachedMovies) return res.status(200).json(cachedMovies);
    const movies = await this.movieService.getAll(title, order, page, limit);
    if (!movies || movies.movies.length === 0) return res.status(200).send("No movies found");
    setCache("getAllMovies", req.query, movies);
    return res.status(200).json(movies);
  });
  
  getMovieById = tryCatch(async (req, res) => {
    logger.info(`Request URL Param: ${req.params.id}`);
    logger.info("This is a get operation");
    validateRequest(uuidSchema, req.params);
    const cachedMovie = checkCache("getMovieById", req.params);
    if (cachedMovie) return res.status(200).json(cachedMovie);
    const movie = await this.movieService.getById(req.params.id);
    if (!movie) throw errorFactory.createError("NOT_FOUND", "Movie not found");
    setCache("getMovieById", req.params, movie);
    return res.status(200).json(movie);
  });
  
  createMovie = tryCatch(async (req, res) => {
    logger.info("This is a get operation");
    validateRequest(movieSchema, req.body);
    const movie = await this.movieService.create(req.body);
    if (!movie) throw errorFactory.createError("INTERNAL_SERVER", "Failed to create movie");
    deleteCache('getAllMovies', {});
    return res.status(201).send("Movie created succesfully");
  });
  
  updateMovieById = tryCatch(async (req, res) => {
    logger.info(`Request URL Param: ${req.params.id}`);
    logger.info("This is a update operation");
    validateRequest(uuidSchema, req.params);
    validateRequest(movieSchema, req.body);
    const movie = await this.movieService.updateById(req.params.id, req.body);
    if (!movie) throw errorFactory.createError("NOT_FOUND", "Movie not found");
    deleteCache('getAllMovies', {});
    deleteCache('getMovieById', req.params);
    return res.status(200).send("Movie updated succesfully");
  });
  
  deleteMovieById = tryCatch(async (req, res) => {
    logger.info(`Request URL Param: ${req.params.id}`);
    logger.info("This is a delete operation");
    validateRequest(uuidSchema, req.params);
    const movie = await this.movieService.deleteById(req.params.id);
    if (!movie) throw errorFactory.createError("NOT_FOUND", "Movie not found");
    deleteCache('getAllMovies', {});
    return res.status(204).send();
  });
};