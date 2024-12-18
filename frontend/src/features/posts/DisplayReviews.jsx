import React, { useState, useEffect, useContext } from 'react'
import axios from "axios"
import Review from './Review.jsx'
import { ReviewContext } from '../../context/ReviewContext.jsx'

const API_URL = import.meta.env.VITE_API_URL;

const DisplayReviews = ({ type, uniqueId }) => {
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [placeId, setPlaceId] = useState("")
  const { refreshKey } = useContext(ReviewContext);

  const fetchPosts = async () => {
    try {
      if (uniqueId === undefined) {
        console.log("hi")
        const response = await axios.get(`${API_URL}/posts`);
        setReviews(response.data);
      }
      else if (type === "place") {
        //posts/byLocation/:id
        setPlaceId(uniqueId)
        console.log(placeId)
        const response = await axios.get(`${API_URL}/posts/byLocation/${uniqueId}`);
        if (response.data){
          setReviews(response.data);
        }
        console.log(response)
      } else if (type === "user") {
        const response = await axios.get(`${API_URL}/posts/byUser/${uniqueId}`);
        if (response.data){
          setReviews(response.data);
        }
      }
    } catch (err) {
      setError("Error fetching reviews");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshKey, uniqueId]);

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div>
      {reviews.length === 0 ? (
        placeId.length === 0 ? (
          <h3 style={{ color: 'white' }}>No reviews to view yet!</h3>
        ) : (
          <h3 style={{ color: 'black' }}>No reviews to view yet!</h3>
        )
      ) : (
        <ul>
          {reviews
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((post) => (
              <Review key={post.id} post={post} />
            ))}
        </ul>
      )}


    </div>
  )
}

export default DisplayReviews