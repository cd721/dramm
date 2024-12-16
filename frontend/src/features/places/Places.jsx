import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PlaceListCard from "./PlaceListCard.jsx";
import SearchPlaces from "./SearchPlaces.jsx";
import Categories from "./Categories.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import yelpCategories from "../../helpers/categories.js";
import { useTitle } from "../shared/hooks/commonHooks.js";
const YELP_API_KEY = import.meta.env.VITE_YELP_API_KEY;

export async function getUserData(currentUser) {
  const { data } = await axios.get(
    `http://localhost:3001/users/${currentUser.uid}`
  );
  return data;
}

function PlaceList(props) {
  useTitle('Places');

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  
  const [placesData, setPlacesData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategories, setActiveCategories] = useState(yelpCategories);
  const [userZipCode, setUserZipCode] = useState("07030");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserData(currentUser);
        setUserZipCode(userData.zipCode);
      } catch (e) {
        console.error(e);
        setUserZipCode("07030");
      }

      try {
        const offset = (currentPage - 1) * resultsPerPage;
        const categoryString = activeCategories.map((cat) => cat.alias).join(",");
        
        const { data } = await axios.get(
          `https://api.yelp.com/v3/businesses/search?location=${userZipCode}&term=${searchTerm}&categories=${categoryString}&sort_by=best_match&limit=${resultsPerPage}&offset=${offset}&locale=en_US`,
          {
            headers: {
              Authorization: `Bearer ${YELP_API_KEY}`,
            },
          }
        );

        setPlacesData(data.businesses || []);
        setTotalResults(data.total || 0);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
        navigate("/404");
      }
    };

    fetchData();
  }, [searchTerm, activeCategories, currentPage, navigate]);

  const searchValue = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <div className="place-list">
      <div className="attractions-filter">
        <div className="search-header">
          <h1>Welcome, {currentUser && currentUser.displayName}.</h1>
          <p>Search attractions, or select categories of places you want to see!</p>
        </div>

        {/* searchung */}
        <SearchPlaces searchValue={searchValue} />

        {/* categories */}
        <Categories
          activeCategories={activeCategories}
          setActiveCategories={setActiveCategories}
        />
      </div>

      <h2>
        {searchTerm ? `Results for ${searchTerm}...` : 'Here are your best matches!'}
      </h2>

      {activeCategories.length === 0 ? (
        <div>
          <h3>Select a category to see places!</h3>
        </div>
      ) : (
        <>
          {/* place cards */}
          <div className="places-grid">
            {placesData.length > 0 ? (
              placesData.map((place) => (
                <PlaceListCard key={place.id} place={place} />
              ))
            ) : (
              <div>
                <h3>No places found for the selected categories.</h3>
              </div>
            )}
          </div>

          {/* pagination */}
          {placesData.length > 0 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PlaceList;