import "./App.css";
import { Route, Routes } from "react-router-dom";
import Account from "./Account";
import Home from "./Home";
import Landing from "./Landing";
import Navigation from "./Navigation";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Places from "./Places";
import Place from "./Place"
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./PrivateRoute";
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header card">
          <Navigation />
        </header>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>
          <Route path="/account" element={<PrivateRoute />}>
            <Route path="/account" element={<Account />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/places" element={<Places />} />
          <Route path="/place/:id" element={<Place />} />

        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
