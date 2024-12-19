import { useState, useEffect, useContext } from "react";
import axios from "axios";
import noImage from "../../img/download.jpeg";
import CreatePostModal from "../posts/CreatePostModal.jsx";
import '../shared/styles/layout.css'
import DisplayReviews from "../posts/DisplayReviews.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { HoursTable } from "./HoursTable.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { RatingStars } from "../posts/RatingStars.jsx";
import CurrentUserWeather from "../weather/CurrentUserWeather.jsx";

const YELP_API_KEY = import.meta.env.VITE_YELP_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

function Place(props) {
  const navigate = useNavigate();

  const { id } = useParams();

  const { currentUser } = useContext(AuthContext);
  const [userHasPlace, setUserHasPlace] = useState(false);

  const [placeData, setPlaceData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isModalVisible, setIsModalVisible] = useState(false);

  async function bookmarkPlaceForUser(place) {
    try {
        const { data } = await axios.patch(
            `${API_URL}/users/${currentUser.uid}/places/${place.id}`,
            {
                isBookmarked: true,
                name: place.name || "Unknown Place",
                image: place.image_url || noImage,
                location: place.location?.display_address || ["No Address Available"],
                city: place.location?.city || "Unknown City",
                state: place.location?.state || "Unknown State"
            }
        );

        // if (data.modifiedCount || data.upsertedCount) {
        //     alert(`You have added ${place.name} to your bookmarks.`);
        // } else {
        //     alert(`${place.name} is already bookmarked.`);
        // }

        setUserHasPlace(true);
    } catch (error) {
        console.error("Error bookmarking place:", error);
        alert("An error occurred while bookmarking the place. Please try again.");
    }
  }

  async function removeBookmarkForUser(place) {
    try {
        const { data } = await axios.patch(
            `${API_URL}/users/${currentUser.uid}/places/${place.id}`,
            {
                isBookmarked: false
            }
        );

        // if (data.modifiedCount) {
        //     alert(`You have removed ${place.name} from your bookmarks.`);
        // } else {
        //     alert(`${place.name} could not be removed from your bookmarks.`);
        // }

        setUserHasPlace(false);
    } catch (error) {
        console.error("Error removing bookmark:", error);
        alert("An error occurred while removing the bookmark. Please try again.");
    }
  }

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
        console.log("place", placeData);

        setLoading(false);

      } catch (e) {
        // Yelp doesn't provide details for some businesses, particularly ones that do not have any reviews
        if (e.response?.data?.error?.code === "BUSINESS_UNAVAILABLE") {

          setPlaceData(null);
          setLoading(false);
          
        } else {
          console.error("Error fetching data:", e);
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!placeData || !placeData.id) return;

        const { data: placesForUser } = await axios.get(
            `${API_URL}/users/${currentUser.uid}/places`
        );

        const bookmarked = placesForUser.some(
            userPlace => userPlace.placeId === placeData.id && userPlace.isBookmarked
        );

        setUserHasPlace(bookmarked);
      } catch (error) {
          console.error("Error fetching user places:", error);
      }
    };

    fetchData();
  }, [currentUser.uid, placeData]);

  if (loading) {
    return (
      <div>
        <h2>loading...</h2>
      </div>
    );
  }

  if (placeData === null) {
    return (
      <div>
        <h2>Attraction Not Available</h2>
        <p>We are unable to provide details for this attraction. It might not have any reviews yet or is currently unavailable.</p>
        <button onClick={() => navigate('/places')}>Back to all places</button>
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
                  <RatingStars rating={placeData.rating} />
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

      {isModalVisible && (<CreatePostModal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)} place={placeData.name} placeId={placeData.id} city={placeData.location.city} state={placeData.location.state} />)}
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
            <button className="place-save-icon unsave" onClick={() => removeBookmarkForUser(placeData)}>
              <img src="/icons/places/saved.png" alt="Unsave" />
              <p>Unsave</p>
            </button>
          ) : (
            <button className="place-save-icon save" onClick={() => bookmarkPlaceForUser(placeData)}>
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

      <h4>Reviews</h4>
      <DisplayReviews type="place" uniqueId={placeData.id} />
    </div>
  );
}

export default Place;
