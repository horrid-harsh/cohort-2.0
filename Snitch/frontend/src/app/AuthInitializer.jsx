import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "../features/auth/state/auth.slice";
import { getMe } from "../features/auth/services/auth.api";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch(setLoading(true));
      try {
        const response = await getMe();
        // response is the ApiResponse shape { success, data, message }
        if (response.success) {
          dispatch(setUser(response.data));
        } else {
          dispatch(setUser(null));
        }
      } catch (err) {
        // If 401 or other error, user is not logged in
        dispatch(setUser(null));
        // We don't dispatch setError here because it's not a "functional" error, 
        // just a guest user or expired session.
      } finally {
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000); // Small delay to appreciate the animation :)
      }
    };

    initializeAuth();

    // Listen for session expiration from axios interceptor
    const handleSessionExpired = () => {
      dispatch(setUser(null));
      dispatch(setLoading(false));
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [dispatch]);

  return children;
};

export default AuthInitializer;
