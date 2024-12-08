import { Route, Link, Routes } from "react-router-dom";
function ErrorPage(props) {
  return (
    <>
      <h1>Error 404: Sorry, that page can't be found.</h1>
      <Link to="/">Click here to go to the homepage.</Link>
    </>
  );
}
export default ErrorPage;