const express = require("express");
const { performCheckIn, getCheckIns } = require("../controllers");

const router = express.Router();

router.post("/", performCheckIn);
router.get("/booking/:bookingId", getCheckIns);

module.exports = router;
