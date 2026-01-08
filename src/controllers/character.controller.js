import { characterSchema, characterQuerySchema } from "../schemas/character.schema.js";
import { uuidSchema } from "../schemas/uuid.schema.js";
import tryCatch from "../utils/try-catch.js";
import errorFactory from "../errors/error-factory.js";
import validateRequest from "../utils/validate-request.util.js";
import { checkCache, setCache, deleteCache } from "../utils/cache.utils.js";
import logger from "../logger/index.js";

export default class CharacterController {
  constructor(characterService) {
    this.characterService = characterService;
  };
  
  getAllCharacters = tryCatch(async (req, res) => {
    logger.info("[GET] /characters - Fetching all characters");
    const queryData = validateRequest(characterQuerySchema, req.query);
    const cachedResult = checkCache("getAllCharacters", queryData);
    if (cachedResult) return res.status(200).json(cachedResult);
    const result = await this.characterService.getAll(queryData);
    if (!result || result.items.length === 0) return res.status(200).json([]);
    setCache("getAllCharacters", queryData, result);
    return res.status(200).json(result);
  });
  
  getCharacterById = tryCatch(async (req, res) => {
    logger.info(`[GET] /characters/:id - Fetching character details for ID: ${req.params.id}`);
    const params = validateRequest(uuidSchema, req.params);
    const cachedResult = checkCache("getCharacterById", params);
    if (cachedResult) return res.status(200).json(cachedResult);
    const result = await this.characterService.getById(params.id);
    if (!result) throw errorFactory.createError("NOT_FOUND", "Character not found");
    setCache("getCharacterById", params, result);
    return res.status(200).json(result);
  });
  
  createCharacter = tryCatch(async (req, res) => {
    logger.info(`[POST] /characters - Creating new character: "${req.body.name}"`);
    const data = validateRequest(characterSchema, req.body);
    const result = await this.characterService.create(data);
    if (!result) throw errorFactory.createError("INTERNAL_SERVER", "Failed to create character");
    deleteCache('getAllCharacters', {});
    return res.status(201).json(result);
  });
  
  updateCharacterById = tryCatch(async (req, res) => {
    logger.info(`[PUT] /characters/:id - Updating character with ID: ${req.params.id}`);
    const params = validateRequest(uuidSchema, req.params);
    const data = validateRequest(characterSchema, req.body);
    const result = await this.characterService.updateById(params.id, data);
    if (!result) throw errorFactory.createError("NOT_FOUND", "Character not found");
    deleteCache('getAllCharacters', {});
    deleteCache('getCharacterById', params);
    return res.status(200).json(result);
  });
  
  deleteCharacterById = tryCatch(async (req, res) => {
    logger.info(`[DELETE] /characters/:id - Deleting character with ID: ${req.params.id}`);
    const params = validateRequest(uuidSchema, req.params);
    const result = await this.characterService.deleteById(params.id);
    if (!result) throw errorFactory.createError("NOT_FOUND", "Character not found");
    deleteCache('getAllCharacters', {});
    deleteCache('getCharacterById', params);
    return res.status(204).send();
  });
};