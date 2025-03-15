const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:userId", getUserProfile);
router.put("/profile/:userId", updateUserProfile);

module.exports = router;
