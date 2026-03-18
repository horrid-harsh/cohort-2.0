import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "./service/auth.api.js";

// ── Thunks ────────────────────────────────────────────────────────────────────
// Each thunk only calls the service and delegates error handling to rejectWithValue.

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await authService.register(userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await authService.login(credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authService.getMe();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Session expired");
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitializing: true, // true until fetchCurrentUser resolves on app boot
    error: null,
    successMessage: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSuccessMessage: (state) => { state.successMessage = null; },
  },
  extraReducers: (builder) => {
    // ── Register ──────────────────────────────────────────
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ── Login ─────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ── Logout ────────────────────────────────────────────
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });

    // ── Fetch current user (app init session restore) ─────
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isInitializing = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        // Not an error worth showing — just means no active session
        state.isInitializing = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError, clearSuccessMessage } = authSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsInitializing = (state) => state.auth.isInitializing;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectSuccessMessage = (state) => state.auth.successMessage;

export default authSlice.reducer;
