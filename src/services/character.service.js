import logger from "../logger/index.js";

export default class CharacterService {
  constructor(characterRepository) {
    this.characterRepository = characterRepository;
  };

  async getAll(queryParams){
    logger.debug("Service: Retrieving all characters from database");
    const { page, limit, ...filters } = queryParams;
    const offset = (page - 1) * limit;
    const { items, total } = await this.characterRepository.getAll({ ...filters, offset, limit });
    return {
      items,
      total,
      currentPage: page,
      totalPages: Math.ceil(total/limit)
    };
  };

  async getById(id){
    logger.debug(`Service: Fetching character by unique ID: ${id}`);
    const result = await this.characterRepository.getById(id);
    if (!result) return null;
    const { charactersXMovies, ...rest } = result;
    return {
      ...rest,
      movies: charactersXMovies.map(relation => relation.movie)
    };
  };

  async create(data){
    logger.debug("Service: Persisting new character record in database");
    return await this.characterRepository.create(data);
  };

  async updateById(id, data){
    logger.debug(`Service: Updating character record with ID: ${id}`);
    return await this.characterRepository.updateById(id, data);
  };

  async deleteById(id){
    logger.debug(`Service: Deleting character record with ID: ${id}`);
    return await this.characterRepository.deleteById(id);
  };
};