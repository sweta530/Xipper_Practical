const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getHotels = async () => {
  return await prisma.hotel.findMany();
};

exports.addHotel = async (data) => {
  return await prisma.hotel.create({ data });
};

exports.updateHotel = async (id, data) => {
  return await prisma.hotel.update({ where: { id }, data });
};

exports.deleteHotel = async (id) => {
  return await prisma.hotel.delete({ where: { id } });
};

exports.getAllHotelsWithRoom = async () => {
  return await prisma.hotel.findMany({
    include: {
      rooms: true,
    },
  });
};
