import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { fetchCurrentUser } from "../features/auth/auth.slice.js";
import AppRoutes from "./app.routes.jsx";

function AppContent() {
  const dispatch = useDispatch();

  // Restore session from cookie on every cold load
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return <AppRoutes />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
