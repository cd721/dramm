import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import '../shared/styles/layout.css'
import CreatePostModal from '../posts/CreatePostModal.jsx';
import DisplayReviews from '../posts/DisplayReviews.jsx';
import CurrentUserWeather from '../weather/CurrentUserWeather.jsx';
import axios from "axios"

function Home() {
  const { currentUser } = useContext(AuthContext);
  const [zipCode, setZipCode] = useState("");

  console.log(currentUser);

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/users/${currentUser.uid}`);
            const userData = response.data;
            if (userData.zipCode) setZipCode(userData.zipCode);
          
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    fetchUserData();
}, [currentUser.uid]);

  return (
    <div className='home'>
      <h2>
        Welcome {currentUser && currentUser.displayName}!
      </h2>
      {zipCode ? <CurrentUserWeather zipCode = {zipCode}/>
        : <p>Your account is not attached to a zipcode yet, head to your profile to update this information to view the current weather in your area!.</p>}
      {/* <button
        className="create-post"
        onClick={() => {
          setIsModalVisible(true)
        }}>
        Create Post
      </button>
      {isModalVisible && (<CreatePostModal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)} />)} */}
      <h2>Your Feed</h2>
      <DisplayReviews unique = {undefined}/>
  </div>
  )
}

export default Home;