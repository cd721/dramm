import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import PlaceListCard from "./PlaceListCard.jsx";
import validation from "../../helpers/validation.js";
import { useNavigate } from "react-router-dom";
import SearchPlaces from "./SearchPlaces";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import Categories from "./Categories.jsx";

import yelpCategories from "../../helpers/categories.js";
const YELP_API_KEY = import.meta.env.VITE_YELP_API_KEY;

async function getUserData(currentUser) {
  const { data } = await axios.get(
    `http://localhost:3001/users/${currentUser.uid}`
  );
  return data;
}

function PlaceList(props) {
  const { currentUser } = useContext(AuthContext);
  const { page } = useParams();
  const navigate = useNavigate();

  const nextPage = (parseInt(page) + 1).toString();
  const previousPage = (parseInt(page) - 1).toString();
  const [nextPageExists, setNextPageExists] = useState(false);

  const [loading, setLoading] = useState(true);

  const [searchData, setSearchData] = useState([]);
  const [placesData, setPlacesData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [userZipCode, setUserZipCode] = useState("07030");

  const [activeCategories, setActiveCategories] = useState(yelpCategories);

  //when component loads, get places
  useEffect(() => {
    const fetchData = async () => {
      try {
        let userData = await getUserData(currentUser);
        console.log(userData);
        setUserZipCode(userData.zipCode);

      } catch (e) {
        console.log(e);
        setUserZipCode("07030");
        alert(
          "We couldn't locate your zip code. Instead, we'll show you a sample list of places."
        );
      }

      try {
        let categoryString = activeCategories.join(',');
        let { data } = await axios.get(
          `https://api.yelp.com/v3/businesses/search?location=${userZipCode}&categories=${categoryString}&sort_by=best_match&limit=20&locale=en_US`,
          {
            headers: {
              Authorization: `Bearer ${YELP_API_KEY}`,
            },
          }
        );

        setPlacesData(data.businesses);
        if (data.total > 20) {
          setNextPageExists(true);
        }
        setLoading(false);
      } catch (e) {
        //   pageExists = false;
        setLoading(false);
        console.log(e);
        navigate("/404");
      }
    };

    fetchData();
  }, [navigate, activeCategories]);

  //search
  useEffect(() => {
    const fetchData = async () => {
      console.log("Search fetch fired");

      if (!validation.isValidSearchTerm(searchTerm)) return;

      try {
        const { data } = await axios.get(
          `https://api.yelp.com/v3/businesses/search?location=${userZipCode}&term=${searchTerm}&sort_by=best_match&limit=20&locale=en_US`,
          {
            headers: {
              Authorization: `Bearer ${YELP_API_KEY}`,
            },
          }
        );

        if (!data.businesses) {
          setSearchData([]);
        } else {
          setSearchData(data.businesses);
        }
        setLoading(false);

      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [searchTerm]);

  const filteredPlaces = placesData.filter((place) =>
    place.categories.some((cat) => activeCategories.includes(cat.alias))
  );

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  }

  return (
    <div className="place-list">
      <h3>Welcome, {currentUser && currentUser.displayName}.</h3>

      {/* pagination */}
      {page >= 1 && nextPageExists && !searchTerm && (
        <Link to={`/places/page/${nextPage}`}>Go to Next Page</Link>
      )}
      <br />
      {page >= 2 && !searchTerm && (
        <Link to={`/places/page/${previousPage}`}>Go to Previous Page</Link>
      )}

      {/* searching */}
      <SearchPlaces searchValue={searchValue} />
      <Categories
        activeCategories={activeCategories}
        setActiveCategories={setActiveCategories}
      />
      {searchTerm && !validation.isValidSearchTerm(searchTerm) && (
        <p> 
          Your search term must contain characters other than whitespace and
          must not consist only of special characters. Please clear your
          search term and try again.
        </p>
      )}

      {/* search results */}
      {searchTerm && searchData.length === 0 && <h3>No results found</h3>}
      {searchTerm && searchData.length > 0 && (
        <div className="places-grid">
          {searchData.map((place) => (
            <PlaceListCard key={place.id} place={place} />
          ))}
        </div>
      )}

      {/* place cards */}
      {!searchTerm && (
        <div className="places-grid">
          {(searchTerm ? searchData : filteredPlaces).map((place) => (
            <PlaceListCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PlaceList;
