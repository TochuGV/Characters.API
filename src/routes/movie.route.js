import { Router } from "express";
import MovieService from "../services/movie.service.js";
import MovieController from "../controllers/movie.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router();
const movieService = new MovieService();
const movieController = new MovieController(movieService);

router.get('/', authMiddleware, movieController.getAllMovies);
router.get('/:id', authMiddleware, movieController.getMovieById);
router.post('', authMiddleware, movieController.createMovie);
router.put('/:id', authMiddleware, movieController.updateMovieById);
router.delete('/:id', authMiddleware, movieController.deleteMovieById);

export default router;