const express = require("express");
const {
  bookHotel,
  getUserBookings,
  cancelBooking,
  checkOut,
} = require("../controllers");

const router = express.Router();

router.post("/", bookHotel);
router.get("/user/:userId", getUserBookings);
router.delete("/:bookingId", cancelBooking);
router.get("/check-out/:bookingId", checkOut);

module.exports = router;
