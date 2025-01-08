import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from "react-hot-toast"; // Import the Toaster
import App from "./App";


const root = ReactDOM.createRoot(document.getElementById("root"));
 
root.render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId="437425566739-9oqmhs6e4u8k60f0nlkk8hh9ea9lpmla.apps.googleusercontent.com">
      <App />
      {/* <Toaster position="top-right" reverseOrder={false} /> Add Toaster here */}
    </GoogleOAuthProvider>
  </BrowserRouter>
);
