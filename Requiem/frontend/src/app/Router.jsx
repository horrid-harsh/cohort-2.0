import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../features/auth/store/auth.store";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import FavoritesPage from "../pages/FavoritesPage";
import ArchivePage from "../pages/ArchivePage";
import CollectionPage from "../pages/CollectionPage";
import TagPage from "../pages/TagPage";

const ProtectedRoute = () => {
  const { user } = useAuthStore();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

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
      { path: "/favorites", element: <FavoritesPage /> },
      { path: "/archive", element: <ArchivePage /> },
      { path: "/collections/:id", element: <CollectionPage /> },
      { path: "/tags/:id", element: <TagPage /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

const Router = () => <RouterProvider router={router} />;
export default Router;
