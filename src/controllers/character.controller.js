import { characterSchema, characterQuerySchema } from "../schemas/character.schema.js";
import { uuidSchema } from "../schemas/uuid.schema.js";
import tryCatch from "../utils/try-catch.js";
import successResponse from "../utils/response.util.js";
import ErrorFactory from "../errors/error-factory.js";
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
    const cachedResult = await checkCache("getAllCharacters", queryData);
    if (cachedResult) return successResponse(res, cachedResult);
    const result = await this.characterService.getAll(queryData);
    await setCache("getAllCharacters", queryData, result);
    return successResponse(res, result);
  });
  
  getCharacterById = tryCatch(async (req, res) => {
    logger.info(`[GET] /characters/:id - Fetching character details for ID: ${req.params.id}`);
    const params = validateRequest(uuidSchema, req.params);
    const cachedResult = await checkCache("getCharacterById", params);
    if (cachedResult) return successResponse(res, cachedResult);
    const result = await this.characterService.getById(params.id);
    if (!result) throw ErrorFactory.notFound("Character not found");
    await setCache("getCharacterById", params, result);
    return successResponse(res, result);
  });
  
  createCharacter = tryCatch(async (req, res) => {
    logger.info(`[POST] /characters - Creating new character: "${req.body.name}"`);
    const data = validateRequest(characterSchema, req.body);
    const result = await this.characterService.create(data);
    await deleteCache('getAllCharacters', {});
    return successResponse(res, result, 201);
  });
  
  updateCharacterById = tryCatch(async (req, res) => {
    logger.info(`[PUT] /characters/:id - Updating character with ID: ${req.params.id}`);
    const params = validateRequest(uuidSchema, req.params);
    const data = validateRequest(characterSchema, req.body);
    const result = await this.characterService.updateById(params.id, data);
    await deleteCache('getAllCharacters', {});
    await deleteCache('getCharacterById', params);
    return successResponse(res, result);
  });
  
  deleteCharacterById = tryCatch(async (req, res) => {
    logger.info(`[DELETE] /characters/:id - Deleting character with ID: ${req.params.id}`);
    const params = validateRequest(uuidSchema, req.params);
    await this.characterService.deleteById(params.id);
    await deleteCache('getAllCharacters', {});
    await deleteCache('getCharacterById', params);
    return successResponse(res, null, 204);
  });
};