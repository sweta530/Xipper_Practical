const express = require("express");
const {
  getHotels,
  addHotel,
  updateHotel,
  deleteHotel,
  getAllHotelWithRooms,
} = require("../controllers");

const router = express.Router();

router.get("/", getHotels);
router.post("/", addHotel);
router.put("/:id", updateHotel);
router.delete("/:id", deleteHotel);
router.get("/get-all", getAllHotelWithRooms);

module.exports = router;
