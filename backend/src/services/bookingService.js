const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createBooking = async (data) => {
  const room = await prisma.room.findUnique({
    where: { id: data.roomId },
  });

  if (!room || room.available <= 0) {
    throw new Error("No available rooms of this type");
  }

  await prisma.room.update({
    where: { id: data.roomId },
    data: { available: { decrement: 1 } },
  });

  return await prisma.booking.create({
    data: {
      userId: data.userId,
      hotelId: data.hotelId,
      roomId: data.roomId,
      checkIn: new Date(`${data.checkIn}T00:00:00.000Z`),
      checkOut: new Date(`${data.checkOut}T00:00:00.000Z`),
      guests: data.guests,
      status: "upcoming",
    },
  });
};

exports.getUserBookings = async (userId) => {
  return await prisma.booking.findMany({
    where: { userId },
    include: {
      hotel: true,
      room: true,
    },
  });
};

exports.cancelBooking = async (bookingId) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error("Booking not found");

  await prisma.room.update({
    where: { id: booking.roomId },
    data: { available: { increment: 1 } },
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "cancelled" },
  });

  return { message: "Booking canceled successfully" };
};

exports.checkOut = async (bookingId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.status !== "checked-in") {
    throw new Error("Only checked-in guests can check out");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "checked-out" },
  });

  await prisma.room.update({
    where: { id: booking.roomId },
    data: { available: { increment: 1 } },
  });

  return { message: "Check-out successful" };
};
