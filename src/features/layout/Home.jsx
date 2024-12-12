import  {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../../context/AuthContext';
import CurrentUserWeather from '../weather/CurrentUserWeather';
import axios from "axios"

function Home() {
  const {currentUser} = useContext(AuthContext);
  console.log(currentUser);
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
    <div className='card'>
      {/* <h2>
        Hello {currentUser && currentUser.displayName}, this is the Protected
        Home page
      </h2> */}
      {zipCode ? <CurrentUserWeather zipCode = {zipCode}/>
        : <p>Your account is not attached to a zipcode yet, head to your profile to update this information to view the current weather in your area!.</p>}
      
      
    </div>
  );
}

export default Home;