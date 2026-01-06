import prisma from "../config/prisma-client.config.js"

export default class UserRepository {
  async getByEmail(email){
    return await prisma.user.findFirst({
      where: { email }
    });
  };

  async create(email, password){
    const user = await prisma.user.create({
      data: { email, password }
    });
    return !!user;
  };
};