import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Grid2 } from "@mui/material";
import PlaceListCard from "./PlaceListCard.jsx";
import validation from "../../helpers/validation.js";
import { useNavigate } from "react-router-dom";
import SearchPlaces from "./SearchPlaces";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
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
  const [searchData, setSearchData] = useState(undefined);
  const [placesData, setPlacesData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const [userZipCode, setUserZipCode] = useState("07030");

  const [deselectedCategories, setDeselectedCategories] = useState([]);
  const addDeselectedCategory = (newCategory) => {
    if (!deselectedCategories.includes(newCategory)) {
      setDeselectedCategories([...deselectedCategories, newCategory]);

      setPlacesData([...placesData]);
    }
  };

  const reselectCategory = (category) => {
    if (deselectedCategories.includes(category)) {
      setDeselectedCategories(deselectedCategories.filter( cat => cat !== category));

      setPlacesData([...placesData]);
    }
  };
  let cardsData = null;

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
        let categoryString = "";
        yelpCategories.forEach(
          (category) =>
            (categoryString = categoryString.concat(`categories=${category}&`))
        );

        let { data } = await axios.get(
          `https://api.yelp.com/v3/businesses/search?location=${userZipCode}&${categoryString}sort_by=best_match&limit=20&locale=en_US`,
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
  }, [navigate]);
  //search
  useEffect(() => {
    const fetchData = async () => {
      console.log("Search fetch fired");

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
    if (validation.isValidSearchTerm(searchTerm)) {
      fetchData();
    }
  }, [searchTerm]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  if (searchTerm) {
    cardsData =
      searchData &&
      searchData.map((place) => {
        return <PlaceListCard place={place} key={place.id} />;
      });
  } else {
    cardsData =
      placesData &&
      placesData.map((place) => {
        const aliases = place.categories.map((category) => category.alias);
        console.log(aliases);
        if (!aliases.some((alias) => deselectedCategories.includes(alias))) {
          return <PlaceListCard place={place} key={place.id} />;
        }
      });
  }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div>
        <h3>Welcome, {currentUser && currentUser.displayName}.</h3>
        {page >= 1 && nextPageExists && !searchTerm && (
          <Link to={`/places/page/${nextPage}`}>Go to Next Page</Link>
        )}
        <br />
        {page >= 2 && !searchTerm && (
          <Link to={`/places/page/${previousPage}`}>Go to Previous Page</Link>
        )}
        {searchTerm && !validation.isValidSearchTerm(searchTerm) && (
          <p>
            Your search term must contain characters other than whitespace and
            must not consist only of special characters. Please clear your
            search term and try again.
          </p>
        )}
        {searchTerm && (
          <div>
            <p>You searched for: {searchTerm}</p>
            <p>Clear your search term to see the whole list.</p>
          </div>
        )}
        <SearchPlaces searchValue={searchValue} />
        {searchTerm &&
          searchData &&
          Array.isArray(searchData) &&
          searchData.length === 0 && (
            <h3>There were no results for your search</h3>
          )}
        <br />
        <Categories
          placesData={placesData}
          updateDeselections={addDeselectedCategory}
        ></Categories>
        <br />
        <Grid2
          container
          spacing={5}
          sx={{
            flexGrow: 1,
            flexDirection: "row",
          }}
        >
          {cardsData}
        </Grid2>
      </div>
    );
  }
}

export default PlaceList;
