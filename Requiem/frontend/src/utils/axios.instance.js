import axios from "axios";
import useAuthStore from "../features/auth/store/auth.store";
import { config } from "../config/config.js";

export const BASE_URL = config.apiBaseUrl;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

// 🔹 RESPONSE INTERCEPTOR (auto refresh tokens)
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip if no response or if it's already a retry
    if (!error.response || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 401 error means unauthorized (expired access token)
    if (error.response.status === 401) {
      // Don't intercept refresh or login requests to avoid loops
      if (
        originalRequest.url.includes("/auth/refresh") ||
        originalRequest.url.includes("/auth/login")
      ) {
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use raw axios call to avoid the interceptor loop
        await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        isRefreshing = false;
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);

        // Clear user context on refresh failure
        useAuthStore.setState({ user: null });

        // Only redirect if we're not already on the login page AND not on other public auth pages
        const publicPaths = [
          "/login",
          "/register",
          "/verify-email",
          "/forgot-password",
          "/reset-password"
        ];
        const isPublicPath = publicPaths.some((path) =>
          window.location.pathname.startsWith(path),
        );

        if (!isPublicPath) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
