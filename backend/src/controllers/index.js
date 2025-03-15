const authController = require("./authController");
const bookingController = require("./bookingController");
const hotelController = require("./hotelController");
const roomController = require("./roomController");
const checkinController = require("./checkinController");

module.exports = {
  ...authController,
  ...bookingController,
  ...hotelController,
  ...roomController,
  ...checkinController,
};
