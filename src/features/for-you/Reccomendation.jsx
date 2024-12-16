import React, { useState, useEffect } from 'react'
import PlaceListCard from '../places/PlaceListCard.jsx';
import axios from "axios"

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const Reccomendation = ({ place }) => {
    const [currWeather, setCurrWeater] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [weatherDescription, setWeatherDescription] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const latitude = place.coordinates.latitude;
                const longitude = place.coordinates.longitude;
                const { data: currentWeatherDataForPlace } = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`
                );
                setCurrWeater(currentWeatherDataForPlace);
                let cloud = 0
                if (currWeather.clouds){
                    cloud = currWeather.clouds.all
                }

                let weather = evaluateWeather(currWeather.name, currWeather.main.temp, currWeather.main.humidity, currWeather.wind.speed, cloud)
                setWeatherDescription(weather)

                setLoading(false);
            } catch (e) {
                console.log(e);
                // alert("There was an error when retrieving weather data")
            }
        };
        fetchData();
    }, []);

    function evaluateWeather(name, temp, humidity, wind, cloud) {
        let shouldGo = `Weather in ${name}: `;
        let isGoodWeather = true;

        const tempMin = 59
        const tempMax = 78
        const humidityMax = 60
        const humidityMin = 30
        const windMax = 20
        const cloudMax = 50

        if (temp < tempMin) {
            shouldGo += `It's too cold (${temp}°F) here to be comfortable. If you do go out though, bring a jacket! `;
            isGoodWeather = false;
        } else if (temp > tempMax) {
            shouldGo += `It's too hot (${temp}°F) to be comfortable. If you do go out though, stay hydrated! `;
            isGoodWeather = false;
        } else {
            shouldGo += `Temperature is fairly comfortable at ${temp}°F. `;
        }

        if (humidity > humidityMax) {
            shouldGo += `It's very humid outside at ${humidity}%. `;
            isGoodWeather = false;
        } else if (humidity < humidityMin) {
            shouldGo += `It's very dry outside at ${humidity}%. `;
            isGoodWeather = false;
        } else {
            shouldGo += `Humidity is fairly comfortable at ${humidity}%. `;
        }


        if (wind > windMax) {
            shouldGo += `It's pretty windy at a speed of ${wind} m/s. `;
            isGoodWeather = false;
        } else {
            shouldGo += `Wind speed is mild at ${wind} m/s. `;
        }

        if (cloud > cloudMax) {
            shouldGo += `It's cloudy with ${cloud}% cloud coverage. `;
            isGoodWeather = false;
        } else {
            shouldGo += `Skies are pretty clear with ${cloud}% cloud coverage. `;
        }

        if (isGoodWeather) {
            shouldGo += `Looks like the weather is great, you should definitely go here! `;
        } else {
            shouldGo += `The weather is not ideal, you may be uncomfortable. Try to find a fun indoor activity or look for a place with better weather! `;
        }

        return shouldGo;
    }

    return (
        <div>
            <p>{weatherDescription}</p>
            <PlaceListCard key={place.id} place={place} />
        </div>
    )
}

export default Reccomendation