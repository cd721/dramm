import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { initializeApp } from "firebase/app";
import fbconfig from "./firebase/FirebaseConfig.js";

import { BrowserRouter } from "react-router-dom";

const app = initializeApp(fbconfig);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
