import React, { useEffect, useState, useCallback, useMemo } from "react";
import { fetchMyBookings, checkIn } from "../services/api";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Box,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Divider,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
} from "@mui/material";
import moment from "moment";
import { CheckCircleOutlineOutlined } from "@mui/icons-material";

const CheckIn = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ text: "", severity: "info" });
  const [form, setForm] = useState({
    bookingId: "",
    aadhaarNumber: "",
  });

  const statusConfig = {
    upcoming: { icon: "✅", label: "Upcoming", color: "#4caf50" },
    "checked-in": { icon: "🏨", label: "Checked-In", color: "#2196f3" },
    "checked-out": { icon: "🚪", label: "Checked-Out", color: "#ff9800" },
    cancelled: { icon: "❌", label: "Cancelled", color: "#f44336" },
  };

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch (e) {
      console.error("Error parsing user data:", e);
      return {};
    }
  }, []);

  const fetchEligibleBookings = useCallback(async () => {
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
        const today = moment().startOf("day");
        const tomorrow = moment().add(1, "days").startOf("day");

        const processedBookings = response.data.data.map((booking) => {
          const checkInDate = moment(booking.checkIn).startOf("day");
          const isEligibleForCheckIn =
            (checkInDate.isSame(today) || checkInDate.isSame(tomorrow)) &&
            booking.status === "upcoming";

          return {
            ...booking,
            isEligibleForCheckIn,
          };
        });

        setBookings(processedBookings);
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
    fetchEligibleBookings();
  }, [fetchEligibleBookings]);

  const handleBookingSelect = useCallback(
    (bookingId) => {
      const selectedBooking = bookings.find((b) => b.id === bookingId);

      if (selectedBooking && selectedBooking.isEligibleForCheckIn) {
        setForm({
          bookingId,
          aadhaarNumber: "",
        });

        setActiveStep(1);
      } else {
        setMessage({
          text: "This booking is not eligible for check-in at this time.",
          severity: "warning",
        });
      }
    },
    [bookings]
  );

  const handleAadhaarChange = useCallback((value) => {
    const sanitizedValue = value.replace(/\D/g, "").slice(0, 12);

    setForm((prevForm) => ({
      ...prevForm,
      aadhaarNumber: sanitizedValue,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (form.aadhaarNumber.length !== 12) {
        setMessage({
          text: "Please enter a valid 12-digit Aadhaar number",
          severity: "error",
        });
        return;
      }

      setSubmitting(true);

      try {
        const payload = {
          bookingId: form.bookingId,
          aadhaar: form.aadhaarNumber,
        };

        const response = await checkIn(payload);

        if (response.data.success) {
          setBookings((prevBookings) =>
            prevBookings.map((booking) =>
              booking.id === form.bookingId
                ? {
                    ...booking,
                    status: "checked-in",
                    isEligibleForCheckIn: false,
                  }
                : booking
            )
          );

          setMessage({
            text: "Check-in successful! You're all set for your stay.",
            severity: "success",
          });
          setActiveStep(2);
        } else {
          setMessage({
            text: response.data.message || "Check-in failed. Please try again.",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Check-in error:", error);
        setMessage({
          text: "Check-in failed. Please try again or contact support.",
          severity: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [form]
  );

  const handleCloseMessage = useCallback(() => {
    setMessage({ text: "", severity: "info" });
  }, []);

  const handleReset = useCallback(() => {
    setActiveStep(0);
    setForm({ bookingId: "", aadhaarNumber: "" });
    fetchEligibleBookings();
  }, [fetchEligibleBookings]);

  const selectedBooking = useMemo(() => {
    return bookings.find((b) => b.id === form.bookingId);
  }, [bookings, form.bookingId]);

  const steps = ["Select Booking", "Enter Guest Details", "Confirmation"];

  const eligibleBookings = useMemo(
    () => bookings.filter((booking) => booking.isEligibleForCheckIn),
    [bookings]
  );

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Web Check-In
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={fetchEligibleBookings}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        ) : (
          <Paper elevation={3} sx={{ p: 3 }}>
            {activeStep === 0 && (
              <>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{ mb: 2 }}
                >
                  <Tab label="Eligible for Check-In" />
                  <Tab label="All Bookings" />
                </Tabs>

                {activeTab === 0 ? (
                  eligibleBookings.length === 0 ? (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      No bookings available for check-in. Only upcoming bookings
                      with check-in date today or tomorrow are eligible.
                    </Alert>
                  ) : (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Select a booking to check-in:
                      </Typography>
                      <Grid container spacing={2}>
                        {eligibleBookings.map((booking) => (
                          <Grid item xs={12} key={booking.id}>
                            <Card
                              variant="outlined"
                              sx={{
                                cursor: "pointer",
                                transition: "all 0.2s",
                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow: 2,
                                },
                                borderLeft: `4px solid ${
                                  statusConfig[booking.status]?.color || "#ccc"
                                }`,
                              }}
                              onClick={() => handleBookingSelect(booking.id)}
                            >
                              <CardContent>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography variant="h6">
                                    {booking.hotel.name}
                                  </Typography>
                                  <Chip
                                    label={`${
                                      statusConfig[booking.status]?.icon || ""
                                    } ${
                                      statusConfig[booking.status]?.label ||
                                      booking.status
                                    }`}
                                    size="small"
                                    sx={{
                                      backgroundColor:
                                        statusConfig[booking.status]?.color ||
                                        "#ccc",
                                      color: "white",
                                    }}
                                  />
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mt: 1,
                                  }}
                                >
                                  <Typography variant="body1">
                                    Room: {booking.room.roomType}
                                  </Typography>
                                  <Typography variant="body1">
                                    Guests: {booking.guests}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mt: 1,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Check-in:{" "}
                                    {moment(booking.checkIn).format(
                                      "MMM DD, YYYY"
                                    )}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Check-out:{" "}
                                    {moment(booking.checkOut).format(
                                      "MMM DD, YYYY"
                                    )}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )
                ) : bookings.length === 0 ? (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    You don't have any bookings.
                  </Alert>
                ) : (
                  <>
                    <Typography variant="h6" gutterBottom>
                      All your bookings:
                    </Typography>
                    <Grid container spacing={2}>
                      {bookings.map((booking) => (
                        <Grid item xs={12} key={booking.id}>
                          <Card
                            variant="outlined"
                            sx={{
                              cursor: booking.isEligibleForCheckIn
                                ? "pointer"
                                : "default",
                              transition: "all 0.2s",
                              "&:hover": booking.isEligibleForCheckIn
                                ? {
                                    transform: "translateY(-2px)",
                                    boxShadow: 2,
                                  }
                                : {},
                              borderLeft: `4px solid ${
                                statusConfig[booking.status]?.color || "#ccc"
                              }`,
                              opacity: booking.isEligibleForCheckIn ? 1 : 0.8,
                            }}
                            onClick={() =>
                              booking.isEligibleForCheckIn &&
                              handleBookingSelect(booking.id)
                            }
                          >
                            <CardContent>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="h6">
                                  {booking.hotel.name}
                                </Typography>
                                <Chip
                                  label={`${
                                    statusConfig[booking.status]?.icon || ""
                                  } ${
                                    statusConfig[booking.status]?.label ||
                                    booking.status
                                  }`}
                                  size="small"
                                  sx={{
                                    backgroundColor:
                                      statusConfig[booking.status]?.color ||
                                      "#ccc",
                                    color: "white",
                                  }}
                                />
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mt: 1,
                                }}
                              >
                                <Typography variant="body1">
                                  Room: {booking.room.roomType}
                                </Typography>
                                <Typography variant="body1">
                                  Guests: {booking.guests}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mt: 1,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Check-in:{" "}
                                  {moment(booking.checkIn).format(
                                    "MMM DD, YYYY"
                                  )}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Check-out:{" "}
                                  {moment(booking.checkOut).format(
                                    "MMM DD, YYYY"
                                  )}
                                </Typography>
                              </Box>
                              {booking.isEligibleForCheckIn && (
                                <Box sx={{ mt: 2 }}>
                                  <Chip
                                    label="Eligible for check-in"
                                    color="success"
                                    size="small"
                                    variant="outlined"
                                  />
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </>
            )}

            {activeStep === 1 && selectedBooking && (
              <form onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>
                  Enter guest details for {selectedBooking.hotel.name}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Check-in:{" "}
                    {moment(selectedBooking.checkIn).format("MMM DD, YYYY")} |
                    Room: {selectedBooking.room.roomType} | Guests:{" "}
                    {selectedBooking.guests}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Please enter your Aadhaar number:
                </Typography>

                <TextField
                  label="Aadhaar Number"
                  fullWidth
                  margin="normal"
                  value={form.aadhaarNumber}
                  onChange={(e) => handleAadhaarChange(e.target.value)}
                  required
                  inputProps={{
                    maxLength: 12,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  helperText="Enter 12-digit Aadhaar number without spaces"
                  error={
                    form.aadhaarNumber.length > 0 &&
                    form.aadhaarNumber.length !== 12
                  }
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 3,
                  }}
                >
                  <Button variant="outlined" onClick={() => setActiveStep(0)}>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting || form.aadhaarNumber.length !== 12}
                  >
                    {submitting ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Complete Check-In"
                    )}
                  </Button>
                </Box>
              </form>
            )}

            {activeStep === 2 && (
              <Box sx={{ textAlign: "center", py: 2 }}>
                <CheckCircleOutlineOutlined
                  color="success"
                  sx={{ fontSize: 60, mb: 2 }}
                />
                <Typography variant="h5" gutterBottom>
                  Check-In Successful!
                </Typography>
                <Typography variant="body1" paragraph>
                  Your room is ready. Please show your confirmation at the
                  reception desk.
                </Typography>
                <Button variant="contained" onClick={handleReset}>
                  Check-In Another Booking
                </Button>
              </Box>
            )}
          </Paper>
        )}
      </Box>

      <Snackbar
        open={!!message.text}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseMessage} severity={message.severity}>
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CheckIn;
