import logger from "../logger/index.js";

export default class MovieService {
  constructor(movieRepository){
    this.movieRepository = movieRepository;
  };

  async getAll(queryParams){
    logger.info("This is a function on the service");
    const { page, limit, ...filters } = queryParams;
    const offset = (page - 1) * limit;
    const { items, total } = await this.movieRepository.getAll({ ...filters, offset, limit });
    return {
      items,
      total,
      currentPage: page,
      totalPages: Math.ceil(total/limit)
    };
  };

  async getById(id){
    logger.info("This is a function on the service");
    const result = await this.movieRepository.getById(id);
    if (!result) return null;
    const { charactersXMovies, ...movieInfo } = result;
    return {
      ...movieInfo,
      characters: charactersXMovies.map(relation => relation.character)
    };
  };

  async create(data){
    logger.info("This is a function on the service");
    return await this.movieRepository.create(data);
  };

  async updateById(id, data){
    logger.info("This is a function on the service");
    return await this.movieRepository.updateById(id, data);
  };

  async deleteById(id){
    logger.info("This is a function on the service");
    return await this.movieRepository.deleteById(id);
  };
};