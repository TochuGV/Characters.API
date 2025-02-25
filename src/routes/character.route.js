import { Router } from "express";
import { 
    getAllCharacters, 
    getCharacterById, 
    createCharacter, 
    updateCharacterById, 
    deleteCharacterById 
} from "../controllers/character.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router();

router.get('/', authMiddleware, getAllCharacters);
router.get('/:id', authMiddleware, getCharacterById);
router.post('', authMiddleware, createCharacter);
router.put('/:id', authMiddleware, updateCharacterById);
router.delete('/:id', authMiddleware, deleteCharacterById);

export default router;