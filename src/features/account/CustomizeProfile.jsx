import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { TextField, Box, Avatar, Button } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { updateProfile } from "firebase/auth";
import "../shared/styles/profile.css";
import zipcodes from "zipcodes";

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

    const validateDisplayName = (name) => {
        const trimmedName = name.trim();
        const validCharacters = /^[a-zA-Z0-9 ]+$/;
        return trimmedName.length <= 20 && validCharacters.test(trimmedName);
    };

    const validateZipCode = (zip) => {
        return zipcodes.lookup(zip) !== undefined;
    };

    const validateBio = (bioText) => {
        const trimmedBio = bioText.trim();
        const validCharacters = /^[a-zA-Z0-9.,!?' ]+$/;
        return trimmedBio.length <= 250 && validCharacters.test(trimmedBio);
    };

    const compressImage = (file, maxWidth = 800, quality = 0.8) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    const scaleFactor = maxWidth / img.width;
                    canvas.width = maxWidth;
                    canvas.height = img.height * scaleFactor;

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
                    resolve(compressedBase64);
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleImageUpload = async (file) => {
        if (!file) return;

        console.log("File size in bytes:", file.size);

        if (file.size > MAX_FILE_SIZE) {
            alert("File size exceeds 2 MB. Please upload a smaller file.");
            return;
        }

        try {
            const compressedBase64 = await compressImage(file);
            console.log("Compressed Base64 size:", compressedBase64.length);

            const response = await axios.patch(`http://localhost:3001/users/${currentUser.uid}/photo`, {
                photo: compressedBase64,
            });

            if (response.data.success) {
                alert("Profile photo updated successfully!");
                setPhotoBase64(compressedBase64);
            }
        } catch (error) {
            console.error("Error updating photo:", error);
            alert("Failed to update photo.");
        }
    };

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
            if (!validateDisplayName(displayName)) {
                alert("Invalid display name. Must be at most 20 characters, no special characters.");
                return;
            }

            if (!validateZipCode(zipCode)) {
                alert("Invalid ZIP code.");
                return;
            }

            if (!validateBio(bio)) {
                alert("Invalid bio. Must be at most 250 characters, no special characters.");
                return;
            }

            if (displayName !== currentUser.displayName) {
                await updateProfile(currentUser, { displayName });
                console.log("Updated display name in Firebase");
            }

            const updatedData = {
                displayName: displayName.trim(),
                zipCode: zipCode.trim(),
                bio: bio.trim(),
            };

            const response = await axios.patch(
                `http://localhost:3001/users/${currentUser.uid}/details`,
                updatedData
            );

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
                            onChange={(e) => handleImageUpload(e.target.files[0])}
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