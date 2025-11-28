import { Router } from "express";
import CharacterService from "../services/character.service.js";
import CharacterController from "../controllers/character.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router();
const characterService = new CharacterService();
const characterController = new CharacterController(characterService);

router.get('/', authMiddleware, characterController.getAllCharacters);
router.get('/:id', authMiddleware, characterController.getCharacterById);
router.post('', authMiddleware, characterController.createCharacter);
router.put('/:id', authMiddleware, characterController.updateCharacterById);
router.delete('/:id', authMiddleware, characterController.deleteCharacterById);

export default router;