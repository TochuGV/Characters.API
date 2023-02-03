import { Router } from "express";
import characterService from "../services/characterService.js"
import { authMiddleware } from "../common/jwt.strategy.js";

const router = Router();

router.post('', authMiddleware, async (req, res) => {
    console.log("This is a post operation");
    const character = await characterService.createCharacter(req.body)
    return res.status(200).json(character)
})

router.put('', authMiddleware, async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a put operation");
    const character = await characterService.updateCharacterById(req.params.id, req.body)
    return res.status(200).json(character)
})

router.delete('', authMiddleware, async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a delete operation");
    const character = await characterService.deleteCharacterById(req.params.id)
    return res.status(200).json(character)
})

export default router;

