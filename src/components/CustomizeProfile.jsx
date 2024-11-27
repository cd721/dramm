import './App.css';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TextField, Box, Avatar, Button } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import axios from 'axios';

function CustomizeProfile() {
    const { currentUser } = useContext(AuthContext);
    const [displayName, setDisplayName] = useState(currentUser.displayName || "");
    const [zipCode, setZipCode] = useState("07030");
    const [bio, setBio] = useState("");
    const [photoBase64, setPhotoBase64] = useState("");
    const [uploading, setUploading] = useState(false);

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

            const response = await axios.post(`http://localhost:3001/users/${currentUser.uid}/photo`, {
                photo: photoBase64,
            });

            if (response.data.success) {
                alert("Profile photo updated successfully!");
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
                    disabled={uploading || !photoBase64}
                >
                    Update
                </Button>
            </Box>
        </div>
    );
}

export default CustomizeProfile;