import movieService from "../services/movie.service.js";

export const getAllMovies = async (req, res) => {
    console.log("This is a get operation");
    const {title, order} = req.query;
    const movies = await movieService.getAllMovies(title, order);
    return res.status(200).json(movies);
};

export const getMovieById = async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a get operation");
    const movie = await movieService.getMovieById(req.params.id);
    return res.status(200).json(movie);
};

export const createMovie = async (req, res) => {
    console.log("This is a get operation");
    const movie = await movieService.createMovie(req.body);
    return res.status(200).json(movie);
};

export const updateMovieById = async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a update operation");
    const movie = await movieService.updateMovieById(req.params.id, req.body);
    return res.status(200).json(movie);
};

export const deleteMovieById = async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a delete operation");
    const movie = await movieService.deleteMovieById(req.params.id);
    return res.status(200).json(movie);
};