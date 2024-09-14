import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL as string);

root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey="pk_test_YWJzb2x1dGUtaGVycmluZy0zMS5jbGVyay5hY2NvdW50cy5kZXYk">
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
