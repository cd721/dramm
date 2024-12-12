import React, {useState, useEffect} from 'react'
import axios from "axios"
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const CurrentUserWeather = ({ zipCode }) => {
    const [currentWeatherData, setCurrentWeatherData] = useState(undefined);
    const [longitude, setLongitude] = useState(null)
    const [latitutde, setLatitude] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: currentLocation } = await axios.get(
                    `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${WEATHER_API_KEY}`
                );
                setLongitude(currentLocation.lon)
                setLatitude(currentLocation.lat)

                const result = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitutde}&lon=${longitude}&appid=${WEATHER_API_KEY}`
                )
                setCurrentWeatherData(result.data)

            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, []);

    return (
        <div>

        </div>

    )
}

export default CurrentUserWeather