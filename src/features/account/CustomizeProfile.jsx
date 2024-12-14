import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { TextField, Box, Avatar, Button } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { updateProfile } from "firebase/auth";
import "../shared/styles/profile.css";

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

function CustomizeProfile() {
    const { currentUser } = useContext(AuthContext);
    const [displayName, setDisplayName] = useState(currentUser.displayName || "");
    const [zipCode, setZipCode] = useState("07030");
    const [bio, setBio] = useState("");
    const [photoBase64, setPhotoBase64] = useState("");
    const [uploading, setUploading] = useState(false);

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB size limit

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/users/${currentUser.uid}`);
                const userData = response.data;

                if (userData.zipCode) setZipCode(userData.zipCode);
                if (userData.bio) setBio(userData.bio);
                if (userData.photo) setPhotoBase64(userData.photo);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [currentUser.uid]);

    const handleTextUpdate = async () => {
        try {
            if (displayName !== currentUser.displayName) {
                await updateProfile(currentUser, { displayName });
                console.log("Updated display name in Firebase");
            }

            const updatedData = { displayName, zipCode, bio };
            const response = await axios.patch(`http://localhost:3001/users/${currentUser.uid}/details`, updatedData);
            if (response.data.success) {
                alert("Details updated successfully!");
            }
        } catch (error) {
            console.error("Error updating details:", error);
            alert("Failed to update details.");
        }
    };

    return (
        <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <div className="customize-page">
                <div className="profile-picture-container">
                    <Avatar
                        sx={{ bgcolor: "#73C2BE", width: 70, height: 70, marginTop: 2 }}
                        alt={displayName}
                        src={photoBase64 || "/broken-image.jpg"}
                    />
                    <Button
                        variant="outlined"
                        startIcon={<FileUploadOutlinedIcon />}
                        component="label"
                    >
                        {uploading ? "Uploading..." : "Upload Profile Picture"}
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            id="file-input"
                        />
                    </Button>
                </div>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '20ch' },
                        bgcolor: 'background.paper',
                        p: 2,
                        borderRadius: 2,
                        boxShadow: 1,
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        label="Display Name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Zip Code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Bio"
                        multiline
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        onClick={handleTextUpdate}
                        disabled={uploading}
                    >
                        Update
                    </Button>
                </Box>
            </div>
        </ThemeProvider>
    );
}

export default CustomizeProfile;