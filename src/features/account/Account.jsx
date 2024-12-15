import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Avatar, Button, Box, ThemeProvider, createTheme, ToggleButton, ToggleButtonGroup, Grid, Link, Rating } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import CssBaseline from "@mui/material/CssBaseline";
import zipcodes from 'zipcodes';
import DisplayReviews from '../posts/DisplayReviews';
import { useTitle } from '../shared/hooks/commonHooks';

const lightTheme = createTheme({
    palette: {
        mode: "light",
        background: {
            paper: "#ffffff",
            default: "#f5f5f5",
        },
        text: {
            primary: "#000000",
        },
    },
});

function Account() {
  useTitle('My Account');

  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({
        displayName: "",
        zipCode: "",
        bio: "",
        photo: "",
  });
  const [location, setLocation] = useState("");
  const [selectedView, setSelectedView] = useState("bookmarked");
  const [places, setPlaces] = useState([]);

  useEffect(() => {
      const fetchUserData = async (uid) => {
          try {
              const response = await fetch(`http://localhost:3001/users/${uid}`);
              if (!response.ok) {
                  throw new Error(`Failed to fetch user data: ${response.statusText}`);
              }
              const data = await response.json();
              setUserData({
                  displayName: data.displayName || "",
                  zipCode: data.zipCode || "",
                  bio: data.bio || "",
                  photo: data.photo || "",
              });
            
            if (data.zipCode) {
                const locationInfo = zipcodes.lookup(data.zipCode);
                if (locationInfo) {
                    setLocation(`${locationInfo.city}, ${locationInfo.state}`);
                } else {
                    setLocation("Unknown location");
                }
            }
          } catch (error) {
              console.error("Error fetching user data:", error);
          }
      };

      fetchUserData(currentUser.uid);
  }, [currentUser.uid]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const endpoint =
          selectedView === "bookmarked"
            ? `http://localhost:3001/users/${currentUser.uid}/places?type=bookmarked`
            : `http://localhost:3001/users/${currentUser.uid}/places?type=visited`;

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${selectedView} places: ${response.statusText}`);
        }

        const data = await response.json();
        setPlaces(data);
      } catch (error) {
        console.error("Error fetching places:", error);
        setPlaces([]);
      }
    };

    fetchPlaces();
  }, [selectedView, currentUser.uid]);

  const handleToggleChange = (event, newView) => {
    if (newView !== null) {
      setSelectedView(newView);
    }
  };

  const handleCustomizeProfile = () => {
    navigate('/customize-profile');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            minHeight: "100vh",
            backgroundColor: "#f5f5f5",
            padding: "2em",
            textAlign: "center",
          }}
        >
          <Card
            sx={{
              width: "500px",
              padding: "2em",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              marginBottom: "2em",
            }}
          >
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Avatar
                sx={{ width: 100, height: 100, bgcolor: "#1976d2", marginBottom: "1em" }}
                src={userData.photo || "/broken-image.jpg"}
                alt={userData.displayName || "User"}
              >
                {userData.displayName?.[0]?.toUpperCase() || "U"}
              </Avatar>

              <Typography variant="h5" gutterBottom>
                {userData.displayName || "User"}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {"Based in " + location || "No location available"}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {userData.bio || "No bio available"}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: "1em", marginTop: "1em" }}>
                <Button variant="contained" color="primary" fullWidth onClick={handleCustomizeProfile}>
                  Customize Your Profile
                </Button>
                <Button variant="outlined" color="secondary" fullWidth onClick={handleChangePassword}>
                  Change Password
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card
            sx={{
              width: "500px",
              padding: "2em",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
            }}
          >
            <CardContent>
              <Typography gutterBottom variant="h6">
                {selectedView === "bookmarked" ? "Bookmarked Places" : "Visited Places"}
              </Typography>

              <ToggleButtonGroup
                value={selectedView}
                exclusive
                onChange={handleToggleChange}
                sx={{ marginBottom: "1em" }}
              >
                <ToggleButton value="bookmarked">Bookmarked</ToggleButton>
                <ToggleButton value="visited">Visited</ToggleButton>
              </ToggleButtonGroup>

              {places.length > 0 ? (
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="stretch"
                sx={{ margin: "0 auto", maxWidth: "100%" }}
              >
                  {places.map((place) => (
                    <Grid item xs={24} sm={12} md={8} key={place.placeId}>
                      <Card
                        sx={{
                          height: "auto",
                          borderRadius: "8px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {place.name || "Unknown Place"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {place.city || "Unknown City"}, {place.state || "Unknown State"}
                          </Typography>
                          {place.rating && (
                            <Rating name="half-rating-read" value={place.rating} precision={0.1} readOnly />
                          )}
                        </CardContent>
                        <CardContent>
                          <Button
                            variant="outlined"
                            color="primary"
                            sx={{ marginTop: "0.5em" }}
                            onClick={() => navigate(`/place/${place.placeId}`)}
                            fullWidth
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography>No places found.</Typography>
              )}
            </CardContent>
          </Card>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginTop: "2em",
          marginBottom: "2em",
        }}
      >
        <Card
          sx={{
            width: "800px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            padding: "1em",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", marginBottom: "1em" }}
            >
              Past Reviews
            </Typography>
            <DisplayReviews type="user" uniqueId={userData.id} />
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default Account;
