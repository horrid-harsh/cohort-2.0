import axiosInstance from "../../../utils/axios.instance";

export const registerApi = async (data) => {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data.data;
};

export const loginApi = async (data) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data.data;
};

export const logoutApi = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data.data;
};

export const getMeApi = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data.data;
};

export const verifyEmailApi = async (token) => {
  const res = await axiosInstance.get(`/auth/verify-email?token=${token}`);
  return res.data.data;
};

export const resendVerificationApi = async (email) => {
  const res = await axiosInstance.post("/auth/resend-verification", { email });
  return res.data.data;
};

export const forgotPasswordApi = async (email) => {
  const res = await axiosInstance.post("/auth/forgot-password", { email });
  return res.data.data;
};

export const resetPasswordApi = async (data) => {
  const res = await axiosInstance.post("/auth/reset-password", data);
  return res.data.data;
};
