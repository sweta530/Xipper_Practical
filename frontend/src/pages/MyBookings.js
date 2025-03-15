import React, { useEffect, useState, useCallback, useMemo } from "react";
import { fetchMyBookings, cancelBooking } from "../services/api";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Chip,
  Grid,
} from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    []
  );
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const loadBookings = useCallback(async () => {
    if (!user.id) {
      setError("User information not found. Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchMyBookings(user.id);

      if (response.data.success) {
        const sortedBookings = [...response.data.data].sort(
          (a, b) => moment(b.checkIn).valueOf() - moment(a.checkIn).valueOf()
        );
        setBookings(sortedBookings);
      } else {
        setError(response.data.message || "Failed to load bookings");
      }
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError("Failed to load bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const openCancelDialog = useCallback((bookingId) => {
    setSelectedBookingId(bookingId);
    setCancelDialogOpen(true);
  }, []);

  const handleCancelBooking = useCallback(async () => {
    if (!selectedBookingId) return;

    try {
      setCancelDialogOpen(false);
      setLoading(true);

      const response = await cancelBooking(selectedBookingId);

      if (response.data.success) {
        setMessage("Booking canceled successfully!");
        setMessageType("success");
        await loadBookings();
      } else {
        setMessage(response.data.message || "Failed to cancel booking.");
        setMessageType("error");
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setMessage("Failed to cancel booking. Please try again later.");
      setMessageType("error");
    } finally {
      setLoading(false);
      setSelectedBookingId(null);
    }
  }, [selectedBookingId, loadBookings]);

  const goToWebCheckIn = useCallback(
    (bookingId) => {
      navigate(`/web-check-in/${bookingId}`);
    },
    [navigate]
  );

  const isBookingPast = useCallback((checkOut) => {
    return moment().isAfter(moment(checkOut));
  }, []);

  const isWebCheckInAvailable = useCallback((booking) => {
    // Check-in is available if:
    //  Booking is not checked-in, checked-out, or cancelled
    //  Current date is within 24 hours before check-in date
    const checkInDate = moment(booking.checkIn);
    const now = moment();
    const isWithin24Hours =
      now.isBefore(checkInDate) &&
      now.isAfter(checkInDate.clone().subtract(24, "hours"));

    return (
      isWithin24Hours &&
      booking.status !== "checked-in" &&
      booking.status !== "checked-out" &&
      booking.status !== "cancelled"
    );
  }, []);

  const canCancelBooking = useCallback(
    (booking) => {
      return (
        !isBookingPast(booking.checkOut) &&
        booking.status !== "checked-in" &&
        booking.status !== "checked-out" &&
        booking.status !== "cancelled"
      );
    },
    [isBookingPast]
  );

  const getStatusChipColor = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case "upcoming":
        return "primary";
      case "checked-in":
        return "success";
      case "checked-out":
        return "info";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  }, []);

  const renderBookingCard = useCallback(
    (booking) => {
      const checkInDate = moment(booking.checkIn);
      const checkOutDate = moment(booking.checkOut);
      const days = checkOutDate.diff(checkInDate, "days");
      const totalAmount = days * booking.room.price;
      const isPast = isBookingPast(booking.checkOut);

      return (
        <Card key={booking.id} sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="h6" sx={{ mr: 1 }}>
                    {booking.hotel.name}
                  </Typography>
                </Box>

                <Typography variant="body1" color="primary">
                  {booking.room.roomType} - ${booking.room.price} per night
                </Typography>

                <Box sx={{ mt: 1, mb: 1 }}>
                  <Typography variant="body2">
                    <strong>Check-in:</strong>{" "}
                    {checkInDate.format("MMM DD, YYYY")} (
                    {checkInDate.format("dddd")})
                  </Typography>
                  <Typography variant="body2">
                    <strong>Check-out:</strong>{" "}
                    {checkOutDate.format("MMM DD, YYYY")} (
                    {checkOutDate.format("dddd")})
                  </Typography>
                  <Typography variant="body2">
                    <strong>Duration:</strong> {days}{" "}
                    {days === 1 ? "night" : "nights"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Guests:</strong> {booking.guests}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Status:</strong>{" "}
                    <Chip
                      size="small"
                      label={booking.status || "Pending"}
                      color={getStatusChipColor(booking.status)}
                    />
                  </Typography>
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ textAlign: { xs: "left", sm: "right" } }}
                >
                  ${totalAmount.toFixed(2)}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 1,
                    justifyContent: { xs: "flex-start", sm: "flex-end" },
                    mt: { xs: 2, sm: 0 },
                  }}
                >
                  {isWebCheckInAvailable(booking) && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => goToWebCheckIn(booking.id)}
                      disabled={loading}
                    >
                      Go to Web Check-In
                    </Button>
                  )}

                  {canCancelBooking(booking) && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => openCancelDialog(booking.id)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      );
    },
    [
      loading,
      openCancelDialog,
      isBookingPast,
      isWebCheckInAvailable,
      canCancelBooking,
      getStatusChipColor,
      goToWebCheckIn,
    ]
  );

  const { upcomingBookings, pastBookings } = useMemo(() => {
    const upcoming = [];
    const past = [];

    bookings.forEach((booking) => {
      if (isBookingPast(booking.checkOut)) {
        past.push(booking);
      } else {
        upcoming.push(booking);
      }
    });

    return { upcomingBookings: upcoming, pastBookings: past };
  }, [bookings, isBookingPast]);

  const handleCloseMessage = () => {
    setMessage("");
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 3 }}>
        My Bookings
      </Typography>

      {loading && bookings.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : bookings.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          You don't have any bookings yet.
        </Alert>
      ) : (
        <>
          {upcomingBookings.length > 0 && (
            <>
              <Typography variant="h5" sx={{ mb: 2, mt: 3 }}>
                Upcoming Bookings
              </Typography>
              {upcomingBookings.map(renderBookingCard)}
            </>
          )}

          {pastBookings.length > 0 && (
            <>
              <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
                Past Bookings
              </Typography>
              {pastBookings.map(renderBookingCard)}
            </>
          )}
        </>
      )}

      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this booking? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} color="primary">
            No, Keep Booking
          </Button>
          <Button
            onClick={handleCancelBooking}
            color="error"
            variant="contained"
          >
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseMessage}
          severity={messageType}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MyBookings;
