import { validateCharacter, validateCharacterQuery } from "../schemas/character.schema.js";
import characterService from "../services/character.service.js"
import { tryCatch } from "../utils/try-catch.js";
import { BadRequestError, NotFoundError, ValidationError } from "../utils/errors.js";

export const getAllCharacters = tryCatch(async (req, res) => {
    console.log("This is a get operation");
    const validation = validateCharacterQuery(req.query);
    if(!validation.success) throw new BadRequestError(validation.error.format())
    const {name, age, weight, movies} = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const characters = await characterService.getAllCharacters(name, age, weight, movies, page, limit);
    if(!characters || characters.characters.length === 0) return res.status(200).send("Characters not found");
    return res.status(200).json(characters);
});

export const getCharacterById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a get operation");
    const character = await characterService.getCharacterById(req.params.id);
    if(!character) throw new NotFoundError("Character not found");
    return res.status(200).json(character);
});

export const createCharacter = tryCatch(async (req, res) => {
    console.log("This is a post operation");
    const validation = validateCharacter(req.body);
    if(!validation.success) throw new ValidationError(JSON.parse(validation.error.message));
    const result = await characterService.createCharacter(req.body);
    if(result.rowsAffected[0] > 0) return res.status(201).send("Character created succesfully");
        return res.status(400).send("Bad request"); //Hay que manejar bien los errores porque es imposible que llegue acá
});

export const updateCharacterById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a put operation");
    const validation = validateCharacter(req.body);
    if(!validation.success) throw new ValidationError(JSON.parse(validation.error.message));
    const result = await characterService.updateCharacterById(req.params.id, req.body);
    if(!(result.rowsAffected[0] > 0)) throw new NotFoundError("Character not found");
    return res.status(200).send("Character updated succesfully");
});

export const deleteCharacterById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a delete operation");
    const result = await characterService.deleteCharacterById(req.params.id);
    if(!(result.rowsAffected[0] > 0)) throw new NotFoundError("Character not found");
    return res.status(204).send();
});