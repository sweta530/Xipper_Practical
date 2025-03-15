const { bookingService } = require("../services");
const { successResponse, errorResponse } = require("../utils");
const { validateBooking } = require("../validations/bookingValidation");
const {
  STATUS_CREATED,
  STATUS_OK,
  STATUS_INTERNAL_ERROR,
  STATUS_BAD_REQUEST,
} = require("../utils/constants");

exports.bookHotel = async (req, res) => {
  const { error } = validateBooking(req.body);
  if (error) return errorResponse(res, error.details[0].message, 400);

  try {
    const booking = await bookingService.createBooking(req.body);
    successResponse(res, booking, "Booking confirmed", 201);
  } catch (error) {
    errorResponse(res, error, "Error creating booking", 500);
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookings(
      Number(req.params.userId)
    );
    successResponse(res, bookings, "User bookings retrieved", STATUS_OK);
  } catch (error) {
    errorResponse(res, error, "Failed to get bookings", STATUS_INTERNAL_ERROR);
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    await bookingService.cancelBooking(Number(req.params.bookingId));
    successResponse(res, null, "Booking canceled successfully", STATUS_OK);
  } catch (error) {
    errorResponse(
      res,
      error,
      "Failed to cancel booking",
      STATUS_INTERNAL_ERROR
    );
  }
};

exports.checkOut = async (req, res) => {
  try {
    const result = await bookingService.checkOut(Number(req.params.bookingId));
    successResponse(res, result, "Check-out successful", STATUS_OK);
  } catch (error) {
    errorResponse(res, error, "Failed to check out", STATUS_INTERNAL_ERROR);
  }
};
