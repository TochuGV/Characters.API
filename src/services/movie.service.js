export default class MovieService {
  constructor(movieRepository){
    this.movieRepository = movieRepository;
  };

  async getAll(title, order, page = 1, limit = 10){
    console.log("This is a function on the service");
    const offset = (page - 1) * limit;
    const { items, total } = await this.movieRepository.getAll(title, order, offset, limit);
    return {
      movies: items,
      total: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total/limit)
    };
  };

  async getById(id){
    console.log("This is a function on the service");
    return await this.movieRepository.getById(id);
  };

  async create(movie){
    console.log("This is a function on the service");
    return await this.movieRepository.create(movie);
  };

  async updateById(id, movie){
    console.log("This is a function on the service");
    return await this.movieRepository.updateById(id, movie);
  };

  async deleteById(id){
    console.log("This is a function on the service");
    return await this.movieRepository.deleteById(id);
  };
};