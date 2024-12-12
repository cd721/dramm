import React, { useState, useEffect } from 'react'
import axios from "axios"
import '../shared/styles/weather.css'
import moment from "moment"

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const CurrentUserWeather = ({ zipCode }) => {
    const [currentWeatherData, setCurrentWeatherData] = useState(undefined);
    const [loading, setLoading] = useState(true)
    const [sunrise, setSunrise] = useState("")
    const [sunset, setSunset] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: currentLocation } = await axios.get(
                    `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${WEATHER_API_KEY}`
                );
                const result = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${currentLocation.lat}&lon=${currentLocation.lon}&appid=${WEATHER_API_KEY}&units=imperial`
                )
                setCurrentWeatherData(result.data)
                let sunrise = moment.utc(result.data.sys.sunrise, 'X').add(result.data.timezone, 'seconds').format('HH:mm');
                setSunrise(sunrise)
                let sunset = moment.utc(result.data.sys.sunset, 'X').add(result.data.timezone, 'seconds').format('HH:mm');
                setSunset(sunset)
                setLoading(false);
                console.log(result.data)

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