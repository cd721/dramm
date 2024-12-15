import React, { useState, useEffect, useContext } from 'react'
import '../shared/styles/layout.css'
import "../shared/styles/posts.css"
import axios from "axios"
import { AuthContext } from '../../context/AuthContext';
import dayjs from 'dayjs'
//NEED TO SHARE CONTEXTS FOR AFTER POST SUBMISSION
const CreatePostModal = ({ isOpen, onClose, place, placeId, city, state }) => {
    //NEED TO DO PHOTOS ERROR HANDLING?
    const [caption, setCaption] = useState('')
    const [photos, setPhotos] = useState('');
    const [location, setLocation] = useState('');
    const [rating, setRating] = useState(undefined);
    const [error, setError] = useState('');
    const [date, setDate] = useState('');
    const [photoBase64, setPhotoBase64] = useState("");
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB size limit
    const { currentUser } = useContext(AuthContext);
    const [locationId, setLocationId] = useState("")

    useEffect(() => {
        if (isOpen) {
            setLocation(place);
            setLocationId(placeId);
        }
      }, [isOpen, place]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!caption) {
            setError("Must have a caption")
            return
        }
        if (typeof caption !== 'string') {
            setError("Must have string input for caption")
            return
        }
        setCaption(caption.trim())
        if (!isNaN(caption) || caption.length < 50 || caption.length > 500) {
            setError("Invalid caption length.")
            return
        }
        if (!location) {
            setError("Must have a location")
            return
        }
        if (typeof location !== 'string') {
            setError("Must have string input for location")
            return
        }
        setLocation(location.trim())
        if (!isNaN(location) || location.length < 5 || location.length > 25) {
            console.log(location)
            setError("Invalid location length.")
            return
        }
        if (!rating) {
            setError("Must have a rating")
            return
        }
        if (typeof rating !== 'number') {
            setError("Must have number input for rating")
            return
        }
        if (isNaN(rating) || rating < 0 || rating > 10) {
            setError("Invalid rating.")
            return
        }

        if (photos.size > MAX_FILE_SIZE) {
            setError("File size exceeds 2 MB. Please upload a smaller file.");
            return;
        }

        if (!date) {
            setError("Must have date")
            return
        }
        const [year, month, day] = date.split("-"); 
        const formattedDate = `${month}/${day}/${year}`; 
        const today = dayjs().format("MM/DD/YYYY");
        if (!dayjs(formattedDate, "MM/DD/YYYY", true).isValid() || dayjs(formattedDate, "MM/DD/YYYY", true).isAfter(today, "day")) {
            setError("Invalid Date. Must be in MM/DD/YYYY format before today.");
            return
        }

        try {
            let compressedBase64 = ""
            if (photos) {
                console.log("hi" + photos)
                compressedBase64 = await compressImage(photos);
                console.log("Compressed Base64 size:", compressedBase64.length);
            }


            const response = await axios.post(`http://localhost:3001/posts/${currentUser.uid}`, {
                caption,
                location,
                rating,
                date,
                photo: compressedBase64,
                locationId
            });

            await updatePlaceForUser(rating);

            
        } catch (error) {
            console.error( error);
            setError("Error: something went wrong.");
            return
        }
        onClose()
    }

    const updatePlaceForUser = async (rating) => {
        try {
            const { data: placesForUser } = await axios.get(
                `http://localhost:3001/users/${currentUser.uid}/places`
            );

            const existingPlace = placesForUser.find(
                (userPlace) => userPlace.placeId === placeId
            );

            if (existingPlace) {
                await axios.patch(
                    `http://localhost:3001/users/${currentUser.uid}/places/${placeId}`,
                    {
                        isVisited: true,
                        rating,
                    }
                );
                console.log(`${place} has been updated with a new rating.`);
            } else {
                await axios.patch(
                    `http://localhost:3001/users/${currentUser.uid}/places/${placeId}`,
                    {
                        isVisited: true,
                        isBookmarked: false,
                        name: place || "Unknown Place",
                        image: photos ? photos.name : "No Image",
                        location: location || "Unknown Location",
                        city: city || "Unknown City",
                        state: state || "Unknown State",
                        rating,
                    }
                );
                console.log(`${place} has been added to your visited places.`);
            }
        } catch (error) {
            console.error("Error updating user's places:", error);
            setError("Error: something went wrong while updating places.");
        }
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


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                <h2>Create Review</h2>
                <h3>Create a review to share your thoughts on this location!</h3>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} >
                    <div className="formInput">
                        <label htmlFor="caption">Review Caption:<span style={{ color: 'red' }}>*</span></label>
                        <textarea
                            id="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            required
                        />
                        <small>Min: 50 characters, Max: 500 characters</small>
                    </div>

                    <div className="formInput">
                        <label htmlFor="photos">Photos:</label>
                        <input
                            id="photos"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPhotos(e.target.files[0])}
                        />
                        <small>Add a picture if you'd like!</small>
                    </div>

                    <div className="formInput">

                        <label htmlFor="date">Date:<span style={{ color: 'red' }}>*</span></label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="formInput">

                        <label htmlFor="rating">Rating (out of 10):<span style={{ color: 'red' }}>*</span></label>
                        <input
                            id="rating"
                            type="number"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            min="0"
                            max="10"
                            required
                            step="0.1"
                        />
                    </div>
                    <button type="submit" className="create-post">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreatePostModal