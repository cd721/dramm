import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import '../shared/styles/home.css'
import CreatePostModal from '../posts/CreatePostModal.jsx';
import DisplayReviews from '../posts/DisplayReviews.jsx';
import CurrentUserWeather from '../weather/CurrentUserWeather.jsx';
import axios from "axios"
import { useTitle } from '../shared/hooks/commonHooks.js';
import ForYou from '../for-you/ForYou.jsx';

function Home() {
  useTitle('Home');

  const { currentUser } = useContext(AuthContext);
  const [zipCode, setZipCode] = useState("");

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
      <div className='left-side'>
        <div className='fyp-header'>
          <h2>Outdoor Locations For You!</h2>
          <p>Discover top places tailored to your preferences and the weather!</p>
        </div>

        {zipCode ? <ForYou zipCode = {zipCode}/>
          : <p>Your account is not attached to a zipcode yet, head to your profile to update this information to view reccomendation for you!.</p>}
      </div>

      <div className='right-side'>
        <h2>
          Welcome {currentUser && currentUser.displayName}!
        </h2>

        {zipCode ? <CurrentUserWeather zipCode = {zipCode}/>
          : <p>Your account is not attached to a zipcode yet, head to your profile to update this information to view the current weather in your area!.</p>}


        <h2>Your Feed</h2>
        <DisplayReviews unique = {undefined}/>
      </div>


  </div>
  )
}

export default Home;