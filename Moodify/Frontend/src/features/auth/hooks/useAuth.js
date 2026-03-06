import { useContext } from "react";
import {
  registerApi,
  loginApi,
  forgotPasswordApi,
  resetPasswordApi,
  loginWithGoogle,
  logoutApi,
} from "../services/auth.api";
import AuthContext from "../auth.context";

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, setUser, loading, setLoading, error, setError } = context;

  const handleRegisterUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerApi(userData);
      console.log("Response from registerApi(useAuth.js) : ", response);
      setUser(response.user);
      return response;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLoginUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginApi(userData);
      console.log("Response from loginApi(useAuth.js) : ", response);
      setUser(response.user);
      return response;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordUser = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await forgotPasswordApi(email);
      console.log("Response from forgotPasswordApi(useAuth.js) : ", response);
      return response;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordUser = async (token, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await resetPasswordApi(token, password);
      console.log("Response from resetPasswordApi(useAuth.js) : ", response);
      return response;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  const handleLogoutUser = async () => {
    try {
      await logoutApi();
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    loading,
    error,
    user,
    setUser,
    handleRegisterUser,
    handleLoginUser,
    handleForgotPasswordUser,
    handleResetPasswordUser,
    handleGoogleLogin,
    handleLogoutUser,
  };
};

export default useAuth;
