import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Loader from '../Loader/Loader';

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const authStatus = localStorage.getItem('isAdminloggedIn') === 'true';
      setIsLoggedIn(authStatus);
      setLoading(false);
    }, 1000); // 1-second delay for loader effect

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return isLoggedIn ? children : <Navigate to="/" />;
};

export default PrivateRoute;
