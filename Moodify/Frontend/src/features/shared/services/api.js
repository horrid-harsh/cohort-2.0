import axios from "axios";

const api = axios.create({
  baseURL: "/api",
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

api.interceptors.response.use(
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
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use raw axios call to avoid the interceptor loop
        await axios.post("/api/auth/refresh", {}, { withCredentials: true });

        isRefreshing = false;
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);

        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes("/login")) {
          // You might want to clear user context here, but at minimum we redirect
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
