import prisma from "../config/prisma-client.config.js";

export default class MovieRepository {
  async getAll({ title, order, offset, limit }){
    const where = {
      ...(title && { title: { contains: title } })
    };
    const orderBy = { creationDate: order === 'DESC' ? 'desc' : 'asc' };
    const [items, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy,
        select: {
          id: true,
          image: true,
          title: true,
          creationDate: true
        }
      }),
      prisma.movie.count({ where })
    ]);
    return { items, total };
  };

  async getById(id){
    return await prisma.movie.findUnique({
      where: { id },
      include: {
        charactersXMovies: {
          include: {
            character: true
          }
        }
      }
    });
  };

  async create(data){
    return await prisma.movie.create({ data });
  };

  async updateById(id, data){
    return await prisma.movie.update({
      where: { id },
      data: data
    });
  };

  async deleteById(id){
    const movie = await prisma.movie.delete({
      where: { id }
    });
    return !!movie;
  };

  async addCharacter(movieId, characterId){
    return await prisma.charactersXMovies.create({
      data: {
        movieId: movieId,
        characterId: characterId
      },
      include: {
        movie: true,
        character: true
      }
    });
  };

  async removeCharacter(movieId, characterId){
    return await prisma.charactersXMovies.delete({
      where: {
        characterId_movieId: {
          characterId: characterId,
          movieId: movieId
        }
      }
    });
  };
};