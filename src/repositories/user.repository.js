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

  async createUserSession(data) {
    return await prisma.userSession.create({ data });
  };

  async findUserSessionById(id) {
    return await prisma.userSession.findUnique({
      where: { id },
      include: { user: true }
    });
  };

  async updateUserSession(id, data) {
    return await prisma.userSession.update({
      where: { id },
      data
    });
  };

  async revokeAllUserSessions(userId) {
    return await prisma.userSession.updateMany({
      where: { userId },
      data: { revoked: true }
    });
  };

  async deleteExpiredSessions(userId) {
    return await prisma.userSession.deleteMany({
      where: {
        userId,
        expiresAt: { lt: new Date() }
      }
    });
  };
};