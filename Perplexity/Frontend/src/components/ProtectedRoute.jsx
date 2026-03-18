import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectIsInitializing } from "../features/auth/auth.slice";

function InitSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-7 h-7 border-2 border-white/10 border-t-[#00d4aa] rounded-full animate-spin" />
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitializing  = useSelector(selectIsInitializing);

  if (isInitializing)   return <InitSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export function PublicOnlyRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitializing  = useSelector(selectIsInitializing);

  if (isInitializing) return <InitSpinner />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}
