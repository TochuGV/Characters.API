import { Router } from "express";
import { 
    getAllMovies, 
    getMovieById, 
    createMovie, 
    updateMovieById, 
    deleteMovieById 
} from "../controllers/movie.controller.js";
import { validateIdMiddleware } from "../middlewares/validateId.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router();

router.get('/', authMiddleware, getAllMovies);
router.get('/:id', authMiddleware, validateIdMiddleware, getMovieById);
router.post('', authMiddleware, createMovie);
router.put('/:id', authMiddleware, validateIdMiddleware, updateMovieById);
router.delete('/:id', authMiddleware, validateIdMiddleware, deleteMovieById);

export default router;