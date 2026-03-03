import { useState, useEffect, useCallback } from "react";
import { createContext } from "react";
import { getMeApi } from "./services/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const handleGetMe = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMeApi();
      setUser(response.user);
    } catch (error) {
      setError(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetMe();
  }, [handleGetMe]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        error,
        setError,
        handleGetMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
