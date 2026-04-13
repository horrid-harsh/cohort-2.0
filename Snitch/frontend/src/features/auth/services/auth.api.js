import axiosInstance from "../../../lib/axios";

// All functions return response.data (the ApiResponse shape from backend)
// Error handling is done in the hook layer via try/catch

export const registerUser = (data) =>
  axiosInstance.post("/auth/register", data).then((r) => r.data);

export const loginUser = (data) =>
  axiosInstance.post("/auth/login", data).then((r) => r.data);

export const logoutUser = () =>
  axiosInstance.post("/auth/logout").then((r) => r.data);

export const getMe = () => axiosInstance.get("/auth/me").then((r) => r.data);

export const refreshToken = () =>
  axiosInstance.post("/auth/refresh-token").then((r) => r.data);

export const verifyEmail = (token) =>
  axiosInstance.get(`/auth/verify-email?token=${token}`).then((r) => r.data);

export const resendVerification = (email) =>
  axiosInstance
    .post("/auth/resend-verification", { email })
    .then((r) => r.data);

export const forgotPassword = (email) =>
  axiosInstance.post("/auth/forgot-password", { email }).then((r) => r.data);

export const resetPassword = (data) =>
  axiosInstance.post("/auth/reset-password", data).then((r) => r.data);

export const changePassword = (data) =>
  axiosInstance.patch("/auth/change-password", data).then((r) => r.data);
