import { useState, useEffect } from "react";
import axios from "axios";
import noImage from "../../img/download.jpeg";
import { Link, useParams } from "react-router-dom";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader,
} from "@mui/material";

const YELP_API_KEY = import.meta.env.VITE_YELP_API_KEY;
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
function Place(props) {
  const { id } = useParams();
  const [placeData, setPlaceData] = useState(undefined);
  const [currentWeatherDataForPlace, setCurrentWeatherDataForPlace] =
    useState(undefined);
  const [loading, setLoading] = useState(true);
  const [weatherForecastForPlace, setWeatherForecastForPlace] =
    useState(undefined);

  useEffect(() => {
    console.log("show use effect fired");

    const fetchData = async () => {
      try {
        const { data: placeData } = await axios.get(
          `https://api.yelp.com/v3/businesses/${id}`,
          {
            headers: {
              Authorization: `Bearer ${YELP_API_KEY}`,
            },
          }
        );

        setPlaceData(placeData);
        console.log(placeData);

        const latitude = placeData.coordinates.latitude;
        const longitude = placeData.coordinates.longitude;

        const { data: currentWeatherDataForPlace } = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`
        );
        console.log("Weather data for place:")
        console.log(currentWeatherDataForPlace);
console.log(currentWeatherDataForPlace.main.temp)
        setCurrentWeatherDataForPlace(currentWeatherDataForPlace);

        //Gives 40 timestamps by default (gives  forecast for every three hours over the next 5 days).
        const { data: weatherForecastForPlace } = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`
        );
        console.log("Weather FORECAST for place:")

        console.log(weatherForecastForPlace);
        setWeatherForecastForPlace(weatherForecastForPlace);

        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div>
        <h2>loading...</h2>
      </div>
    );
  } else {
    return (
      <div>
        <div>
          {" "}
          <Card
            variant="outlined"
            sx={{
              maxWih3h: 550,
              height: "auto",
              marginLeft: "auto",
              marginRight: "auto",
              borderRadius: 5,
              border: "1px solid #1e8678",
              boxShadow:
                "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
            }}
          >
            <CardHeader
              title={placeData.name}
              sx={{
                borderBottom: "1px solid #1e8678",
                fontWeight: "bold",
              }}
            />
            <CardMedia
              component="img"
              image={
                placeData && placeData.image_url ? placeData.image_url : noImage
              }
              title="show image"
            />

            <CardContent>
              <Typography
                variant="body2"
                color="textSecondary"
                component="span"
                sx={{
                  borderBottom: "1px solid #1e8678",
                  fontWeight: "bold",
                }}
              >
                <Typography variant="body2" color="textSecondary" component="p">
                  {placeData.location &&
                  placeData.location.display_address &&
                  placeData.location.display_address[0]
                    ? placeData.location.display_address[0]
                    : "No Address available"}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {placeData.location &&
                  placeData.location.display_address &&
                  placeData.location.display_address[1]
                    ? placeData.location.display_address[1]
                    : "No other location info available"}
                </Typography>
                <br />
                <Typography variant="body2" color="textSecondary" component="p">
                  {placeData.display_phone && placeData.display_phone
                    ? placeData.display_phone
                    : "No phone number available."}
                </Typography>{" "}
                <br />
                <Typography variant="body2" color="textSecondary" component="p">
                  {placeData.rating && placeData.rating
                    ? `Yelp Rating: ${placeData.rating}/5`
                    : "There are no ratings on Yelp for this place."}
                </Typography>
                <Link to="/places">Click here to go back to all places...</Link>
              </Typography>
            </CardContent>
          </Card>
        </div>

        <div>
          {" "}
          <Card
            variant="outlined"
            sx={{
              maxWih3h: 550,
              height: "auto",
              marginLeft: "auto",
              marginRight: "auto",
              borderRadius: 5,
              border: "1px solid #1e8678",
              boxShadow:
                "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
            }}
          >
            <CardHeader
              title={`Weather for ${placeData.name} located in 
            ${placeData.location.city}, ${placeData.location.state}`}
              sx={{
                borderBottom: "1px solid #1e8678",
                fontWeight: "bold",
              }}
            />
            <CardMedia
              component="img"
              title="show image"
              src={
                currentWeatherDataForPlace &&
                currentWeatherDataForPlace.weather &&
                currentWeatherDataForPlace.weather[0] &&
                currentWeatherDataForPlace.weather[0].icon
                  ? `https://openweathermap.org/img/wn/${currentWeatherDataForPlace.weather[0].icon}@2x.png`
                  : noImage
              }
            />

            <CardContent>
              <Typography
                variant="body2"
                color="textSecondary"
                component="span"
                sx={{
                  borderBottom: "1px solid #1e8678",
                  fontWeight: "bold",
                }}
              >
                <Typography variant="body2" color="textSecondary" component="p">
                  {currentWeatherDataForPlace &&
                  currentWeatherDataForPlace.main &&
                  currentWeatherDataForPlace.main.temp &&
                  currentWeatherDataForPlace.main.feelsLike
                    ? `The temperature is currently ${currentWeatherDataForPlace.main.temp}°F, but it feels like ${currentWeatherDataForPlace.main.feels_like}°F.`
                    : "Sorry, we don't know what the temperature is like in this area."}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {currentWeatherDataForPlace &&
                  currentWeatherDataForPlace.weather &&
                  currentWeatherDataForPlace.weather[0] &&
                  currentWeatherDataForPlace.weather[0].description
                    ? `The weather today is characterized by: ${currentWeatherDataForPlace.weather[0].description}.`
                    : ""}
                </Typography>
                <br />
                <Typography variant="body2" color="textSecondary" component="p">
                  {placeData.display_phone && placeData.display_phone
                    ? placeData.display_phone
                    : "No phone number available."}
                </Typography>{" "}
                <br />
                <Typography variant="body2" color="textSecondary" component="p">
                  {placeData.rating && placeData.rating
                    ? `Yelp Rating: ${placeData.rating}/5`
                    : "There are no ratings on Yelp for this place."}
                </Typography>
                <Link to="/places">Click here to go back to all places...</Link>
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

export default Place;
