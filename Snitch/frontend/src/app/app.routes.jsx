import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import EmailSent from "../features/auth/pages/EmailSent";
import VerifyEmail from "../features/auth/pages/VerifyEmail";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import AddProduct from "../features/products/pages/AddProduct";
import SellerDashboard from "../features/products/pages/SellerDashboard";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import PublicRoute from "../features/auth/components/PublicRoute";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <h1>Home</h1>,
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
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/verify-email-sent",
    element: <EmailSent />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/seller/add-product",
    element: (
      <ProtectedRoute allowedRoles={["seller"]}>
        <AddProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: "/seller/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["seller"]}>
        <SellerDashboard />
      </ProtectedRoute>
    ),
  },
]);
