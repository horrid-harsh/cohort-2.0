import axios from "axios";

export const authApi = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

export const registerApi = async (username, email, password) => {
  try {
    const response = await authApi.post("/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const loginApi = async (identifier, password) => {
  try {
    const response = await authApi.post("/login", {
      identifier,
      password,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getMeApi = async () => {
  try {
    const response = await authApi.get("/me");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
