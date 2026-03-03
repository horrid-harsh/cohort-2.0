import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

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
