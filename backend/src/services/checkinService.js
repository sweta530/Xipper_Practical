const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.performCheckIn = async (data) => {
  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId },
  });

  if (!booking) throw new Error("Booking not found");

  if (booking.status === "checked-in") {
    throw new Error("Check-in already completed for this booking");
  }
  if (booking.status === "checked-out") {
    throw new Error("Cannot check-in after check-out");
  }
  if (booking.status === "cancelled") {
    throw new Error("Cannot check-in for a cancelled booking");
  }

  await prisma.checkIn.create({
    data: {
      bookingId: data.bookingId,
      aadhaar: data.aadhaar,
    },
  });

  await prisma.booking.update({
    where: { id: data.bookingId },
    data: { status: "checked-in" },
  });

  return { message: "Check-in successful" };
};

exports.getCheckInsByBooking = async (bookingId) => {
  return await prisma.checkIn.findMany({ where: { bookingId } });
};
