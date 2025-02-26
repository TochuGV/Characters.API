import { movieSchema, movieQuerySchema } from "../schemas/movie.schema.js";
import { uuidSchema } from "../schemas/uuid.schema.js";
import movieService from "../services/movie.service.js";
import { tryCatch } from "../utils/try-catch.js";
import { ErrorFactory } from "../common/errors/error-factory.js";
import { validateRequest } from "../utils/validate-request.util.js";

export const getAllMovies = tryCatch(async (req, res) => {
    console.log("This is a get operation");
    validateRequest(movieQuerySchema, req.query);
    const {title, order, page, limit} = req.query;
    const movies = await movieService.getAllMovies(title, order, page, limit);
    if(!movies || movies.movies.length === 0) return res.status(200).send("Movies not found");
    return res.status(200).json(movies);
});

export const getMovieById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a get operation");
    validateRequest(uuidSchema, {id: req.params.id});
    const movie = await movieService.getMovieById(req.params.id);
    if(!movie) throw ErrorFactory.createError("NOT_FOUND", "Movie not found"); 
    return res.status(200).json(movie);
});

export const createMovie = tryCatch(async (req, res) => {
    console.log("This is a get operation");
    validateRequest(movieSchema, req.body);
    const result = await movieService.createMovie(req.body);
    if(!result) throw ErrorFactory.createError("INTERNAL_SERVER", "Failed to create movie")
    return res.status(201).send("Movie created succesfully");
});

export const updateMovieById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a update operation");
    validateRequest(uuidSchema, {id: req.params.id});
    validateRequest(movieSchema, req.body);
    const result = await movieService.updateMovieById(req.params.id, req.body);
    if(!result) throw ErrorFactory.createError("NOT_FOUND", "Movie not found");
    return res.status(200).send("Movie updated succesfully");
});

export const deleteMovieById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a delete operation");
    validateRequest(uuidSchema, {id: req.params.id});
    const result = await movieService.deleteMovieById(req.params.id);
    if(!result) throw ErrorFactory.createError("NOT_FOUND", "Movie not found");
    return res.status(204).send();
});