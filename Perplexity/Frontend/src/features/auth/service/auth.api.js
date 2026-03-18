import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const authApi = axios.create({
  baseURL: `${API_BASE}/auth`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const authService = {
  register: (data) => authApi.post("/register", data),
  login: (data) => authApi.post("/login", data),
  logout: () => authApi.post("/logout"),
  getMe: () => authApi.get("/get-me"),
};
