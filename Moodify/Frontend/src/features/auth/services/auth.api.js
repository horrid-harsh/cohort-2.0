import api from "../../shared/services/api";

export const registerApi = async (userData) => {
  const response = await api.post(`/auth/register`, userData);
  return response.data;
};

export const loginApi = async (userData) => {
  const response = await api.post(`/auth/login`, userData);
  return response.data;
};

export const getMeApi = async () => {
  const response = await api.get(`/auth/me`);
  return response.data;
};

export const forgotPasswordApi = async (email) => {
  const response = await api.post(`/auth/forgot-password`, { email });
  return response.data;
};

export const resetPasswordApi = async (token, password) => {
  const response = await api.post(`/auth/reset-password/${token}`, {
    password,
  });
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post(`/auth/logout`);
  return response.data;
};

export const loginWithGoogle = () => {
  window.location.href = `http://localhost:3000/api/auth/google`;
};
