import React, { useState, useEffect, useContext } from 'react'
import { getUserData } from '../places/Places.jsx';
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
const YELP_API_KEY = import.meta.env.VITE_YELP_API_KEY;
import PlaceListCard from '../places/PlaceListCard.jsx';
import yelpCategories from "../../helpers/categories.js";
import Reccomendation from './Reccomendation.jsx';

const ForYou = ({ zipCode }) => {
    const [loading, setLoading] = useState(true);
    const [placesData, setPlacesData] = useState([]);
    const [activeCategories, setActiveCategories] = useState(yelpCategories);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryString = activeCategories.join(",");
                const { data } = await axios.get(
                    `https://api.yelp.com/v3/businesses/search?location=${zipCode}&sort_by=best_match&categories=${categoryString}&limit=10&locale=en_US`,
                    {
                        headers: {
                            Authorization: `Bearer ${YELP_API_KEY}`,
                        },
                    }
                );

                setPlacesData(data.businesses || []);
                setLoading(false);
            } catch (e) {
                console.error(e);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading reccomendations...</div>;
    }

    return (
        <div>
            <h2>Outdoor Locations For You!</h2>
            <div className="places-grid">
                {placesData
                    .sort((a, b) => a.distance.toFixed(0) - b.distance.toFixed(0))
                    .map((place) => (
                        <Reccomendation key={place.id} place={place} />
                    ))}

            </div>
        </div>
    )
}

export default ForYou