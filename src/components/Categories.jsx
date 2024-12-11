import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import yelpCategories from "../helpers/categories.js";
function Categories(props) {
 
  let allCategoriesOfPlacesFound = [];
  for (const place of props.placesData) {
    for (const category of place.categories) {

      const alias = category.alias;
      if (
        yelpCategories.includes(alias) &&
        !allCategoriesOfPlacesFound.includes(alias)
      ) {
        allCategoriesOfPlacesFound.push(alias);
      }
    }
  }

  console.log(allCategoriesOfPlacesFound);
  let categoryCheckboxes =
    allCategoriesOfPlacesFound &&
    allCategoriesOfPlacesFound.map((category, index) => {
      return (
        <FormControlLabel
          key={index}
          control={<Checkbox defaultChecked />}
          label={category}
          onChange={(e) =>{

            if (!e.target.checked) {
              props.updateDeselections(category);
            }

          }}
        />
      );
    });
  return <FormGroup>{categoryCheckboxes&& <p>Select the categories of places that you want to see.</p>}{categoryCheckboxes}</FormGroup>;
}

export default Categories;
