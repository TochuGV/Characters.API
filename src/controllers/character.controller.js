import { characterSchema, characterQuerySchema } from "../schemas/character.schema.js";
import { uuidSchema } from "../schemas/uuid.schema.js";
import { tryCatch } from "../utils/try-catch.js";
import errorFactory from "../common/errors/error-factory.js";
import { validateRequest } from "../utils/validate-request.util.js";
import { checkCache, setCache, deleteCache } from "../utils/cache.utils.js";
import logger from "../logger/index.js";

export default class CharacterController {
  constructor(characterService) {
    this.characterService = characterService;
  };
  
  getAllCharacters = tryCatch(async (req, res) => {
    logger.info("This is a get operation");
    validateRequest(characterQuerySchema, req.query);
    const {name, age, weight, movie, page, limit} = req.query;
    const cachedCharacters = checkCache("getAllCharacters", req.query);
    if (cachedCharacters) return res.status(200).json(cachedCharacters);
    const characters = await this.characterService.getAll(name, age, weight, movie, page, limit);
    if (!characters || characters.characters.length === 0) return res.status(200).send("No characters found");
    setCache("getAllCharacters", req.query, characters);
    return res.status(200).json(characters);
  });
  
  getCharacterById = tryCatch(async (req, res) => {
    logger.info(`Request URL Param: ${req.params.id}`);
    logger.info("This is a get operation");
    validateRequest(uuidSchema, req.params);
    const cachedCharacter = checkCache("getCharacterById", req.params);
    if (cachedCharacter) return res.status(200).json(cachedCharacter);
    const character = await this.characterService.getById(req.params.id);
    if (!character) throw errorFactory.createError("NOT_FOUND", "Character not found");
    setCache("getCharacterById", req.params, character);
    return res.status(200).json(character);
  });
  
  createCharacter = tryCatch(async (req, res) => {
    logger.info("This is a post operation");
    validateRequest(characterSchema, req.body);
    const character = await this.characterService.create(req.body);
    if (!character) throw errorFactory.createError("INTERNAL_SERVER", "Failed to create character");
    deleteCache('getAllCharacters', {});
    return res.status(201).send("Character created succesfully");
  });
  
  updateCharacterById = tryCatch(async (req, res) => {
    logger.info(`Request URL Param: ${req.params.id}`);
    logger.info("This is a put operation");
    validateRequest(uuidSchema, req.params);
    validateRequest(characterSchema, req.body);
    const character = await this.characterService.updateById(req.params.id, req.body);
    if (!character) throw errorFactory.createError("NOT_FOUND", "Character not found");
    deleteCache('getAllCharacters', {});
    deleteCache('getCharacterById', req.params);
    return res.status(200).send("Character updated succesfully");
  });
  
  deleteCharacterById = tryCatch(async (req, res) => {
    logger.info(`Request URL Param: ${req.params.id}`);
    logger.info("This is a delete operation");
    validateRequest(uuidSchema, req.params);
    const character = await this.characterService.deleteById(req.params.id);
    if (!character) throw errorFactory.createError("NOT_FOUND", "Character not found");
    deleteCache('getAllCharacters', {});
    return res.status(204).send();
  });
}