import { Router } from "express";
import { 
    getAllMovies, 
    getMovieById, 
    createMovie, 
    updateMovieById, 
    deleteMovieById 
} from "../controllers/movie.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router();

router.get('/', authMiddleware, getAllMovies);
router.get('/:id', authMiddleware, getMovieById);
router.post('', authMiddleware, createMovie);
router.put('/:id', authMiddleware, updateMovieById);
router.delete('/:id', authMiddleware, deleteMovieById);

export default router;