const SearchPlaces = ({ searchValue }) => {
  return (
    <div className="search-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchValue(e.target[0].value);
          e.target.reset();
        }}
      > 
        <div className="search-bar">
          <input type="text" autoComplete="off" />

          <button type="submit">Submit</button>

          {/* clearing the search */}
          <button
            onClick={() => {
              searchValue("");
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
