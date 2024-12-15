import yelpCategories from "../../helpers/categories.js";

function Categories({ activeCategories, setActiveCategories }) {

  const handleCategoryToggle = (category) => {
    if (activeCategories.includes(category)) {
      setActiveCategories(activeCategories.filter((cat) => cat !== category));
    } else {
      setActiveCategories([...activeCategories, category]);
    }
  };

  return (
    <div className="categories-container">      
      <div className="categories-list">
        {yelpCategories.map((category, index) => (
            <label 
              key={index} 
              className={`category-item ${
                activeCategories.includes(category) ? "active" : null
              }`}
              onChange={() => handleCategoryToggle(category)}
            >
              <input
                type="checkbox"
                checked={activeCategories.includes(category)}
              />
              <img 
                src={`/icons/categories/${category}.png`}
                alt={category}
                className="category-icon"
              />
              <p>{category}</p>
            </label>
        ))}
      </div>
    </div>
  );
}

export default Categories;
