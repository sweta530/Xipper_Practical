const express = require("express");
const app = express();

const authRoutes = require("./authRoutes");
const bookingRoutes = require("./bookingRoutes");
const checkinRoutes = require("./checkinRoutes");
const hotelRoutes = require("./hotelRoutes");
const roomsRoutes = require("./roomRoutes");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/checkin", checkinRoutes);
app.use("/api/v1/hotels", hotelRoutes);
app.use("/api/v1/rooms", roomsRoutes);

module.exports = app;
