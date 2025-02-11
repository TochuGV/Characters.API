import { Router } from "express";
import { 
    getAllCharacters, 
    getCharacterById, 
    createCharacter, 
    updateCharacterById, 
    deleteCharacterById 
} from "../controllers/character.controller.js";

const router = Router();

router.get('/', getAllCharacters);
router.get('/:id', getCharacterById);
router.post('', createCharacter);
router.put('/:id', updateCharacterById);
router.delete('/:id', deleteCharacterById);

export default router;