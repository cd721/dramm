import { useState, useEffect } from "react";
import axios from "axios";
import noImage from "../img/download.jpeg";
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
  const [weatherDataForPlace, setWeatherDataForPlace] = useState(undefined);
  const [loading, setLoading] = useState(true);

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

        const { data: weatherDataForPlace } = await axios.get(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}}&appid=${WEATHER_API_KEY}`
        );
        setWeatherDataForPlace(weatherDataForPlace);

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
              {/* <h3 className="title">Social Media Pages:</h3>

              <h3 className="title">Venue address:</h3>
              {placeData &&
              placeData.location &&
              placeData.location.address1 ? (
                <p>{placeData.location.address1}</p>
              ) : (
                <p>Place address not available</p>
              )}
              {placeData && placeData.location && placeData.location.city ? (
                <p>{placeData.location.city}</p>
              ) : (
                <p>Place City not available</p>
              )}
            */}
              <Link to="/places">Click here to go back to all places...</Link>
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default Place;
