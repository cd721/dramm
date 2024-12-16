import yelpCategories from "../../helpers/categories.js";

function Categories({ activeCategories, setActiveCategories }) {

  const handleCategoryToggle = (category) => {
    if (activeCategories.find((cat) => cat.alias === category.alias)) {
      setActiveCategories(activeCategories.filter((cat) => cat.alias !== category.alias));
    } else {
      setActiveCategories([...activeCategories, category]);
    }
  };

  return (
    <div className="categories-container">      
      <div className="categories-list">
        {yelpCategories.map(({ alias, label }, index) => (
            <label 
              key={index} 
              className={`category-item ${
                activeCategories.some((cat) => cat.alias === alias) ? "active" : null
              }`}
            >
              <input
                type="checkbox"
                checked={activeCategories.some((cat) => cat.alias === alias)}
                onChange={() => handleCategoryToggle({ alias, label })}
              />
              <img 
                src={`/icons/categories/${alias}.png`}
                alt={label}
                className="category-icon"
              />
              <p>{label}</p>
            </label>
        ))}
      </div>
    </div>
  );
}

export default Categories;
