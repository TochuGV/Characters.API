import { validateMovie, validateMovieQuery } from "../schemas/movie.schema.js";
import movieService from "../services/movie.service.js";
import { tryCatch } from "../utils/try-catch.js";
import { BadRequestError, NotFoundError, ValidationError } from "../utils/errors.js";

export const getAllMovies = async (req, res) => {
    console.log("This is a get operation");
    const validation = validateMovieQuery(req.query);
    if(!validation.success) throw new BadRequestError(JSON.parse(validation.error.message));
    const {title, order} = req.query;
    const movies = await movieService.getAllMovies(title, order);
    if(!movies) return res.status(200).send("Movies not found");
    return res.status(200).json(movies);
};

export const getMovieById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a get operation");
    const movie = await movieService.getMovieById(req.params.id);
    if(!movie) throw new NotFoundError("Movie not found"); 
    return res.status(200).json(movie);
});

export const createMovie = async (req, res) => {
    console.log("This is a get operation");
    const validation = validateMovie(req.body);
    if(!validation.success) throw new ValidationError(JSON.parse(validation.error.message));
    const result = await movieService.createMovie(req.body);
    if(result.rowsAffected[0] > 0) return res.status(201).send("Movie created succesfully");
        return res.status(400).send("Bad request"); //Hay que manejar bien los errores porque es imposible que llegue acá
};

export const updateMovieById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a update operation");
    const validation = validateMovie(req.body);
    if(!validation.success) throw new ValidationError(JSON.parse(validation.error.message))
    const result = await movieService.updateMovieById(req.params.id, req.body);
    if(!(result.rowsAffected[0] > 0)) throw new NotFoundError("Movie not found");
    return res.status(200).send("Movie updated succesfully");
});

export const deleteMovieById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a delete operation");
    const result = await movieService.deleteMovieById(req.params.id);
    if(!(result.rowsAffected[0] > 0)) throw new NotFoundError("Movie not found");
    return res.status(204).send();
});