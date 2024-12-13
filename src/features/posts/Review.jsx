import React, { useContext, useState, useEffect } from 'react'
import "../shared/styles/posts.css"
import { AuthContext } from '../../context/AuthContext';
import axios from "axios"
import { TextField, Box, Avatar, Button } from '@mui/material';

const Review = ({ post }) => {
  const [newComment, setNewComment] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/${post.userId}`);
        const userData = response.data;
        if (userData.photo) setProfilePic(userData.photo);
        setUsername(userData.displayName)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUser.uid]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();

  };

  return (
    <div className="review-card">
      <div className="review-content">
        <div className = "header">
          <div className="top">
            <Avatar
              sx={{ bgcolor: "#73C2BE", width: 56, height: 56 }}
              alt={username}
              src={profilePic || "/broken-image.jpg"}
            />
            <p className="username">{username}</p>
          </div>

          <p><strong>Location:</strong> {post.location}</p>
          <p><strong>Rating:</strong> {post.rating} / 10</p>
          <p><strong>Date:</strong> {post.date}</p>
        </div>
        <p>{post.caption}</p>
      </div>
      {post.photo && (
        <div className="review-photo">
          <img src={post.photo} alt="Review" />
        </div>
      )}
      <div className="review-actions">
        <button className="like-button" >
          Like {post.likes > 0 && `(${post.likes})`}
        </button>
      </div>
      <div className="comment-section">
        <h3>Comments</h3>
        <ul className="comments-list">
          {post.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  )
}

export default Review