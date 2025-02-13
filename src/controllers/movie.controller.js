import { validateMovie } from "../schemas/movie.schema.js";
import movieService from "../services/movie.service.js";

export const getAllMovies = async (req, res) => {
    console.log("This is a get operation");
    try {
        const {title, order} = req.query;
        const movies = await movieService.getAllMovies(title, order);
        if(!movies) return res.status(200).send("Movies not found");
        return res.status(200).json(movies);
    } catch(error){
        console.error(error);
        return res.status(500).send("Internal server error");
    };
};

export const getMovieById = async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a get operation");
    try {
        const movie = await movieService.getMovieById(req.params.id);
        if(movie) return res.status(200).json(movie);
        return res.status(404).send("Movie not found");
    } catch(error){
        console.error(error);
        return res.status(500).send("Internal server error");
    };
};

export const createMovie = async (req, res) => {
    console.log("This is a get operation");
    const validation = validateMovie(req.body);
    if(!validation.success){
        return res.status(422).json({ 
            error: "Unprocessable Entity", 
            details: JSON.parse(validation.error.message) 
        });
    };
    try {
        const result = await movieService.createMovie(req.body);
        if(result.rowsAffected[0] > 0) return res.status(201).send("Movie created succesfully");
        return res.status(400).send("Bad request"); //Hay que manejar bien los errores porque es imposible que llegue acá
    } catch(error){
        console.error(error);
        return res.status(500).send("Internal server error");
    };
};

export const updateMovieById = async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a update operation");
    const validation = validateMovie(req.body);
    if(!validation.success){
        return res.status(422).json({ 
            error: "Unprocessable Entity", 
            details: JSON.parse(validation.error.message) 
        });
    };
    try {
        const result = await movieService.updateMovieById(req.params.id, req.body);
        if(result.rowsAffected[0] > 0) return res.status(200).send("Movie updated succesfully");
        return res.status(404).send("Movie not found");
    } catch(error){
        console.error(error);
        return res.status(500).send("Internal server error");
    };
};

export const deleteMovieById = async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a delete operation");
    try {
        const result = await movieService.deleteMovieById(req.params.id);
        if(result.rowsAffected[0] > 0) return res.status(204).send();
        return res.status(404).send("Movie not found");
    } catch(error){
        console.error(error);
        return res.status(500).send("Internal server error");
    };
};