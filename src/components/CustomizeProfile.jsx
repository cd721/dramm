import './App.css';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TextField, Box, Avatar, Button } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { updateProfile } from 'firebase/auth';
import axios from 'axios';

function CustomizeProfile() {
    const { currentUser } = useContext(AuthContext);
    const [displayName, setDisplayName] = useState(currentUser.displayName || "");
    const [zipCode, setZipCode] = useState("07030");
    const [bio, setBio] = useState("");
    const [photoBase64, setPhotoBase64] = useState("");
    const [uploading, setUploading] = useState(false);

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

    const handleImageUpload = (file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoBase64(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpdate = async () => {
        try {
            setUploading(true);

            if (currentUser.displayName !== displayName) {
                await updateProfile(currentUser, { displayName });
                alert("Display name updated successfully in Firebase!");
            }

            const updatedData = {};
            if (zipCode) updatedData.zipCode = zipCode;
            if (bio) updatedData.bio = bio;
            if (photoBase64) updatedData.photo = photoBase64;

            const response = await axios.patch(`http://localhost:3001/users/${currentUser.uid}`, updatedData);

            if (response.data.success) {
                alert("Profile updated successfully in MongoDB!");
            } else {
                alert("Profile update failed in MongoDB!");
            }

            setUploading(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
            setUploading(false);
        }
    };

    return (
        <div>
            <div>
                <Avatar
                    sx={{ bgcolor: "#73C2BE", width: 56, height: 56 }}
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
                        onChange={(e) => handleImageUpload(e.target.files[0])}
                    />
                </Button>
            </div>
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '20ch' } }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    label="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                />
                <TextField
                    label="Zip Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                />
                <TextField
                    label="Bio"
                    multiline
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
                <Button
                    variant="outlined"
                    onClick={handleUpdate}
                    disabled={uploading}
                >
                    Update
                </Button>
            </Box>
        </div>
    );
}

export default CustomizeProfile;