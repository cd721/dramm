import React, { useState, useEffect, useContext } from 'react'
import '../shared/styles/layout.css'
import "../shared/styles/posts.css"
import axios from "axios"
import { AuthContext } from '../../context/AuthContext';
import dayjs from 'dayjs'
import { ReviewContext } from '../../context/ReviewContext';

const API_URL = import.meta.env.VITE_API_URL;

const CreatePostModal = ({ isOpen, onClose, place, placeId, city, state }) => {
    //NEED TO DO PHOTOS ERROR HANDLING?
    const [caption, setCaption] = useState('')
    const [photos, setPhotos] = useState('');
    const [location, setLocation] = useState('');
    const [rating, setRating] = useState("");
    const [formErrors, setFormErrors] = useState('');
    const [date, setDate] = useState('');
    const [photoBase64, setPhotoBase64] = useState("");
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB size limit
    const { currentUser } = useContext(AuthContext);
    const [locationId, setLocationId] = useState("")
    const { triggerRefresh } = useContext(ReviewContext);


    useEffect(() => {
        if (isOpen) {
            setLocation(place);
            setLocationId(placeId);
        }
      }, [isOpen, place]); 

    const validateForm = () => {
        const errors = {};

        if (!caption) {
            errors.caption = 'Caption is required';
        } else if (typeof caption !== 'string' || caption.trim().length < 50 || caption.trim().length > 500) {
            errors.caption = 'Caption must be between 50 and 500 characters';
        }

        if (!location) {
            errors.location = 'Location is required';
        } else if (typeof location !== 'string' || location.trim().length < 5 || location.trim().length > 25) {
            errors.location = 'Location must be between 5 and 25 characters';
        }

        if (!rating) {
            errors.rating = 'Rating is required';
        } else if (isNaN(rating) || rating < 0 || rating > 10) {
            errors.rating = 'Rating must be a number between 0 and 10';
        }

        if (photos && photos.size > MAX_FILE_SIZE) {
            errors.photos = 'File size exceeds 2 MB. Please upload a smaller file.';
        }

        if (!date) {
            errors.date = 'Visited date is required';
        } else {
            const [year, month, day] = date.split('-');
            const formattedDate = `${month}/${day}/${year}`;
            const today = dayjs().format('MM/DD/YYYY');
            if (!dayjs(formattedDate, 'MM/DD/YYYY', true).isValid() || dayjs(formattedDate, 'MM/DD/YYYY', true).isAfter(today, 'day')) {
                errors.date = 'Invalid Date. Must be in MM/DD/YYYY format before today.';
            }
        }

        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return false;
        } else{
            return true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            let compressedBase64 = ""
            if (photos) {
                console.log("hi" + photos)
                compressedBase64 = await compressImage(photos);
                console.log("Compressed Base64 size:", compressedBase64.length);
            }

            const response = await axios.post(`${API_URL}/posts/${currentUser.uid}`, {
                caption,
                location,
                rating,
                date,
                photo: compressedBase64,
                locationId
            });

            await updatePlaceForUser(rating);

            triggerRefresh();
            onClose();
        } catch (error) {
            console.error( error);
            setFormErrors({ form: "Error: Something went wrong while submitting the post" });
            return
        }
        onClose()
    }

    const updatePlaceForUser = async (rating) => {
        try {
            const { data: placesForUser } = await axios.get(
                `${API_URL}/users/${currentUser.uid}/places`
            );

            const existingPlace = placesForUser.find(
                (userPlace) => userPlace.placeId === placeId
            );

            if (existingPlace) {
                await axios.patch(
                    `${API_URL}/users/${currentUser.uid}/places/${placeId}`,
                    {
                        isVisited: true,
                        rating,
                    }
                );
                console.log(`${place} has been updated with a new rating.`);
            } else {
                await axios.patch(
                    `${API_URL}/users/${currentUser.uid}/places/${placeId}`,
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
            setFormErrors({ form: "Error: Something went wrong while updating places" });
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
                {formErrors.form && <p className='form-overall-error'>{formErrors.form}</p>}

                <form onSubmit={handleSubmit} >
                    <div className="formInput">
                        <label htmlFor="caption">Review Caption:<span style={{ color: 'red' }}>*</span></label>
                        <textarea
                            id="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                        {formErrors.caption && <p className='form-error'>{formErrors.caption}</p>}
                        <small>Min: 50 characters, Max: 500 characters ({caption.length}/500)</small>
                    </div>

                    <div className="formInput">
                        <label htmlFor="photos">Photos:</label>
                        <input
                            id="photos"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPhotos(e.target.files[0])}
                        />
                        {formErrors.photos && <p className='form-error'>{formErrors.photos}</p>}
                        <small>Add a picture if you'd like!</small>
                    </div>

                    <div className="formInput">

                        <label htmlFor="date">Visited Date:<span style={{ color: 'red' }}>*</span></label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        {formErrors.date && <p className='form-error'>{formErrors.date}</p>}
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
                            step="0.1"
                        />
                        {formErrors.rating && <p className='form-error'>{formErrors.rating}</p>}
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