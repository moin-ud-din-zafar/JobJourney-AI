//src/index.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)





// src/index.jsx
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <GoogleOAuthProvider clientId={clientId}>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </GoogleOAuthProvider>
//   </React.StrictMode>
// );



// This file is the entry point for the React application.
// It initializes the app and wraps it with necessary providers like Google OAuth.
// The Google OAuth client ID is fetched from environment variables for security.
// The app is rendered into the root element of the HTML document.
// Make sure to set the VITE_GOOGLE_CLIENT_ID environment variable in your .env file
// to use Google authentication features in your app.
