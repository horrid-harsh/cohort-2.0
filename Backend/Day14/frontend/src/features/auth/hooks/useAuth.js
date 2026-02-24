import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import {
  loginApi,
  registerApi,
  getMeApi,
  logoutApi,
} from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async (identifier, password) => {
    setLoading(true);
    try {
      const response = await loginApi(identifier, password);
      setUser(response.user);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await registerApi(username, email, password);
      setUser(response.user);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutApi();
      setUser(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
