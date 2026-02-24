import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * ProtectedRoute
 * Only allows access if the user is authenticated.
 * Otherwise, redirects to the login page.
 */
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#0C1014",
        }}
      >
        <div style={{ color: "#fff" }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * PublicRoute
 * Only allows access if the user is NOT authenticated.
 * If logged in, redirects to the home page (feed).
 * Useful for Login and Register pages.
 */
export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#0C1014",
        }}
      >
        <div style={{ color: "#fff" }}>Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};
