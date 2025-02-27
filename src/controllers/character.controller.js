import { characterSchema, characterQuerySchema } from "../schemas/character.schema.js";
import { uuidSchema } from "../schemas/uuid.schema.js";
import characterService from "../services/character.service.js"
import { tryCatch } from "../utils/try-catch.js";
import { ErrorFactory } from "../common/errors/error-factory.js";
import { validateRequest } from "../utils/validate-request.util.js";
import { checkCache, setCache, deleteCache } from "../utils/cache.utils.js";

export const getAllCharacters = tryCatch(async (req, res) => {
    console.log("This is a get operation");
    validateRequest(characterQuerySchema, req.query);
    const {name, age, weight, movies, page, limit} = req.query;
    const cachedCharacters = checkCache("getAllCharacters", req.query);
    if(cachedCharacters) return res.status(200).json(cachedCharacters);
    const characters = await characterService.getAllCharacters(name, age, weight, movies, page, limit);
    if(!characters || characters.characters.length === 0) return res.status(200).send("Characters not found");
    setCache("getAllCharacters", req.query, characters);
    return res.status(200).json(characters);
});

export const getCharacterById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a get operation");
    validateRequest(uuidSchema, req.params);
    const cachedCharacter = checkCache("getCharacterById", req.params);
    if(cachedCharacter) return res.status(200).json(cachedCharacter);
    const character = await characterService.getCharacterById(req.params.id);
    if(!character) throw ErrorFactory.createError("NOT_FOUND", "Character not found");
    setCache("getCharacterById", req.params, character);
    return res.status(200).json(character);
});

export const createCharacter = tryCatch(async (req, res) => {
    console.log("This is a post operation");
    validateRequest(characterSchema, req.body);
    const result = await characterService.createCharacter(req.body);
    if(!result) throw ErrorFactory.createError("INTERNAL_SERVER", "Failed to create character");
    deleteCache('getAllCharacters', {});
    return res.status(201).send("Character created succesfully");
});

export const updateCharacterById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a put operation");
    validateRequest(uuidSchema, req.params);
    validateRequest(characterSchema, req.body);
    const result = await characterService.updateCharacterById(req.params.id, req.body);
    if(!result) throw ErrorFactory.createError("NOT_FOUND", "Character not found");
    deleteCache('getAllCharacters', {});
    deleteCache('getCharacterById', req.params);
    return res.status(200).send("Character updated succesfully");
});

export const deleteCharacterById = tryCatch(async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a delete operation");
    validateRequest(uuidSchema, req.params);
    const result = await characterService.deleteCharacterById(req.params.id);
    if(!result) throw ErrorFactory.createError("NOT_FOUND", "Character not found");
    deleteCache('getAllCharacters', {});
    return res.status(204).send();
});