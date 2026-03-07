import api from "../../shared/services/api";

export const getSongsApi = async (mood) => {
  const response = await api.get(`/song?mood=${mood}`);
  return response.data;
};

export const uploadSongApi = async (formData) => {
  const response = await api.post("/song", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
