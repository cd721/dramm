import React, { useState, useEffect } from 'react'
import axios from "axios"
import Review from './Review.jsx'

const DisplayReviews = () => {
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/posts");
        setReviews(response.data);
      } catch (err) {
        setError("Error fetching posts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div>
      <h2>Your Feed</h2>
      {reviews.length === 0 ? (
        <h3>No reviews to view yet!</h3> 
      ) : (
        <ul>
          {reviews.map((post) => (
            <Review post = {post}/>
          ))}
        </ul>
      )}

    </div>
  )
}

export default DisplayReviews