import "./App.css";
import Account from "./Account";
import CustomizeProfile from "./CustomizeProfile";
import Home from "./Home";
import Landing from "./Landing";
import Navigation from "./Navigation";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Places from "./Places";
import Place from "./Place"
import ErrorPage from "./ErrorPage";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./PrivateRoute";
import { Route, Link, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import darkTheme from "./theme";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={darkTheme}>
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

            <Route path="/customize-profile" element={<PrivateRoute />}>
              <Route path="/customize-profile" element={<CustomizeProfile />} />
            </Route>

            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/places" element={<Places />} />
            <Route path="/place/:id" element={<Place />} />


            <Route path="/404" element={<ErrorPage />} />
            <Route path="*" element={<Navigate to='/404' />} />

          </Routes>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
