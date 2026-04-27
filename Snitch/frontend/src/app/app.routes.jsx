import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import EmailSent from "../features/auth/pages/EmailSent";
import VerifyEmail from "../features/auth/pages/VerifyEmail";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import AddProduct from "../features/products/pages/AddProduct";
import SellerDashboard from "../features/products/pages/SellerDashboard";
import Logout from "../features/auth/pages/Logout";
import Home from "../features/home/pages/Home";
import NewArrivals from "../features/products/pages/NewArrivals";
import ProductListing from "../features/products/pages/ProductListing";
import ProductDetails from "../features/products/pages/ProductDetails";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import PublicRoute from "../features/auth/components/PublicRoute";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/new-arrivals",
    element: <NewArrivals />,
  },
  {
    path: "/shop",
    element: <ProductListing />,
  },
  {
    path: "/product/:productId",
    element: <ProductDetails />,
  },
  {
    path: "/logout",
    element: <Logout />,
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
