import axios from "axios";

export const userApi = axios.create({
  baseURL: "http://localhost:3000/api/users",
  withCredentials: true,
});

export const updateProfileApi = async (formData) => {
  try {
    const response = await userApi.patch("/update-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Profile update API error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getUserProfileApi = async (username) => {
  try {
    const response = await userApi.get(`/profile/${username}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getFollowersApi = async (username) => {
  try {
    const response = await userApi.get(`/followers/${username}`);
    return response.data.followers;
  } catch (error) {
    console.error("Fetch followers API error:", error);
    throw error;
  }
};

export const getFollowingApi = async (username) => {
  try {
    const response = await userApi.get(`/following/${username}`);
    return response.data.following;
  } catch (error) {
    console.error("Fetch following API error:", error);
    throw error;
  }
};
