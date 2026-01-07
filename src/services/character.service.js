import logger from "../logger/index.js";

export default class CharacterService {
  constructor(characterRepository) {
    this.characterRepository = characterRepository;
  };

  async getAll(queryParams){
    logger.info("This is a function on the service");
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
    logger.info("This is a function on the service");
    const result = await this.characterRepository.getById(id);
    if (!result) return null;
    const { charactersXMovies, ...rest } = result;
    return {
      ...rest,
      movies: charactersXMovies.map(relation => relation.movie)
    };
  };

  async create(data){
    logger.info("This is a function on the service");
    return await this.characterRepository.create(data);
  };

  async updateById(id, data){
    logger.info("This is a function on the service");
    return await this.characterRepository.updateById(id, data);
  };

  async deleteById(id){
    logger.info("This is a function on the service");
    return await this.characterRepository.deleteById(id);
  };
};