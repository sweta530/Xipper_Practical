const { checkinService } = require("../services");
const { successResponse, errorResponse } = require("../utils");
const { validateCheckIn } = require("../validations/checkinValidation");
const {
  STATUS_CREATED,
  STATUS_OK,
  STATUS_INTERNAL_ERROR,
  STATUS_BAD_REQUEST,
} = require("../utils/constants");

exports.performCheckIn = async (req, res) => {
  const { error } = validateCheckIn(req.body);
  if (error)
    return errorResponse(res, error.details[0].message, STATUS_BAD_REQUEST);

  try {
    const checkIn = await checkinService.performCheckIn(req.body);
    successResponse(res, checkIn, "Check-in successful", STATUS_CREATED);
  } catch (error) {
    errorResponse(res, error, "Failed to check-in", STATUS_INTERNAL_ERROR);
  }
};

exports.getCheckIns = async (req, res) => {
  try {
    const checkIns = await checkinService.getCheckInsByBooking(
      Number(req.params.bookingId)
    );
    successResponse(
      res,
      checkIns,
      "Check-ins retrieved successfully",
      STATUS_OK
    );
  } catch (error) {
    errorResponse(
      res,
      error,
      "Failed to retrieve check-ins",
      STATUS_INTERNAL_ERROR
    );
  }
};
