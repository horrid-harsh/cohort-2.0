import React from 'react'
import useAuth from '../hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'

const Protected = ({ children }) => {

  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default Protected