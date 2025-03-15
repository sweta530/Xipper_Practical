const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getRoomsByHotel = async (hotelId) => {
  return await prisma.room.findMany({ where: { hotelId } });
};

exports.addRoom = async (data) => {
  const { hotelId, roomType, price, totalRooms } = data;

  const room = await prisma.room.create({
    data: {
      hotelId,
      roomType,
      price,
      totalRooms,
      available: totalRooms,
    },
  });

  return room;
};

exports.deleteRoom = async (roomId) => {
  return await prisma.room.delete({ where: { id: roomId } });
};

exports.updateRoom = async (roomId, data) => {
  return await prisma.room.update({ where: { id: roomId }, data });
};
