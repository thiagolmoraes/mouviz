const prisma = require('../prismaClient');

class User {

  static async findByEmail(email) {
    return await prisma.user.findUnique({ where: { email } });
  }

  static async create(data) {
    return await prisma.user.create({ data });
  }
}

module.exports = User;
