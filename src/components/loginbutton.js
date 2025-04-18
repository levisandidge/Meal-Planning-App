import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import "./header.css";

const LoginButton = ({ className }) => { // Accept className prop if needed for ms-auto etc.
    const { loginWithRedirect, logout, isAuthenticated, isLoading, user } = useAuth0();
  
    if (isLoading) {
      // Render loading state potentially smaller in the navbar
      return <div className={className}>Loading...</div>;
    }
  
    return (
      <div className={className}>
        {!isAuthenticated && (
          <button className="btn btn-primary" onClick={() => loginWithRedirect()}>
            Log In
          </button>
        )}
  
        {isAuthenticated && (
          <div className="d-flex align-items-center">
            <span className="text-light me-3">
              Welcome, {user?.name || user?.email}!
            </span>
            <button
              className="btn btn-outline-light" // Added btn class for styling
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    );
  };
  
  export default LoginButton;
  