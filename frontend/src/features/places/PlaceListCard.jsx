import noImage from "../../img/download.jpeg";
import { Link } from "react-router-dom";
import '../shared/styles/places.css'
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState,useEffect } from "react";
import axios from "axios";

function PlaceListCard({ place }) {
  const { currentUser } = useContext(AuthContext);

  const [userHasPlace, setUserHasPlace] = useState(false);

  async function bookmarkPlaceForUser(place) {
      try {
          const { data } = await axios.patch(
              `http://localhost:3001/users/${currentUser.uid}/places/${place.id}`,
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
              `http://localhost:3001/users/${currentUser.uid}/places/${place.id}`,
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
      const fetchData = async () => {
          try {
              const { data: placesForUser } = await axios.get(
                  `http://localhost:3001/users/${currentUser.uid}/places`
              );

              const bookmarked = placesForUser.some(
                  userPlace => userPlace.placeId === place.id && userPlace.isBookmarked
              );

              setUserHasPlace(bookmarked);
          } catch (error) {
              console.error("Error fetching user places:", error);
          }
      };

      fetchData();
  }, [currentUser.uid, place.id]);

  return (
    <div className="place-card">
      <img
          src={place.image_url || noImage}
          alt={place.name}
          className="place-card-image"
      />

      <div className="place-card-overlay">
        <div className="place-card-info">
            <div className="place-card-header">
              <div>
                <h3>{place.name}</h3>
                <p>
                  {place.location?.display_address?.[0] || "No Address available"}
                  {" "}
                  {place.location?.display_address?.[1] || null}
                </p>
                {place.distance && 
                  <p className="distance">{place.distance.toFixed(0)} m away</p>
                }
              </div>
              
              <p className="place-rating"><span>{place.rating}</span>/5</p>
            </div>
            
            <ul className="place-card-categories">
              {place.categories?.map((category, index) => (
                <li key={index}>
                  <span className="category-title">{category.title}</span>
                </li>
              )) || "No categories available"}
            </ul>
        </div>

        <div className="place-card-buttons">
          <Link to={`/place/${place.id}`} className="place-card-button more">
              More Info
          </Link>
          
          {userHasPlace ? (
            <button className="place-save-icon unsave" onClick={() => removeBookmarkForUser(place)}>
              <img src="/icons/places/saved.png" alt="Unsave" />
            </button>
          ) : (
            <button className="place-save-icon save" onClick={() => bookmarkPlaceForUser(place)}>
              <img src="/icons/places/notsaved.png" alt="Save" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlaceListCard;
