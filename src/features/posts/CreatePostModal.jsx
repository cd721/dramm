import React, { useState } from 'react'
import '../shared/styles/layout.css'
import "../shared/styles/posts.css"

const CreatePostModal = ({ isOpen, onClose }) => {

    const [caption, setCaption] = useState('')
    const [photos, setPhotos] = useState([]);
    const [location, setLocation] = useState('');
    const [rating, setRating] = useState(0);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onClose()
    }
    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            setError('You can upload a maximum of 5 photos.');
            return;
        }
        setPhotos(files);
        setError('');
    };


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                <h2>Create Post</h2>
                <h3>Create a post sharing your outdoor adventures and reccomendations!</h3>
                {error && <p className = "error">{error}</p>}
                <form onSubmit={handleSubmit} >
                    <div className = "formInput">
                        <label htmlFor="caption">Caption:<span style={{ color: 'red' }}>*</span></label>
                        <textarea
                            id="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            required
                        />
                        <small>Min: 50 characters, Max: 2000 characters</small>
                    </div>

                    <div className = "formInput">
                        <label htmlFor="photos">Photos:</label>
                        <input
                            id="photos"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoChange}
                        />
                        <small>Add some pictures if you'd like! You can post up to 5 pictures.</small>
                    </div>

                    <div className = "formInput">

                        <label htmlFor="location">Location:<span style={{ color: 'red' }}>*</span></label>
                        <input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>

                    <div className = "formInput"> 

                        <label htmlFor="rating">Rating (out of 10):<span style={{ color: 'red' }}>*</span></label>
                        <input
                            id="rating"
                            type="number"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            min="0"
                            max="10"
                            required
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