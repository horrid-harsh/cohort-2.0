import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  registerUser,
  logoutUser,
  clearError,
  clearSuccessMessage,
  selectUser,
  selectIsAuthenticated,
  selectIsInitializing,
  selectAuthLoading,
  selectAuthError,
  selectSuccessMessage,
} from "../auth.slice.js";

/**
 * useAuth — state + async dispatchers only.
 *
 * Navigation is intentionally excluded.
 * Components call these functions, then handle navigation
 * in their own try/catch after .unwrap() resolves.
 *
 * This keeps the hook pure and testable.
 */
export function useAuth() {
  const dispatch = useDispatch();

  return {
    // ── State ──────────────────────────────────────────────
    user:           useSelector(selectUser),
    isAuthenticated:useSelector(selectIsAuthenticated),
    isInitializing: useSelector(selectIsInitializing),
    isLoading:      useSelector(selectAuthLoading),
    error:          useSelector(selectAuthError),
    successMessage: useSelector(selectSuccessMessage),

    // ── Dispatchers ────────────────────────────────────────
    // Returns the unwrapped promise so components can await + navigate
    login:    (data) => dispatch(loginUser(data)).unwrap(),
    register: (data) => dispatch(registerUser(data)).unwrap(),
    logout:   ()     => dispatch(logoutUser()).unwrap(),

    // ── Cleanup ────────────────────────────────────────────
    clearError:          () => dispatch(clearError()),
    clearSuccessMessage: () => dispatch(clearSuccessMessage()),
  };
}
