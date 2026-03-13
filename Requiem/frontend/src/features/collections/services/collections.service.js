import axiosInstance from "../../../utils/axios.instance";

export const getCollectionsApi = async () => {
  const res = await axiosInstance.get("/collections");
  return res.data;
};

export const createCollectionApi = async (data) => {
  const res = await axiosInstance.post("/collections", data);
  return res.data;
};

export const deleteCollectionApi = async (id) => {
  const res = await axiosInstance.delete(`/collections/${id}`);
  return res.data;
};
