import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

// 🔹 RESPONSE INTERCEPTOR (auto refresh tokens)
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      try {

        // call refresh endpoint
        await axios.post(
          "http://localhost:3000/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        // retry original request
        return authApi(originalRequest);

      } catch (err) {

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
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
