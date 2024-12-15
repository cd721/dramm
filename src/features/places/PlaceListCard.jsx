import noImage from "../../img/download.jpeg";
import { Link } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";

import { AuthContext } from "../../context/AuthContext";
import { useContext, useState,useEffect } from "react";
import axios from "axios";

function PlaceListCard({ place }) {
  const { currentUser } = useContext(AuthContext);

  const [userHasPlace, setUserHasPlace] = useState(false);

  async function bookmarkPlaceForUser(place) {
      try {
          const { data } = await axios.patch(
              `http://localhost:3001/users/${currentUser.uid}/places/${place.id}`,
              {
                  isBookmarked: true,
                  name: place.name || "Unknown Place",
                  image: place.image_url || noImage,
                  location: place.location?.display_address || ["No Address Available"],
                  city: place.location?.city || "Unknown City",
                  state: place.location?.state || "Unknown State"
              }
          );

          if (data.modifiedCount || data.upsertedCount) {
              alert(`You have added ${place.name} to your bookmarks.`);
          } else {
              alert(`${place.name} is already bookmarked.`);
          }

          setUserHasPlace(true);
      } catch (error) {
          console.error("Error bookmarking place:", error);
          alert("An error occurred while bookmarking the place. Please try again.");
      }
  }

  async function removeBookmarkForUser(place) {
      try {
          const { data } = await axios.patch(
              `http://localhost:3001/users/${currentUser.uid}/places/${place.id}`,
              {
                  isBookmarked: false
              }
          );

          if (data.modifiedCount) {
              alert(`You have removed ${place.name} from your bookmarks.`);
          } else {
              alert(`${place.name} could not be removed from your bookmarks.`);
          }

          setUserHasPlace(false);
      } catch (error) {
          console.error("Error removing bookmark:", error);
          alert("An error occurred while removing the bookmark. Please try again.");
      }
  }
 
  useEffect(() => {
      const fetchData = async () => {
          try {
              const { data: placesForUser } = await axios.get(
                  `http://localhost:3001/users/${currentUser.uid}/places`
              );

              const bookmarked = placesForUser.some(
                  userPlace => userPlace.placeId === place.id && userPlace.isBookmarked
              );

              setUserHasPlace(bookmarked);
          } catch (error) {
              console.error("Error fetching user places:", error);
          }
      };

      fetchData();
  }, [currentUser.uid, place.id]);

  return (
    <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={place.id}>
      <Card
        variant="outlined"
        sx={{
          maxWidth: 250,
          height: "auto",
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: 5,
          border: "1px solid #1e8678",
          boxShadow:
            "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
        }}
      >
        <CardActionArea>
          <CardMedia
            sx={{
              height: "100%",
              width: "100%",
            }}
            component="img"
            image={place.image_url ? place.image_url : noImage}
            title="place image"
          />

          <CardContent>
            <Typography
              sx={{
                borderBottom: "1px solid #1e8678",
                fontWeight: "bold",
              }}
              gutterBottom
              variant="h5"
              component="h3"
            >
              {place.name}
            </Typography>

            <Typography variant="body2" color="textSecondary" component="p">
              {place.location &&
              place.location.display_address &&
              place.location.display_address[0]
                ? place.location.display_address[0]
                : "No Address available"}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {place.location &&
              place.location.display_address &&
              place.location.display_address[1]
                ? place.location.display_address[1]
                : "No other location info available"}
            </Typography>
            <br />

            <Button
              variant="outlined"
              component={Link}
              to={`/place/${place.id}`}
            >
              See more info
            </Button>
            <br />
            { userHasPlace && (
              <Button
                onClick={() => removeBookmarkForUser( place)}
                variant="contained"
              >
                Remove Bookmark
              </Button>
            )}
            {( !userHasPlace) && (
              <Button
                onClick={() => bookmarkPlaceForUser(place)}
                variant="contained"
              >
                Bookmark
              </Button>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default PlaceListCard;
