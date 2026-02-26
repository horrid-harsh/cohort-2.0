import axios from "axios";

export const userApi = axios.create({
  baseURL: "http://localhost:3000/api/users",
  withCredentials: true,
});

export const updateProfileApi = async (formData) => {
  try {
    console.log(
      "DEBUG: Sending profile update request...",
      Array.from(formData.entries()),
    );
    const response = await userApi.patch("/update-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "DEBUG: Profile update API error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
