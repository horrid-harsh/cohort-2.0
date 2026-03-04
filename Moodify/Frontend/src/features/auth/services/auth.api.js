import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
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

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      // Don't intercept refresh or login requests to avoid loops
      if (
        originalRequest.url.includes("/refresh") ||
        originalRequest.url.includes("/login")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => authApi(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use an independent axios call to refresh to avoid the interceptor
        await axios.post(
          "http://localhost:3000/api/auth/refresh",
          {},
          { withCredentials: true },
        );

        isRefreshing = false;
        processQueue(null);
        return authApi(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);

        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const registerApi = async (userData) => {
  const response = await authApi.post(`/register`, userData);
  return response.data;
};

export const loginApi = async (userData) => {
  const response = await authApi.post(`/login`, userData);
  return response.data;
};

export const getMeApi = async () => {
  const response = await authApi.get(`/me`);
  return response.data;
};

export const forgotPasswordApi = async (email) => {
  const response = await authApi.post(`/forgot-password`, { email });
  return response.data;
};

export const resetPasswordApi = async (token, password) => {
  const response = await authApi.post(`/reset-password/${token}`, { password });
  return response.data;
};

export const loginWithGoogle = () => {
  window.location.href = `http://localhost:3000/api/auth/google`;
};
