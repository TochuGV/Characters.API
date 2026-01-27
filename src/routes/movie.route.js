import { Router } from "express";
import { movieController } from "../container/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import idempotencyMiddleware from "../middlewares/idempotency.middleware.js";
import isAdmin from "../middlewares/role.middleware.js";

const router = Router();

router.get('/', authMiddleware, movieController.getAllMovies);
router.get('/:id', authMiddleware, movieController.getMovieById);
router.post('', authMiddleware, idempotencyMiddleware, isAdmin, movieController.createMovie);
router.put('/:id', authMiddleware, isAdmin, movieController.updateMovieById);
router.delete('/:id', authMiddleware, isAdmin, movieController.deleteMovieById);
router.post('/:id/characters', authMiddleware, idempotencyMiddleware, isAdmin, movieController.addCharacterToMovie);
router.delete('/:id/characters/:characterId', authMiddleware, isAdmin, movieController.removeCharacterFromMovie);

export default router;