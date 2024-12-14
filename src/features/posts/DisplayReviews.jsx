import React, { useState, useEffect } from 'react'
import axios from "axios"
import Review from './Review.jsx'

const DisplayReviews = ({ unique }) => {
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [placeId, setPlaceId] = useState("")

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (unique === undefined) {
          console.log("hi")
          const response = await axios.get("http://localhost:3001/posts");
          setReviews(response.data);
        }
        else {
          //posts/byLocation/:id
          setPlaceId(unique)
          console.log(placeId)
          const response = await axios.get(`http://localhost:3001/posts/byLocation/${unique}`);
          if (response.data){
            setReviews(response.data);
          }
          console.log(response)
        }
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

      {reviews.length === 0 ? (
        placeId.length === 0 ? (
          <h3 style={{ color: 'black' }}>No reviews to view yet!</h3>
        ) : (
          <h3 style={{ color: 'white' }}>No reviews to view yet!</h3>
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