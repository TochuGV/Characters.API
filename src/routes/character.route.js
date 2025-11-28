import { Router } from "express";
import { characterController } from "../container/index.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/', authMiddleware, characterController.getAllCharacters);
router.get('/:id', authMiddleware, characterController.getCharacterById);
router.post('', authMiddleware, characterController.createCharacter);
router.put('/:id', authMiddleware, characterController.updateCharacterById);
router.delete('/:id', authMiddleware, characterController.deleteCharacterById);

export default router;