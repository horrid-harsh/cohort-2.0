import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../features/auth/store/auth.store";

// Pages
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";

// Protected route wrapper
const ProtectedRoute = () => {
  const { user } = useAuthStore();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// Public route wrapper (redirect to home if already logged in)
const PublicRoute = () => {
  const { user } = useAuthStore();
  return !user ? <Outlet /> : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/", element: <DashboardPage /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

const Router = () => <RouterProvider router={router} />;
export default Router;
