import axiosInstance from "../../../utils/axios.instance";

export const getCollectionsApi = async () => {
  const res = await axiosInstance.get("/collections");
  return res.data.data;
};

export const getCollectionByIdApi = async (id) => {
  const res = await axiosInstance.get(`/collections/${id}`);
  return res.data.data;
};

export const createCollectionApi = async (data) => {
  const res = await axiosInstance.post("/collections", data);
  return res.data.data;
};

export const updateCollectionApi = async ({ id, ...data }) => {
  const res = await axiosInstance.patch(`/collections/${id}`, data);
  return res.data.data;
};

export const deleteCollectionApi = async (id) => {
  const res = await axiosInstance.delete(`/collections/${id}`);
  return res.data.data;
};

export const addSaveToCollectionApi = async ({ collectionId, saveId }) => {
  const res = await axiosInstance.patch(`/collections/${collectionId}/saves/${saveId}`);
  return res.data.data;
};

export const removeSaveFromCollectionApi = async ({ collectionId, saveId }) => {
  const res = await axiosInstance.delete(`/collections/${collectionId}/saves/${saveId}`);
  return res.data.data;
};
