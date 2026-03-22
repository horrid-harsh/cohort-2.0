import axiosInstance from "../../../utils/axios.instance";

export const getTagsApi = async () => {
  const res = await axiosInstance.get("/tags");
  return res.data.data;
};

export const createTagApi = async (data) => {
  const res = await axiosInstance.post("/tags", data);
  return res.data.data;
};

export const updateTagApi = async ({ id, ...data }) => {
  const res = await axiosInstance.patch(`/tags/${id}`, data);
  return res.data.data;
};

export const deleteTagApi = async (id) => {
  const res = await axiosInstance.delete(`/tags/${id}`);
  return res.data.data;
};

export const addTagToSaveApi = async ({ tagId, saveId }) => {
  const res = await axiosInstance.patch(`/tags/${tagId}/saves/${saveId}`);
  return res.data.data;
};

export const removeTagFromSaveApi = async ({ tagId, saveId }) => {
  const res = await axiosInstance.delete(`/tags/${tagId}/saves/${saveId}`);
  return res.data.data;
};
