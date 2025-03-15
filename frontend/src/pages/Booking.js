import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRooms, bookHotel } from "../services/api";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import moment from "moment";

const Booking = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    []
  );

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomPrice, setRoomPrice] = useState(0);
  const [availableCount, setAvailableCount] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const today = useMemo(() => moment().format("YYYY-MM-DD"), []);

  useEffect(() => {
    let isMounted = true;

    const getRooms = async () => {
      try {
        const response = await fetchRooms(parseInt(hotelId, 10));

        if (isMounted) {
          const responseData = response.data;

          if (responseData.success === 1) {
            const availableRooms = responseData.data.filter(
              (room) => room.available > 0
            );

            setRooms([
              {
                id: "",
                roomType: "Select Room",
                price: 0,
                available: 0,
                totalRooms: 0,
              },
              ...availableRooms,
            ]);
          } else {
            setMessage(responseData.message || "Failed to load rooms");
            setMessageType("error");
          }
        }
      } catch (error) {
        if (isMounted) {
          setMessage("Failed to load rooms. Please try again later.");
          setMessageType("error");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getRooms();

    return () => {
      isMounted = false;
    };
  }, [hotelId]);

  useEffect(() => {
    if (selectedRoom && checkIn && checkOut) {
      const days = moment(checkOut).diff(moment(checkIn), "days");
      setTotalAmount(days > 0 ? days * roomPrice : 0);
    } else {
      setTotalAmount(0);
    }
  }, [selectedRoom, checkIn, checkOut, roomPrice]);

  const handleRoomChange = useCallback(
    (e) => {
      const roomId = e.target.value;
      const selected = rooms.find((room) => room.id === roomId);
      setSelectedRoom(roomId);
      setRoomPrice(selected?.price || 0);
      setAvailableCount(selected?.available || 0);
    },
    [rooms]
  );

  const handleBooking = useCallback(async () => {
    setMessage("");

    if (!selectedRoom || !checkIn || !checkOut || guests < 1) {
      setMessage("Please fill all fields properly.");
      setMessageType("error");
      return;
    }

    const checkInDate = moment(checkIn);
    const checkOutDate = moment(checkOut);

    if (!checkInDate.isValid() || !checkOutDate.isValid()) {
      setMessage("Please select valid dates.");
      setMessageType("error");
      return;
    }

    if (checkOutDate.isSameOrBefore(checkInDate)) {
      setMessage("Check-out date must be after check-in date.");
      setMessageType("error");
      return;
    }

    const selectedRoomData = rooms.find((r) => r.id === selectedRoom);
    if (!selectedRoomData || selectedRoomData.available < 1) {
      setMessage("This room is no longer available.");
      setMessageType("error");
      return;
    }

    const bookingData = {
      userId: parseInt(user.id, 10),
      hotelId: parseInt(hotelId, 10),
      roomId: parseInt(selectedRoom, 10),
      checkIn,
      checkOut,
      guests: parseInt(guests, 10),
    };

    try {
      setLoading(true);
      const response = await bookHotel(bookingData);

      if (response.data && response.data.success === 1) {
        setMessage("Booking successful! Redirecting...");
        setMessageType("success");
        setTimeout(() => navigate("/my-bookings"), 2000);
      } else {
        setMessage(
          (response.data && response.data.message) || "Booking failed."
        );
        setMessageType("error");
      }
    } catch (error) {
      setMessage("An error occurred while booking.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [selectedRoom, checkIn, checkOut, guests, user, hotelId, navigate, rooms]);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Book a Room
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : message && rooms.length <= 1 ? (
        <Alert severity={messageType} sx={{ mb: 3 }}>
          {message}
        </Alert>
      ) : (
        <>
          {/* Room Selection */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Select Room Type
          </Typography>
          <Select
            fullWidth
            value={selectedRoom}
            onChange={handleRoomChange}
            displayEmpty
            sx={{ mb: 2 }}
          >
            {rooms.map((room) => (
              <MenuItem
                key={room.id || "empty"}
                value={room.id}
                disabled={!room.id}
              >
                {room.roomType}
                {room.price > 0 ? ` - $${room.price} per night` : ""}
                {room.available > 0 && room.id
                  ? ` (${room.available} available)`
                  : room.id
                  ? " (Not available)"
                  : ""}
              </MenuItem>
            ))}
          </Select>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Select Dates
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="Check-in Date"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: today }}
            />
            <TextField
              fullWidth
              label="Check-out Date"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: checkIn || today }}
              disabled={!checkIn}
            />
          </Box>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Number of Guests
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={guests}
            onChange={(e) =>
              setGuests(Math.max(1, parseInt(e.target.value) || 1))
            }
            sx={{ mb: 3 }}
            InputProps={{ inputProps: { min: 1 } }}
          />

          {totalAmount > 0 && (
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6">Booking Summary</Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography>Room Type:</Typography>
                <Typography>
                  {rooms.find((r) => r.id === selectedRoom)?.roomType}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography>Duration:</Typography>
                <Typography>
                  {moment(checkOut).diff(moment(checkIn), "days")} night(s)
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography>Price per night:</Typography>
                <Typography>${roomPrice.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography variant="h6">Total Amount:</Typography>
                <Typography variant="h6" color="primary">
                  ${totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleBooking}
            disabled={
              loading ||
              !selectedRoom ||
              !checkIn ||
              !checkOut ||
              availableCount < 1
            }
            sx={{ mb: 2, py: 1.5 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Book Now"
            )}
          </Button>

          {message && (
            <Alert severity={messageType} sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
        </>
      )}
    </Container>
  );
};

export default Booking;
