import React, { useState, useEffect } from 'react'
import PlaceListCard from '../places/PlaceListCard.jsx';
import axios from "axios"

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const Reccomendation = ({ place }) => {
    const [currWeather, setCurrWeater] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const [weatherHeader, setWeatherHeader] = useState('');
    const [weatherMessages, setWeatherMessages] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const latitude = place.coordinates.latitude;
                const longitude = place.coordinates.longitude;
                const { data: currentWeatherDataForPlace } = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`
                );
                if (!currentWeatherDataForPlace) {
                    console.error("API response is undefined");
                    return;
                }

                setCurrWeater(currentWeatherDataForPlace);

                let weather = evaluateWeather(currentWeatherDataForPlace.name, currentWeatherDataForPlace.main.temp, currentWeatherDataForPlace.main.humidity, currentWeatherDataForPlace.wind.speed)
                setWeatherHeader(weather.header)
                setWeatherMessages(weather.messages)

                setLoading(false);
            } catch (e) {
                console.log(e);
                // alert("There was an error when retrieving weather data")
            }
        };
        fetchData();
    }, []);

    function evaluateWeather(name, temp, humidity, wind) {
        const messages = [];
        let header = `Weather in ${name}:`;

        let isGoodWeather = true;

        const tempMin = 59
        const tempMax = 78
        const humidityMax = 60
        const humidityMin = 30
        const windMax = 20

        if (temp < tempMin) {
            messages.push(`It's too cold (${temp}°F) here to be comfortable. If you do go out though, bring a jacket!`);
            isGoodWeather = false;
        } else if (temp > tempMax) {
            messages.push(`It's too hot (${temp}°F) to be comfortable. If you do go out though, stay hydrated!`);
            isGoodWeather = false;
        } else {
            messages.push(`Temperature is fairly comfortable at ${temp}°F.`);
        }

        if (humidity > humidityMax) {
            messages.push(`It's very humid outside at ${humidity}%.`);
            isGoodWeather = false;
        } else if (humidity < humidityMin) {
            messages.push(`It's very dry outside at ${humidity}%.`);
            isGoodWeather = false;
        } else {
            messages.push(`Humidity is fairly comfortable at ${humidity}%.`);
        }

        if (wind > windMax) {
            messages.push(`It's pretty windy at a speed of ${wind} m/s.`);
            isGoodWeather = false;
        } else {
            messages.push(`Wind speed is mild at ${wind} m/s.`);
        }

        if (isGoodWeather) {
            messages.push(`Looks like the weather is great, you should definitely go here!`);
        } else {
            messages.push(`The weather is not ideal, you may be uncomfortable. Try to find a fun indoor activity or look for a place with better weather!`);
        }

        return { header, messages };
    }
    if (loading) {
        return <div>Loading reccomendations...</div>;
    }
    return (
        <div className='recommendation'>
            <PlaceListCard key={place.id} place={place} />

            <div className='weather-info'>
                <h4>{weatherHeader}</h4>
                <ul>
                    {weatherMessages.map((message, index) => (
                        <li key={index}>{message}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Reccomendation