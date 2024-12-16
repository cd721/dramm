import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import '../shared/styles/layout.css'
import CreatePostModal from '../posts/CreatePostModal';
import DisplayReviews from '../posts/DisplayReviews.jsx';
import CurrentUserWeather from '../weather/CurrentUserWeather';
import axios from "axios"
import { useTitle } from '../shared/hooks/commonHooks.js';
import ForYou from '../for-you/ForYou.jsx';

function Home() {
  useTitle('Home');

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
      <h2>Your Feed</h2>
      <DisplayReviews unique = {undefined}/>
      {zipCode ? <ForYou zipCode = {zipCode}/>
        : <p>Your account is not attached to a zipcode yet, head to your profile to update this information to view reccomendation for you!.</p>}
      
  </div>
  )
}

export default Home;