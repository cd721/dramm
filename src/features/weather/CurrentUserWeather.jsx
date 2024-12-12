import React, { useState, useEffect } from 'react'
import axios from "axios"
import '../shared/styles/weather.css'
import moment from "moment"

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const CurrentUserWeather = ({ zipCode }) => {
    const [currentWeatherData, setCurrentWeatherData] = useState(undefined);
    const [longitude, setLongitude] = useState(null)
    const [latitutde, setLatitude] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sunrise, setSunrise] = useState("")
    const [sunset, setSunset] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: currentLocation } = await axios.get(
                    `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${WEATHER_API_KEY}`
                );
                setLongitude(currentLocation.lon)
                setLatitude(currentLocation.lat)
                console.log(currentLocation)
                const result = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitutde}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=imperial`
                )
                console.log(result.data)
                setCurrentWeatherData(result.data)
                let sunrise = moment.utc(currentWeatherData.sys.sunrise, 'X').add(currentWeatherData.timezone, 'seconds').format('HH:mm');
                setSunrise(sunrise)

                let sunset = moment.utc(currentWeatherData.sys.sunset, 'X').add(currentWeatherData.timezone, 'seconds').format('HH:mm');
                setSunset(sunset)

                setLoading(false);
                console.log(currentWeatherData)


            } catch (e) {
                console.log(e);
            }

        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div>
                <h2>loading...</h2>
            </div>
        );
    }

    return (
        <div className="weather">
            <div className="top">
                < p className="city">{currentWeatherData.name}</p>
                <p className="description"> {currentWeatherData.weather[0].description}  </p>

            </div>

            <div className="bottom">
                <div className="mainPresentation">
                    <div className="tdetails">
                        <p className="temp"> {Math.round(currentWeatherData.main.temp)}˚F </p>
                        <div className = "tempGroup">
                            <p className="feelsLike"> Feels like: {Math.round(currentWeatherData.main.feels_like)}˚F</p>
                            <p className="feelsLike"> Min Temperature: {Math.round(currentWeatherData.main.temp_min)}˚F</p>
                            <p className="feelsLike"> Max Temperature: {Math.round(currentWeatherData.main.temp_max)}˚F</p>

                        </div>
                    </div>
                    <div className="timings">
                        <div className="up">
                            <img alt="sunrise" className="sunrise" src="icons/sunrise.png" />
                            <span className="timingsText">{sunrise}</span>
                        </div>
                        <div className="up">
                            <img alt="sunset" className="sunset" src="icons/sunset.png" />
                            <span className="timingsText">{sunset}</span>
                        </div>
                    </div>


                </div>
                <img alt="weather" className="weather-icon" src={`icons/${currentWeatherData.weather[0].icon}.png`} />
            </div>

            <div className="details">
                <div className="parameter-row">
                    <span className="parameter-label"> Wind: </span>
                    <span className="parameter-value"> {currentWeatherData.wind.speed} m/s</span>
                </div>
                <div className="parameter-row">
                    <span className="parameter-label"> Humidity: </span>
                    <span className="parameter-value"> {currentWeatherData.main.humidity}%</span>
                </div>
                <div className="parameter-row">
                    <span className="parameter-label"> Pressure: </span>
                    <span className="parameter-value"> {currentWeatherData.main.pressure} hPa</span>
                </div>
            </div>

        </div>

    )
}

export default CurrentUserWeather