import "./App.css";
import "./features/shared/styles/form.css"
import './features/shared/styles/layout.css'

import Account from "./features/account/Account";
import CustomizeProfile from "./features/account/CustomizeProfile";
import Home from "./features/layout/Home";
import { Landing } from "./features/layout/Landing";
import SignIn from "./features/authentication/SignIn";
import SignUp from "./features/authentication/SignUp";

import Places from "./features/places/Places";
import Place from "./features/places/Place"
import AddPlaceReview from "./features/places/AddPlaceReview"

import ErrorPage from "./features/layout/ErrorPage";

import PrivateRoute from "./features/layout/PrivateRoute";
import { Route, Link, Routes, Navigate } from "react-router-dom";
import { Navbar } from "./features/layout/Navbar";

import './App.css';

function App() {
  return (
    <div className="layout">
        <Navbar />

        <main>
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
            <Route path="/AddPlaceReview" element={<AddPlaceReview />} />


            <Route path="/404" element={<ErrorPage />} />
            <Route path="*" element={<Navigate to='/404' />} />
          </Routes>
        </main>
    </div>
  );
}

export default App;
