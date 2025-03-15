import axios from "axios";

const API = axios.create({
  baseURL: process.env.BASE_URL || "http://localhost:4000/api/v1",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getUserProfile = (id) => API.get(`/auth/profile/${id}`);
export const updateUserProfile = (id, data) =>
  API.put(`/auth/profile/${id}`, data);

export const fetchHotels = () => API.get("/hotels/get-all");
export const addHotel = (data) => API.post("/hotels", data);
export const updateHotel = (id, data) => API.put(`/hotels/${id}`, data);
export const deleteHotel = (id) => API.delete(`/hotels/${id}`);

export const fetchRooms = (hotelId) =>
  API.get(`/rooms/${parseInt(hotelId, 10)}`);
export const addRoom = (data) => API.post("/rooms", data);
export const deleteRoom = (roomId) =>
  API.delete(`/rooms/${parseInt(roomId, 10)}`);

export const bookHotel = (data) => API.post("/bookings", data);
export const fetchMyBookings = (userId) =>
  API.get(`/bookings/user/${parseInt(userId, 10)}`);
export const cancelBooking = (bookingId) =>
  API.delete(`/bookings/${parseInt(bookingId, 10)}`);
export const checkOut = (bookingId) =>
  API.get(`/bookings/${parseInt(bookingId, 10)}`);

export const checkIn = (data) => API.post("/checkin", data);
export const fetchCheckIns = (bookingId) =>
  API.get(`/checkin/booking/${parseInt(bookingId, 10)}`);
