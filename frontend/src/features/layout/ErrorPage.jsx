import { useNavigate } from "react-router-dom";

function ErrorPage(props) {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Error 404: Sorry, that page can't be found.</h2>
      <button onClick={() => navigate('/home')}>Back to homepage</button>
    </div>
  );
}
export default ErrorPage;