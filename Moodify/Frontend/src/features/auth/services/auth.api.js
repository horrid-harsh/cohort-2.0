import axios from "axios";

const authApi = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true,
});

export const registerApi = async (userData) => {
    const response = await authApi.post(`/register`, userData);
    return response.data;
}

export const loginApi = async (userData) => {
    const response = await authApi.post(`/login`, userData);
    return response.data;
}
