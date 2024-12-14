import noImage from "../../img/download.jpeg";
import { Link } from "react-router-dom";
import '../shared/styles/places.css'
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState,useEffect } from "react";
import axios from "axios";

function PlaceListCard({ place }) {
  const { currentUser } = useContext(AuthContext);

  const [userHasPlace, setUserHasPlace] = useState(false);

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
      setUserHasPlace(placesForUser.places.includes(place.id));
    };

    fetchData();  
  },[])

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
            <div className="place-card-icon unsave" onClick={() => removePlaceForUser(place)}>
              <img src="/icons/saved.png" alt="Unsave" />
            </div>
          ) : (
            <div className="place-card-icon save" onClick={() => addPlaceForUser(place)}>
              <img src="/icons/notsaved.png" alt="Save" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlaceListCard;
