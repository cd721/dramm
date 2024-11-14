import { useState, useEffect } from "react";
import axios from "axios";
import noImage from "../img/download.jpeg";
import { Link, useParams } from "react-router-dom";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YoutubeIcon from "@mui/icons-material/Youtube";

//useParams gets URL parameters
///places/page/:page"
//"/places/:id"

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader,
} from "@mui/material";

function Place(props) {
  const { id } = useParams();
  const [placeData, setPlaceData] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("show use effect fired");

    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://api.yelp.com/v3/businesses/${id}`
        );
        setPlaceData(data);
        setLoading(false);
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [id]);
  let name = null;
  if (placeData) {
    placeData.name ? (name = placeData.name) : (name = "No Name");
  }

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
              <h3 className="title">Social Media Pages:</h3>

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
              {placeData && placeData.location && placeData.location.state ? (
                <p>{placeData.location.state}</p>
              ) : (
                {}
              )}
              {placeData &&
              placeData.location &&
              placeData.location.postalCode ? (
                <p>{placeData.location.postalCode}</p>
              ) : (
                {}
              )}
              {placeData && placeData.location && placeData.location.country ? (
                <p>{placeData.location.country}</p>
              ) : (
                <p>Venue Country not available</p>
              )}

              {placeData && placeData.url ? (
                <p>
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={placeData.url}
                  >
                    Click Here to find tickets/upcoming events for this place.
                  </a>
                </p>
              ) : (
                <p>
                  Sorry, there's no Ticketmaster page for this place right now.
                </p>
              )}

              <Link to="/places">Click here to go back to all places...</Link>
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default Place;
