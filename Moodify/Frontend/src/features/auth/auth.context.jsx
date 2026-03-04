import { useState, useEffect, useCallback } from "react";
import { createContext } from "react";
import { getMeApi } from "./services/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true); // Specific for initial load
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const handleGetMe = useCallback(async (initial = false) => {
    if (initial) setIsInitializing(true);
    else setLoading(true);

    try {
      const response = await getMeApi();
      setUser(response.user);
    } catch (error) {
      setError(error);
      setUser(null);
    } finally {
      if (initial) setIsInitializing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetMe(true);
  }, [handleGetMe]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        isInitializing,
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
