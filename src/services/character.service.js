export default class CharacterService {
  constructor(characterRepository) {
    this.characterRepository = characterRepository;
  };

  async getAll(name, age, weight, movie, page = 1, limit = 10){
    console.log("This is a function on the service");
    const offset = (page - 1) * limit;
    const { items, total } = await this.characterRepository.getAll(name, age, weight, movie, offset, limit);
    return {
      characters: items,
      total: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total/limit)
    };
  };

  async getById(id){
    console.log("This is a function on the service");
    return await this.characterRepository.getById(id);
  };

  async create(character){
    console.log("This is a function on the service");
    return await this.characterRepository.create(character);
  };

  async updateById(id, character){
    console.log("This is a function on the service");
    return await this.characterRepository.updateById(id, character);
  };

  async deleteById(id){
    console.log("This is a function on the service");
    return await this.characterRepository.deleteById(id);
  };
};