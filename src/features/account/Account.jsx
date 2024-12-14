import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Avatar, Button, Box, ThemeProvider, createTheme } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import CssBaseline from "@mui/material/CssBaseline";
import zipcodes from 'zipcodes';

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
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({
        displayName: "",
        zipCode: "",
        bio: "",
        photo: "",
  });
  const [location, setLocation] = useState("");

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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <Card
          sx={{
            width: '1000px',
            padding: '2em',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            marginTop: '2em',
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
                      <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={handleCustomizeProfile}
                      >
                          Customize Your Profile
                      </Button>
                      <Button
                          variant="outlined"
                          color="secondary"
                          fullWidth
                          onClick={handleChangePassword}
                      >
                          Change Password
                      </Button>
                  </Box>
              </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default Account;
