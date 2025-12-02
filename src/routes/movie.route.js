import { Router } from "express";
import { movieController } from "../container/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/', authMiddleware, movieController.getAllMovies);
router.get('/:id', authMiddleware, movieController.getMovieById);
router.post('', authMiddleware, movieController.createMovie);
router.put('/:id', authMiddleware, movieController.updateMovieById);
router.delete('/:id', authMiddleware, movieController.deleteMovieById);

export default router;