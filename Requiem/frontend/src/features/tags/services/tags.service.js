import axiosInstance from "../../../utils/axios.instance";

export const getTagsApi = async () => {
  const res = await axiosInstance.get("/tags");
  return res.data;
};

export const createTagApi = async (data) => {
  const res = await axiosInstance.post("/tags", data);
  return res.data;
};

export const deleteTagApi = async (id) => {
  const res = await axiosInstance.delete(`/tags/${id}`);
  return res.data;
};
