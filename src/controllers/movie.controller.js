import { movieSchema, movieQuerySchema } from "../schemas/movie.schema.js";
import { uuidSchema } from "../schemas/uuid.schema.js";
import movieService from "../services/movie.service.js";
import { tryCatch } from "../utils/try-catch.js";
import { ErrorFactory } from "../common/errors/error-factory.js";
import { validateRequest } from "../utils/validate-request.util.js";
import { checkCache, setCache, deleteCache } from "../utils/cache.utils.js";

export const getAllMovies = tryCatch(async (req, res) => {
    console.log("This is a get operation");
    validateRequest(movieQuerySchema, req.query);
    const {title, order, page, limit} = req.query;
    const cachedMovies = checkCache("getAllCharacters", req.query);
    if(cachedMovies) return res.status(200).json(cachedMovies);
    const movies = await movieService.getAllMovies(title, order, page, limit);
    if(!movies || movies.movies.length === 0) return res.status(200).send("No movies found");
    setCache("getAllMovies", req.query, movies);
    return res.status(200).json(movies);
});

export const getMovieById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a get operation");
    validateRequest(uuidSchema, req.params);
    const cachedMovie = checkCache("getMovieById", req.params);
    if(cachedMovie) return res.status(200).json(cachedMovie);
    const movie = await movieService.getMovieById(req.params.id);
    if(!movie) throw ErrorFactory.createError("NOT_FOUND", "Movie not found");
    setCache("getMovieById", req.params, movie);
    return res.status(200).json(movie);
});

export const createMovie = tryCatch(async (req, res) => {
    console.log("This is a get operation");
    validateRequest(movieSchema, req.body);
    const movie = await movieService.createMovie(req.body);
    if(!movie) throw ErrorFactory.createError("INTERNAL_SERVER", "Failed to create movie");
    deleteCache('getAllMovies', {});
    return res.status(201).send("Movie created succesfully");
});

export const updateMovieById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a update operation");
    validateRequest(uuidSchema, req.params);
    validateRequest(movieSchema, req.body);
    const movie = await movieService.updateMovieById(req.params.id, req.body);
    if(!movie) throw ErrorFactory.createError("NOT_FOUND", "Movie not found");
    deleteCache('getAllMovies', {});
    deleteCache('getMovieById', req.params);
    return res.status(200).send("Movie updated succesfully");
});

export const deleteMovieById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a delete operation");
    validateRequest(uuidSchema, req.params);
    const movie = await movieService.deleteMovieById(req.params.id);
    if(!movie) throw ErrorFactory.createError("NOT_FOUND", "Movie not found");
    deleteCache('getAllMovies', {});
    return res.status(204).send();
});