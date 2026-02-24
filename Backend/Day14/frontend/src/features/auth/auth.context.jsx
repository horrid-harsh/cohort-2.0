import { createContext, useState, useEffect } from "react";
import { getMeApi } from "./services/auth.api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start as true for initial check

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getMeApi();
        setUser(response.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
