import React, { useEffect, useState, useCallback } from "react";
import { fetchHotels } from "../services/api";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Alert,
  Box,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HotelIcon from "@mui/icons-material/Hotel";

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getHotels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchHotels();

      if (response?.data?.success === 1) {
        const processedHotels = response.data?.data.map((hotel) => {
          const availableRooms = hotel.rooms.reduce(
            (total, room) => total + room.available,
            0
          );

          return {
            ...hotel,
            availableRooms: availableRooms,
          };
        });

        const sortedHotels = [...processedHotels].sort(
          (a, b) => b.availableRooms - a.availableRooms
        );

        setHotels(sortedHotels);
      } else {
        setError(response.data.message || "Failed to load hotels");
      }
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setError("Failed to load hotels. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getHotels();
  }, [getHotels]);

  const handleViewRooms = useCallback(
    (hotelId) => {
      navigate(`/booking/${hotelId}`);
    },
    [navigate]
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Available Hotels
        </Typography>

        {!loading && !error && (
          <Button color="primary" onClick={getHotels} variant="outlined">
            Refresh
          </Button>
        )}
      </Box>

      {error ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={getHotels}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      ) : loading ? (
        <CircularProgress />
      ) : hotels.length === 0 ? (
        <Alert severity="info">No hotels are currently available</Alert>
      ) : (
        <Grid container spacing={3}>
          {hotels.map((hotel) => (
            <Grid item xs={12} md={6} key={hotel.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {hotel.name}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOnIcon
                      fontSize="small"
                      color="action"
                      sx={{ mr: 0.5 }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      {hotel.location}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <HotelIcon
                      fontSize="small"
                      color="primary"
                      sx={{ mr: 0.5 }}
                    />
                    <Typography variant="body1">
                      Available Rooms:
                      <Chip
                        label={hotel.availableRooms}
                        size="small"
                        color={hotel.availableRooms > 0 ? "success" : "error"}
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Box>

                  {/* Room types section */}
                  <Box sx={{ mt: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Room Types:
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      {hotel.rooms.map((room) => (
                        <Chip
                          key={room.id}
                          size="small"
                          label={`${room.roomType} (${room.available}/${room.totalRooms})`}
                          color={room.available > 0 ? "primary" : "default"}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleViewRooms(hotel.id)}
                    disabled={hotel.availableRooms === 0}
                  >
                    {hotel.availableRooms > 0
                      ? "View Rooms"
                      : "No Rooms Available"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Hotels;
