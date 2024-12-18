import React, { useContext, useState, useEffect } from 'react'
import "../shared/styles/posts.css"
import { AuthContext } from '../../context/AuthContext';
import axios from "axios"
import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RatingStars } from './RatingStars';

const Review = ({ post }) => {
  const [newComment, setNewComment] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("")
  const [comments, setComments] = useState([])
  const [commentAuthors, setCommentAuthors] = useState({});
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
        setProfilePic(userData.photo || "");
        setUsername(userData.displayName || "user");
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUsername("Unknown User");
      }
    };

    fetchUserData();
  }, [post]);

  useEffect(() => {
    setComments([]);
    setCommentAuthors({});
    
    const fetchCommentAuthors = async () => {
      const authorData = {};
      await Promise.all(
        post.comments.map(async (comment) => {
          if (!authorData[comment.userId]) {
            try {
              const response = await axios.get(`http://localhost:3001/users/${comment.userId}`);
              const userData = response.data;
              authorData[comment.userId] = userData.displayName;
            } catch (error) {
              console.error("Error fetching comment author data:", error);
              authorData[comment.userId] = "Unknown User";
            }
          }
        })
      );

      setCommentAuthors(authorData);
      setComments(post.comments);
    };

    fetchCommentAuthors();
  }, [post]);


  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment) {
      alert("Must have a comment");
      return;
    }

    if (typeof newComment !== "string") {
      alert("Comment must be a string");
      return;
    }

    const trimmedComment = newComment.trim();

    if (trimmedComment.length === 0) {
      alert("Comment can't be empty");
      return;
    }

    if (trimmedComment.length > 50) {
      alert("Comment can't be more than 50 chars");
      return;
    }
    try {
      const response = await axios.patch(`http://localhost:3001/posts/comments/${currentUser.uid}`, {
        postId: post._id,
        comment: trimmedComment,
        name: currentUser.displayName,
      });
      const newCommentData = { userId: currentUser.uid, comment: trimmedComment };
      setComments((prevComments) => [...prevComments, newCommentData]);
      setCommentAuthors((prevAuthors) => ({
        ...prevAuthors,
        [currentUser.uid]: currentUser.displayName,
      }));

      setNewComment("");
    } catch (e) {
      alert("Error: something went wrong.");
      console.log(e);
    }
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
          <div className="other-details">
            <p><strong>Location:</strong> <a href={`/place/${post.locationId}`}>{post.location}</a></p>
            
            <p><strong>Visited Date:</strong> {post.date}</p>

            <div className='review'>
              <RatingStars rating={post.rating} maxStars={10} />
              <p><strong>Rating:</strong> {post.rating} / 10</p>
            </div>
          </div>
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
            <li key={index}>
              <strong>{commentAuthors[comment.userId] || "Loading..."}</strong>: {comment.comment}
            </li>
          ))}
        </ul>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-input"
          />
          <button type="submit" className="submit-button">Post</button>
        </form>
      </div>

    </div>
  )
}

export default Review;