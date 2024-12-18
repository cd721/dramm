const SearchPlaces = ({ searchValue, setZipCode }) => {
  return (
    <div className="search-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const searchTerm = e.target[0].value.trim();
          const zipCode = e.target[1].value.trim();

          searchValue(searchTerm);
          
          if (zipCode) {
            setZipCode(zipCode);
          }
        }}
      >
        <div className="search-bar">
          <input 
            type="text" 
            autoComplete="off" 
            placeholder="Search places by name"
            className="search-term" 
          />

          <input
            type="text"
            autoComplete="off"
            placeholder="Enter zip code (optional)"
            className="search-zip"
          />

          <button type="submit">
            <img 
                src={`/icons/search.png`}
                alt={"Submit Search"}
                className="search-icon"
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchPlaces;
