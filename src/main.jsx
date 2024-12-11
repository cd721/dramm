import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { initializeApp } from "firebase/app";
import fbconfig from "./firebase/FirebaseConfig.js";

import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { AuthProvider } from "./context/AuthContext.jsx";
import darkTheme from "./features/shared/styles/theme.js";

const app = initializeApp(fbconfig);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider theme={darkTheme}>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);
