const express = require("express");
const {
  addRoom,
  getRoomsByHotel,
  deleteRoom,
  updateRoom,
} = require("../controllers");

const router = express.Router();

router.post("/", addRoom);
router.get("/:hotelId", getRoomsByHotel);
router.delete("/:roomId", deleteRoom);
router.put("/:roomId", updateRoom);

module.exports = router;
