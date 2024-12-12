import React, { useState } from 'react'
import '../shared/styles/layout.css'
import "../shared/styles/posts.css"

const CreatePostModal = ({ isOpen, onClose }) => {
    //NEED TO DO PHOTOS ERROR HANDLING?
    const [caption, setCaption] = useState('')
    const [photos, setPhotos] = useState('');
    const [location, setLocation] = useState('');
    const [rating, setRating] = useState(null);
    const [error, setError] = useState('');
    const [date, setDate] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!caption){
            setError("Must have a caption")
            return
        } 
        if (typeof caption !== 'string'){
            setError("Must have string input for caption")
            return
        } 
        setCaption(caption.trim())
        if ( !isNaN(caption) || caption.length < 50 || caption.length > 500){
            setError("Invalid caption length.")
            return
        }

        if (!location){
            setError("Must have a location")
            return
        } 
        if (typeof location !== 'string'){
            setError("Must have string input for location")
            return
        } 
        setLocation(location.trim())
        if ( !isNaN(location) || location.length < 5 || location.length > 25){
            console.log(location)
            setError("Invalid location length.")
            return
        }

        if (!rating){
            setError("Must have a rating")
            return
        } 
        if (typeof rating !== 'number'){
            setError("Must have number input for rating")
            return
        } 
        if ( isNaN(rating) || rating < 0 || rating > 10){
            setError("Invalid rating.")
            return
        }
        



        onClose()
    }
 

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                <h2>Create Post</h2>
                <h3>Create a post sharing your outdoor adventures and reccomendations!</h3>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} >
                    <div className="formInput">
                        <label htmlFor="caption">Caption:<span style={{ color: 'red' }}>*</span></label>
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

                        <label htmlFor="location">Location:<span style={{ color: 'red' }}>*</span></label>
                        <input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
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
                            step = "0.1"
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