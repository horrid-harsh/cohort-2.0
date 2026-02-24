import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Feed from "./features/post/pages/Feed";
import { ProtectedRoute, PublicRoute } from "./features/auth/components/Guards";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Feed />
      </ProtectedRoute>
    ),
  },
]);
