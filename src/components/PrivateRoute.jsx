import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * PrivateRoute Component
 * Wraps any component that requires an active session.
 * If no token exists in localStorage, it redirects to /login.
 */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  const user = localStorage.getItem('user');
  const location = useLocation();

  if (!token&&!user) {
    // Redirect them to the /login page, but save the current location they 
    // were trying to go to. This allows you to send them back there 
    // after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;