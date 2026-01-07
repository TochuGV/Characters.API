import prisma from "../config/prisma-client.config.js";

export default class CharacterRepository {
  async getAll({ name, age, weight, movieId, offset, limit }){
    const where = {
      ...(name && { name: { contains: name } }),
      ...(age !== undefined && { age }),
      ...(weight !== undefined && { weight }),
      ...(movieId && { charactersXMovies: { some: { movieId } } })
    };
    const [items, total] = await Promise.all([
      prisma.character.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { id: 'asc' },
        select: {
          id: true,
          image: true,
          name: true 
        }
      }),
      prisma.character.count({ where })
    ]);
    return { items, total };
  };

  async getById(id){
    return await prisma.character.findUnique({
      where: { id },
      include: {
        charactersXMovies: {
          include: {
            movie: true
          }
        }
      }
    });
  };

  async create(data){
    return await prisma.character.create({ data });
  };

  async updateById(id, data){
    return await prisma.character.update({
      where: { id },
      data: data
    });
  };

  async deleteById(id){
    const character = await prisma.character.delete({
      where: { id }
    });
    return !!character;
  };
};