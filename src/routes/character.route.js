import { Router } from "express";
import { 
    getAllCharacters, 
    getCharacterById, 
    createCharacter, 
    updateCharacterById, 
    deleteCharacterById 
} from "../controllers/character.controller.js";
import { validateIdMiddleware } from "../middlewares/validateId.middleware.js";

const router = Router();

router.get('/', getAllCharacters);
router.get('/:id', validateIdMiddleware, getCharacterById);
router.post('', createCharacter);
router.put('/:id', validateIdMiddleware, updateCharacterById);
router.delete('/:id', validateIdMiddleware, deleteCharacterById);

export default router;