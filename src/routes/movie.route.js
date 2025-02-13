import { Router } from "express";
import { 
    getAllMovies, 
    getMovieById, 
    createMovie, 
    updateMovieById, 
    deleteMovieById 
} from "../controllers/movie.controller.js";
import { validateIdMiddleware } from "../middlewares/validateId.middleware.js";

const router = Router();

router.get('/', getAllMovies);
router.get('/:id', validateIdMiddleware, getMovieById);
router.post('', createMovie);
router.put('/:id', validateIdMiddleware, updateMovieById);
router.delete('/:id', validateIdMiddleware, deleteMovieById);

export default router;