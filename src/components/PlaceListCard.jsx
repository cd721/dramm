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
import AddIcon from "@mui/icons-material/Add";
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
          <Link to={`/places/${place.id}`}>
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
                <span>More Info</span>
              </Typography>
              <a rel=""
              target=""
              href="">
                <AddIcon><span>Add to my places</span></AddIcon>
              </a>
            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default PlaceListCard;
