import { Router } from "express";
import { characterController } from "../container/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import idempotencyMiddleware from "../middlewares/idempotency.middleware.js";
import isAdmin from "../middlewares/role.middleware.js";

const router = Router();

router.get('/', authMiddleware, characterController.getAllCharacters);
router.get('/:id', authMiddleware, characterController.getCharacterById);
router.post('', authMiddleware, idempotencyMiddleware, isAdmin, characterController.createCharacter);
router.put('/:id', authMiddleware, isAdmin, characterController.updateCharacterById);
router.delete('/:id', authMiddleware, isAdmin, characterController.deleteCharacterById);

export default router;