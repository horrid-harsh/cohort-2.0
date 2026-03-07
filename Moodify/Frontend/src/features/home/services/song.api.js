import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/song",
  withCredentials: true,
});

export const getSongsApi = async (mood) => {
  const response = await api.get(`?mood=${mood}`);
  return response.data;
};

export const uploadSongApi = async (formData) => {
  const response = await api.post("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
