import prisma from "../config/prisma-client.config.js"

export default class UserRepository {
  async getByEmail(email){
    return await prisma.user.findFirst({
      where: { email }
    }); // Cambiar a 'findUnique' y convertir en @unique el campo 'email'.
  };

  async create(data){
    return await prisma.user.create({ data });
  };
};