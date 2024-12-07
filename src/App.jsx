import "./App.css";
import Account from "./features/account/Account";
import CustomizeProfile from "./features/account/CustomizeProfile";
import Home from "./features/layout/Home";
import Landing from "./features/layout/Landing";
import Navigation from "./features/layout/Navigation";
import SignIn from "./features/authentication/SignIn";
import SignUp from "./features/authentication/SignUp";

import Places from "./features/places/Places";
import Place from "./features/places/Place"

import ErrorPage from "./features/layout/ErrorPage";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./features/layout/PrivateRoute";
import { Route, Link, Routes, Navigate } from "react-router-dom";

import { ThemeProvider } from "@mui/material";
import darkTheme from "./features/shared/styles/theme";

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
