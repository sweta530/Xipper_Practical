const { hotelService } = require("../services");
const { successResponse, errorResponse } = require("../utils");
const { validateHotel } = require("../validations/hotelValidation");
const {
  STATUS_CREATED,
  STATUS_OK,
  STATUS_INTERNAL_ERROR,
  STATUS_BAD_REQUEST,
} = require("../utils/constants");

exports.getHotels = async (req, res) => {
  try {
    const hotels = await hotelService.getHotels();
    successResponse(res, hotels, "Hotels retrieved", STATUS_OK);
  } catch (error) {
    errorResponse(
      res,
      error,
      "Failed to retrieve hotels",
      STATUS_INTERNAL_ERROR
    );
  }
};

exports.addHotel = async (req, res) => {
  const { error } = validateHotel(req.body);
  if (error)
    return errorResponse(res, error.details[0].message, STATUS_BAD_REQUEST);

  try {
    const hotel = await hotelService.addHotel(req.body);
    successResponse(res, hotel, "Hotel added successfully", STATUS_CREATED);
  } catch (error) {
    errorResponse(res, error, "Failed to add hotel", STATUS_INTERNAL_ERROR);
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const hotel = await hotelService.updateHotel(
      Number(req.params.id),
      req.body
    );
    successResponse(res, hotel, "Hotel updated successfully", STATUS_OK);
  } catch (error) {
    errorResponse(res, error, "Failed to update hotel", STATUS_INTERNAL_ERROR);
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    await hotelService.deleteHotel(Number(req.params.id));
    successResponse(res, null, "Hotel deleted successfully", STATUS_OK);
  } catch (error) {
    errorResponse(res, error, "Failed to delete hotel", STATUS_INTERNAL_ERROR);
  }
};

exports.getAllHotelWithRooms = async (req, res) => {
  try {
    const rooms = await hotelService.getAllHotelsWithRoom();
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
