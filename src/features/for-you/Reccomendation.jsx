import React, {useState, useEffect} from 'react'
import PlaceListCard from '../places/PlaceListCard.jsx';
import axios from "axios"

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const Reccomendation = ({ place }) => {
    const [currentWeatherDataForPlace, setCurrentWeatherDataForPlace] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [shouldGo, setShouldGo] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const latitude = place.coordinates.latitude;
                const longitude = place.coordinates.longitude;
                const { data: currentWeatherDataForPlace } = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`
                ); 
                setCurrentWeatherDataForPlace(currentWeatherDataForPlace);
                console.log(currentWeatherDataForPlace)
                setLoading(false);
            } catch (e) {
                console.log(e);
                alert("There was an error when retrieving weather data")
            }
        };
        fetchData();
    }, []);
    return (
        <div>
            <PlaceListCard key={place.id} place={place} />
        </div>
    )
}

export default Reccomendation