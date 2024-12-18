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
            placeholder="Search places..."
            className="search-term" 
          />

          <input
            type="text"
            autoComplete="off"
            placeholder="Enter zip code (optional)"
            className="search-zip"
          />

          <button type="submit">Submit</button>

          <button
            type="button"
            onClick={() => {
              searchValue("");
              setZipCode(null);
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchPlaces;
