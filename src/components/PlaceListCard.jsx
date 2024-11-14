import noImage from "../img/download.jpeg";
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
function PlaceListCard({ place }) {
  console.log(place);
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

            <Button variant="outlined" component={Link} to={`/place/${place.id}`}>
          
              See more info
            </Button>
            <br />
            <Button
              onClick={() => {
                alert("TODO: add place to user's list of saved places");
              }}
              variant="contained"
            >
              Add to my places
            </Button>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default PlaceListCard;
