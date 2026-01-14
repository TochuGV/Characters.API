import { movieSchema, movieQuerySchema } from "../schemas/movie.schema.js";
import { uuidSchema } from "../schemas/uuid.schema.js";
import tryCatch from "../utils/try-catch.js";
import errorFactory from "../errors/error-factory.js";
import successResponse from "../utils/response.util.js";
import validateRequest from "../utils/validate-request.util.js";
import { checkCache, setCache, deleteCache } from "../utils/cache.utils.js";
import logger from "../logger/index.js";

export default class MovieController {
  constructor(movieService) {
    this.movieService = movieService;
  }

  getAllMovies = tryCatch(async (req, res) => {
    logger.info("[GET] /movies - Fetching all movies");
    const queryData = validateRequest(movieQuerySchema, req.query);
    const cachedResult = checkCache("getAllMovies", queryData);
    if (cachedResult) return successResponse(res, cachedResult);
    const result = await this.movieService.getAll(queryData);
    setCache("getAllMovies", queryData, result);
    return successResponse(res, result);
  });
  
  getMovieById = tryCatch(async (req, res) => {
    logger.info(`[GET] /movies/:id - Fetching movie details for ID: ${req.params.id}`);
    const params = validateRequest(uuidSchema, req.params);
    const cachedResult = checkCache("getMovieById", params);
    if (cachedResult) return successResponse(res, cachedResult);
    const result = await this.movieService.getById(params.id);
    if (!result) throw errorFactory.notFound("Movie not found");
    setCache("getMovieById", params, result);
    return successResponse(res, result);
  });
  
  createMovie = tryCatch(async (req, res) => {
    logger.info(`[POST] /movies - Creating new movie: "${req.body.title}"`);
    const data = validateRequest(movieSchema, req.body);
    const result = await this.movieService.create(data);
    deleteCache('getAllMovies', {});
    return successResponse(res, result, 201);
  });
  
  updateMovieById = tryCatch(async (req, res) => {
    logger.info(`[PUT] /movies/:id - Updating movie with ID: ${req.params.id}`);
    const params = validateRequest(uuidSchema, req.params);
    const data = validateRequest(movieSchema, req.body);
    const result = await this.movieService.updateById(params.id, data);
    deleteCache('getAllMovies', {});
    deleteCache('getMovieById', params);
    return successResponse(res, result);
  });
  
  deleteMovieById = tryCatch(async (req, res) => {
    logger.info(`[DELETE] /movies/:id - Deleting movie with ID: ${req.params.id}`);
    const params = validateRequest(uuidSchema, req.params);
    await this.movieService.deleteById(params.id);
    deleteCache('getAllMovies', {});
    deleteCache('getMovieById', params);
    return successResponse(res, result, 204);
  });

  addCharacterToMovie = tryCatch(async (req, res) => {
    logger.info(`[POST] /movies/:id/characters - Adding character to movie: "${req.params.id}"`);
    const params = validateRequest(uuidSchema, req.params);
    const data = validateRequest(uuidSchema, { id: req.body.characterId });
    const result = await this.movieService.addCharacter(params.id, data.id);
    deleteCache('getMovieById', params);
    return successResponse(res, result);
  });

  removeCharacterFromMovie = tryCatch(async (req, res) => {
    logger.info(`[DELETE] /movies/:id/characters/:characterId - Removing character from movie: "${req.params.id}"`);
    const params = validateRequest(uuidSchema, { id: req.params.id });
    const characterParams = validateRequest(uuidSchema, { id: req.params.characterId });
    const result = await this.movieService.removeCharacter(params.id, characterParams.id);
    deleteCache('getMovieById', params);
    return successResponse(res, result);
  });
};