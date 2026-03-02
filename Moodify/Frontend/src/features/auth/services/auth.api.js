import axios from "axios";

export const authApi = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true,
});

export const registerApi = async (userData) => {
    const response = await authApi.post(`/register`, userData);
    return response.data;
}