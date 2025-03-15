const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createUser = async (data) => {
  return await prisma.user.create({ data });
};

exports.getUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

exports.getUserById = async (userId) => {
  return await prisma.user.findUnique({ where: { id: userId } });
};

exports.updateUser = async (userId, data) => {
  return await prisma.user.update({ where: { id: userId }, data });
};
