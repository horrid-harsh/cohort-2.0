import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  setUser,
  setLoading,
  clearAuth,
  selectIsAuthenticated,
  selectAuthLoading,
  selectUser,
} from "../state/auth.slice";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} from "../services/auth.api";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const isLoading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // ─── Map backend 422 field errors back to RHF fields ────────────────────────
  // Backend sends: { errors: { name: "msg", email: "msg" } }
  const applyServerFieldErrors = (errors, setError) => {
    if (!errors || typeof errors !== "object") return;
    Object.entries(errors).forEach(([field, message]) => {
      setError(field, { type: "server", message });
    });
  };

  // ─── Register ────────────────────────────────────────────────────────────────
  const handleRegister = async (data, setError) => {
    setServerError(null);
    dispatch(setLoading(true));
    try {
      await registerUser(data);
      // Registration doesn't log in — user must verify email first
      navigate("/verify-email-sent", { state: { email: data.email } });
    } catch (err) {
      const res = err.response?.data;
      if (res?.statusCode === 422 && res?.errors) {
        applyServerFieldErrors(res.errors, setError);
      } else {
        setServerError(
          res?.message || "Something went wrong. Please try again.",
        );
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ─── Login ───────────────────────────────────────────────────────────────────
  const handleLogin = async (data, setError) => {
    setServerError(null);
    dispatch(setLoading(true));
    try {
      const res = await loginUser(data);
      dispatch(setUser(res.data.user));
      navigate("/");
    } catch (err) {
      const res = err.response?.data;
      if (res?.statusCode === 422 && res?.errors) {
        applyServerFieldErrors(res.errors, setError);
      } else {
        setServerError(
          res?.message || "Invalid credentials. Please try again.",
        );
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ─── Logout ──────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    dispatch(setLoading(true));
    try {
      await logoutUser();
    } catch {
      // Even if API call fails, clear local state
    } finally {
      dispatch(clearAuth());
      navigate("/login");
    }
  };

  // ─── Verify Email ────────────────────────────────────────────────────────────
  const handleVerifyEmail = async (token) => {
    dispatch(setLoading(true));
    setServerError(null);
    try {
      const res = await verifyEmail(token);
      return { success: true, message: res.message };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Verification failed. Link may be expired.";
      setServerError(msg);
      return { success: false, message: msg };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ─── Resend Verification ─────────────────────────────────────────────────────
  const handleResendVerification = async (email) => {
    dispatch(setLoading(true));
    setServerError(null);
    try {
      const res = await resendVerification(email);
      return { success: true, message: res.message };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend email.";
      setServerError(msg);
      return { success: false, message: msg };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ─── Forgot Password ──────────────────────────────────────────────────────────
  const handleForgotPassword = async (email) => {
    dispatch(setLoading(true));
    setServerError(null);
    try {
      const res = await forgotPassword(email);
      return { success: true, message: res.message };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send reset link.";
      setServerError(msg);
      return { success: false, message: msg };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ─── Reset Password ───────────────────────────────────────────────────────────
  const handleResetPassword = async (data, setError) => {
    dispatch(setLoading(true));
    setServerError(null);
    try {
      const res = await resetPassword(data);
      return { success: true, message: res.message };
    } catch (err) {
      const res = err.response?.data;
      if (res?.statusCode === 422 && res?.errors) {
        applyServerFieldErrors(res.errors, setError);
      } else {
        const msg =
          res?.message || "Failed to reset password. Link may be expired.";
        setServerError(msg);
      }
      return { success: false };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ─── Fetch current user (on app boot) ────────────────────────────────────────
  const fetchMe = async () => {
    dispatch(setLoading(true));
    try {
      const res = await getMe();
      dispatch(setUser(res.data));
    } catch {
      dispatch(clearAuth());
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ─── Listen for session expiry from axios interceptor ────────────────────────
  useEffect(() => {
    const handleExpiry = () => {
      dispatch(clearAuth());
      // We DO NOT navigate to login here. 
      // AuthInitializer handles setting state to null, 
      // and ProtectedRoute will handle redirecting only if the user 
      // is on a restricted page. This allows guests to visit the Home page.
    };
    window.addEventListener("auth:session-expired", handleExpiry);
    return () =>
      window.removeEventListener("auth:session-expired", handleExpiry);
  }, [dispatch, navigate]);

  return {
    user,
    isAuthenticated,
    isLoading,
    serverError,
    handleRegister,
    handleLogin,
    handleLogout,
    handleVerifyEmail,
    handleResendVerification,
    handleForgotPassword,
    handleResetPassword,
    fetchMe,
  };
};
