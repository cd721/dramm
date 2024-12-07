const SearchAttractions = (props) => {

  return (    <div>

    <form
      method="POST"
      onSubmit={(e) => {
        e.preventDefault();
        props.searchValue(e.target[0].value);
        e.target.reset();

      }}
      name="formName"
      className="center"
    >
      <label>
        <span>Search Attractions: </span>
        <input
          autoComplete="off"
          type="text"
          name="searchTerm"
        />
      </label>
      <button type="submit">Submit</button>
    </form>
    <form
      method="POST"
      onSubmit={(e) => {
        e.preventDefault();
        props.searchValue("");
      }}
      name="formName"
      className="center">
    <button type="submit">Clear Search</button>
    </form>
    </div>
  );
};

export default SearchAttractions;
