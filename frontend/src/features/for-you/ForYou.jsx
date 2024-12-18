import React, { useState, useEffect } from 'react';
import axios from "axios";
import Reccomendation from './Reccomendation.jsx';
import yelpCategories from "../../helpers/categories.js";

const YELP_API_KEY = import.meta.env.VITE_YELP_API_KEY;

const ForYou = ({ zipCode }) => {
    const [loading, setLoading] = useState(true);
    const [placesData, setPlacesData] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryString = yelpCategories.map((cat) => cat.alias).join(",");
                const { data } = await axios.get(
                    `https://api.yelp.com/v3/businesses/search?location=${zipCode}&sort_by=best_match&categories=${categoryString}&limit=50&locale=en_US`,
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
    }, [zipCode]);

    if (loading) {
        return <div>Loading reccomendations...</div>;
    }

    return (
        <>
            {placesData.length > 0 ? (
                <div className='recommendation-panel'>
                    {currentIndex !== 0 &&
                        <button 
                            className="fyp-button prev" 
                            onClick={() => setCurrentIndex((prevIndex) => prevIndex - 1)}
                            disabled={currentIndex === 0}
                        >
                            <img 
                                src={`/icons/arrow.png`}
                                alt={"previous"}
                                className="prev-icon"
                            />
                        </button>
                    }

                    <Reccomendation key={placesData[currentIndex].id} place={placesData[currentIndex]} />

                    {currentIndex !== placesData.length - 1 &&
                        <button 
                            className="fyp-button next" 
                            onClick={() => setCurrentIndex(prevIndex => prevIndex + 1)}
                            disabled={currentIndex === placesData.length - 1}
                        >
                            <img 
                                src={`/icons/arrow.png`}
                                alt={"next"}
                                className="next-icon"
                            />
                        </button>
                    }

                </div>
            ) : (
                <div>No recommendations found.</div>
            )}
        </>
    );
};

export default ForYou;