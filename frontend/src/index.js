import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google'; // Google sağlayıcısını ekledik
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* Uygulamayı Google koruma kalkanı içine alıyoruz */}
    <GoogleOAuthProvider clientId="279499913538-gtltbe7fmn95ud955uen6ah5j82g1avs.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);