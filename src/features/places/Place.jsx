import { useState, useEffect, useContext } from "react";
import axios from "axios";
import noImage from "../../img/download.jpeg";
import CreatePostModal from "../posts/CreatePostModal.jsx";
import '../shared/styles/layout.css'
import DisplayReviews from "../posts/DisplayReviews.jsx";
import { Link, useParams, useNavigate } from "react-router-dom";
import CurrentUserWeather from "../weather/CurrentUserWeather.jsx";
import { HoursTable } from "./HoursTable.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";

const YELP_API_KEY = import.meta.env.VITE_YELP_API_KEY;
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
function Place(props) {
  const navigate = useNavigate();

  const { id } = useParams();

  const { currentUser } = useContext(AuthContext);
  const [userHasPlace, setUserHasPlace] = useState(false);

  const [placeData, setPlaceData] = useState(null);
  const [currentWeatherDataForPlace, setCurrentWeatherDataForPlace] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [weatherForecastForPlace, setWeatherForecastForPlace] = useState(undefined);

  const [isModalVisible, setIsModalVisible] = useState(false);

  async function addPlaceForUser(place) {
    console.log(currentUser.uid);
    const { data } = await axios.patch(
      `http://localhost:3001/users/${currentUser.uid}/places/${place.id}`
    );

    if (data.modifiedCount) {
      console.log(`You have added ${place.name} to your list of places.`);
    } else {
      console.log(`${place.name} is already in your list of places.`);
    }

    setUserHasPlace(true);
  }

  async function removePlaceForUser( place) {
    console.log(currentUser.uid);
    const { data } = await axios.delete(
      `http://localhost:3001/users/${currentUser.uid}/places/${place.id}`
    );

    if (data.modifiedCount) {
      console.log(`You have removed ${place.name} from your list of places.`);
    } else {
      console.log(`${place.name} could not be removed from your list of places.`);
    }

    setUserHasPlace(false);
  }
 
  useEffect(()=> {
   const fetchData =async () => {
      const { data: placesForUser } = await axios.get(
        `http://localhost:3001/users/${currentUser.uid}/places`
      );
      setUserHasPlace(placesForUser.places.includes(placeData.id));
    };

    fetchData();  
  },[placeData]);

  useEffect(() => {
    console.log("show use effect fired");

    const fetchData = async () => {
      try {
        const { data: placeData } = await axios.get(
          `https://api.yelp.com/v3/businesses/${id}`,
          {
            headers: {
              Authorization: `Bearer ${YELP_API_KEY}`,
            },
          }
        );

        setPlaceData(placeData);
        console.log(placeData);

        const latitude = placeData.coordinates.latitude;
        const longitude = placeData.coordinates.longitude;

        const { data: currentWeatherDataForPlace } = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`
        ); setCurrentWeatherDataForPlace(currentWeatherDataForPlace);
        console.log("Weather data for place:");
        console.log(currentWeatherDataForPlace);
        console.log(currentWeatherDataForPlace.main.temp);


        //Gives 40 timestamps by default (gives  forecast for every three hours over the next 5 days).
        const { data: weatherForecastForPlace } = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`
        );
        console.log("Weather FORECAST for place:");


        console.log(weatherForecastForPlace);
        setWeatherForecastForPlace(weatherForecastForPlace);

        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div>
        <h2>loading...</h2>
      </div>
    );
  }

  return (
    <div className="place-profile">
      <div className="place-header">
        <div className="header-left">
          <div className="place-title">
            <div className="title-top">
              <h1>{placeData.name}</h1>

              <div className="place-profile-rating">
                <div className="stars-container">
                  {Array.from({ length: 5 }, (_, index) => (
                    <div
                      key={index}
                      className={`star ${index < Math.floor(placeData.rating) ? "filled" : ""}`}
                    >
                      <img
                        src="/icons/places/star.png"
                      />
                    </div>
                  ))}
                </div>
                <p className="rating-text"><span>{placeData.rating}</span> ({placeData.review_count} reviews)</p>
              </div>
            </div>

            <ul className="place-card-categories">
              {placeData.categories?.map((category, index) => (
                <li key={index}>
                  <span className="category-title">{category.title}</span>
                </li>
              )) || "No categories available"}
            </ul>
          </div>
          
          <div className="secondary-images">
            <img 
              className="place-image"
              src={placeData && placeData.photos[1] ? placeData.photos[1] : noImage}
            />
            <img 
              className="place-image"
              src={placeData && placeData.photos[2] ? placeData.photos[2] : noImage}
            />
          </div>
        </div>
        <img 
          className="place-image main"
          src={placeData && placeData.image_url ? placeData.image_url : noImage}
        />
      </div>

      {isModalVisible && (<CreatePostModal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)} place={placeData.name} placeId={placeData.id} />)}
      <div id="place-buttons">
        <div className="left-buttons">
          <button
              className="create-post"
              onClick={() => {
                setIsModalVisible(true)
              }}>
              Write Review
          </button>

          {userHasPlace ? (
            <button className="place-save-icon unsave" onClick={() => removePlaceForUser(placeData)}>
              <img src="/icons/places/saved.png" alt="Unsave" />
              <p>Unsave</p>
            </button>
          ) : (
            <button className="place-save-icon save" onClick={() => addPlaceForUser(placeData)}>
              <img src="/icons/places/notsaved.png" alt="Save" />
              <p>Save</p>
            </button>
          )}
        </div>

        <div className="right-buttons">
          <button onClick={() => navigate('/places')}>
            Back to all places
          </button>
        </div>
      </div>

      <div className="place-information">
        {placeData.location.zip_code &&
          <CurrentUserWeather zipCode={placeData.location.zip_code} />
        }

        <div className="place-info-container" id="attraction-info">
          <h4>Attraction Information</h4>

          <table className="info-table">
            <tbody>
            {placeData.url &&
              <tr>
                <td className="label">Website:</td>
                <td><a href={placeData.url}>Yelp</a></td>
              </tr>
            }

            {placeData.display_phone &&
              <tr>
                <td className="label">Phone:</td>
                <td>{placeData.display_phone}</td>
              </tr>
            }

            {placeData.location &&
              <tr>
                <td className="label">Location:</td>
                <td>{placeData.location.display_address[0]} {placeData.location.display_address[1]}</td>
              </tr>
            }
            </tbody>
          </table>
        </div>
        
        <div className="place-info-container" id="place-hours">
          <h4>Hours</h4>
          {placeData.hours ? (
            <HoursTable hours={placeData.hours} />
          ) : (
            <p>No provided operational hours</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Place;
