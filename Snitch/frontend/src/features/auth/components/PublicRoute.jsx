import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { selectIsAuthenticated, selectUser, selectAuthLoading } from "../state/auth.slice";

const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectAuthLoading);

  if (isLoading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    // If they are already logged in, send them to dashboard if they are a seller
    if (user?.role === "seller") {
      return <Navigate to="/seller/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
