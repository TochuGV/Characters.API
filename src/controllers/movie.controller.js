import { movieSchema, movieQuerySchema } from "../schemas/movie.schema.js";
import movieService from "../services/movie.service.js";
import { tryCatch } from "../utils/try-catch.js";
import { ErrorFactory } from "../common/errors/errorFactory.js";

export const getAllMovies = async (req, res) => {
    console.log("This is a get operation");
    validateRequest(movieQuerySchema, req.query);
    const {title, order} = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const movies = await movieService.getAllMovies(title, order, page, limit);
    if(!movies || movies.movies.length === 0) return res.status(200).send("Movies not found");
    return res.status(200).json(movies);
};

export const getMovieById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a get operation");
    const movie = await movieService.getMovieById(req.params.id);
    if(!movie) throw ErrorFactory.createError("NOT_FOUND", "Movie not found"); 
    return res.status(200).json(movie);
});

export const createMovie = async (req, res) => {
    console.log("This is a get operation");
    validateRequest(movieSchema, req.body);
    const result = await movieService.createMovie(req.body);
    if(result.rowsAffected[0] > 0) return res.status(201).send("Movie created succesfully");
        return res.status(400).send("Bad request"); //Hay que manejar bien los errores porque es imposible que llegue acá
};

export const updateMovieById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a update operation");
    validateRequest(movieSchema, req.body);
    const result = await movieService.updateMovieById(req.params.id, req.body);
    if(!(result.rowsAffected[0] > 0)) throw ErrorFactory.createError("NOT_FOUND", "Movie not found");
    return res.status(200).send("Movie updated succesfully");
});

export const deleteMovieById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a delete operation");
    const result = await movieService.deleteMovieById(req.params.id);
    if(!(result.rowsAffected[0] > 0)) throw ErrorFactory.createError("NOT_FOUND", "Movie not found");
    return res.status(204).send();
});