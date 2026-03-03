import { useContext } from "react";
import { registerApi, loginApi } from "../services/auth.api";
import AuthContext from "../auth.context";

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, setUser, loading, setLoading, error, setError } = context;

  const registerUser = async (userData) => {
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

  const loginUser = async (userData) => {
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

  return {
    loading,
    error,
    user,
    registerUser,
    loginUser,
    setUser,
  };
};

export default useAuth;
