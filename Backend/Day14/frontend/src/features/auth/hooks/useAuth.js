import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { loginApi, registerApi, getMeApi } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;

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
    
    //   useEffect(() => {
    //     checkAuth();
    //   }, []);
    
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
    
    return { 
        user, loading, handleLogin, handleRegister, checkAuth
    };
}