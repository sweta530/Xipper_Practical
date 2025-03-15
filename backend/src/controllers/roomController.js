const { roomService } = require("../services");
const { successResponse, errorResponse } = require("../utils");
const { validateRoom } = require("../validations/roomValidation");
const {
  STATUS_CREATED,
  STATUS_OK,
  STATUS_INTERNAL_ERROR,
  STATUS_BAD_REQUEST,
} = require("../utils/constants");

exports.getRoomsByHotel = async (req, res) => {
  try {
    const rooms = await roomService.getRoomsByHotel(Number(req.params.hotelId));
    successResponse(res, rooms, "Rooms retrieved successfully", STATUS_OK);
  } catch (error) {
    errorResponse(
      res,
      error,
      "Failed to retrieve rooms",
      STATUS_INTERNAL_ERROR
    );
  }
};

exports.addRoom = async (req, res) => {
  const { error } = validateRoom(req.body);
  if (error)
    return errorResponse(res, error.details[0].message, STATUS_BAD_REQUEST);

  try {
    const room = await roomService.addRoom(req.body);
    successResponse(res, room, "Room added successfully", STATUS_CREATED);
  } catch (error) {
    errorResponse(res, error, "Failed to add room", STATUS_INTERNAL_ERROR);
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    await roomService.deleteRoom(Number(req.params.roomId));
    successResponse(res, null, "Room deleted successfully", STATUS_OK);
  } catch (error) {
    errorResponse(res, error, "Failed to delete room", STATUS_INTERNAL_ERROR);
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await roomService.updateRoom(
      Number(req.params.roomId),
      req.body
    );
    successResponse(res, room, "Room updated successfully", STATUS_OK);
  } catch (error) {
    errorResponse(res, error, "Failed to update room", STATUS_INTERNAL_ERROR);
  }
};
