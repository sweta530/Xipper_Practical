import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import ProtectedRoute from "../src/components/ProtectedRoutes";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import Hotels from "../src/pages/Hotels";
import Booking from "../src/pages/Booking";
import CheckIn from "../src/pages/CheckIn";
import MyBookings from "./pages/MyBookings";

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Hotels />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/:hotelId"
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking"
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkin"
        element={
          <ProtectedRoute>
            <CheckIn />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;
