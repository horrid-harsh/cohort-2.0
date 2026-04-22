import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import { selectIsAuthenticated, selectUser, selectAuthLoading } from "../state/auth.slice";
import Loader from "../../shared/Loader";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectAuthLoading);
  const location = useLocation();

  if (isLoading) {
    return <Loader text="Verifying Gallery Access..." />;
  }

  console.log(isAuthenticated);
  console.log(user);
  console.log(allowedRoles);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
