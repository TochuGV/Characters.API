import { Router } from "express";
import { 
    getAllCharacters, 
    getCharacterById, 
    createCharacter, 
    updateCharacterById, 
    deleteCharacterById 
} from "../controllers/character.controller.js";
import { validateIdMiddleware } from "../middlewares/validateId.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router();

router.get('/', authMiddleware, getAllCharacters);
router.get('/:id', authMiddleware, validateIdMiddleware, getCharacterById);
router.post('', authMiddleware, createCharacter);
router.put('/:id', authMiddleware, validateIdMiddleware, updateCharacterById);
router.delete('/:id', authMiddleware, validateIdMiddleware, deleteCharacterById);

export default router;