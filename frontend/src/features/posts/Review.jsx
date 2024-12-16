import React, { useContext, useState, useEffect } from 'react'
import "../shared/styles/posts.css"
import { AuthContext } from '../../context/AuthContext';
import axios from "axios"
import { TextField, Box, Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Review = ({ post }) => {
  const [newComment, setNewComment] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("")
  const [comments, setComments] = useState([])
  const navigate = useNavigate();

  const handleNavigateToProfile = () => {
    if (currentUser.uid === post.userId) {
      navigate("/account");
    } else {
      navigate(`/profile/${post.userId}`);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/${post.userId}`);
        const userData = response.data;
        if (userData.photo) setProfilePic(userData.photo);
        setUsername(userData.displayName)
        console.log(response)
        setComments(post.comments)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      
    };
    fetchUserData();
  }, [currentUser.uid]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment) {
      alert("Must have a comment")
      return
    }
    if (typeof newComment !== 'string') {
      alert("comment must be a string")
      return
    }
    setNewComment(newComment.trim())
    if (newComment.length === 0) {
      alert("comment cant be empty")
      return
    }

    if (newComment.length > 50) {
      alert("comment cant be more than 50 chars")
      return
    }

    try {
      const response = await axios.patch(`http://localhost:3001/posts/comments/${currentUser.uid}`, {
        postId: post._id,
        comment: newComment,
        name: currentUser.displayName
      });
      console.log(response.data)

    } catch (e) {
      alert("Error: something went wrong.");
      console.log(e)
      return
    }
    const newCommentData = { name: currentUser.displayName, comment: newComment };
    setComments(prevComments => [...prevComments, newCommentData]);
    setNewComment("")

  };

  return (
    <div className="review-card">
      <div className="review-content">
        <div className="header">
          <div className="top" onClick={handleNavigateToProfile}>
            <Avatar
              sx={{ bgcolor: "#73C2BE", width: 56, height: 56 }}
              alt={username}
              src={profilePic || "/broken-image.jpg"}
            />
            <p className="username">{username || 'user'}</p>
          </div>

          <p><strong>Location:</strong> {post.location}</p>
          <p><strong>Rating:</strong> {post.rating} / 10</p>
          <p><strong>Visited Date:</strong> {post.date}</p>
        </div>
        <p>{post.caption}</p>
      </div>
      {post.photo && (
        <div className="review-photo">
          <img src={post.photo} alt="Review" />
        </div>
      )}
      <div className="review-actions">
      </div>
      <div className="comment-section">
        <h3>Comments</h3>
        <ul className="comments-list">
          {comments.map((comment, index) => (
            <li key={index}>{comment.name}- {comment.comment}</li>
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

export default Review;