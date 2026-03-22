import axiosInstance from "../../../utils/axios.instance";

export const getSavesApi = async (params = {}) => {
  const res = await axiosInstance.get("/saves", { params });
  return res.data.data;
};

export const createSaveApi = async (data) => {
  const res = await axiosInstance.post("/saves", data);
  return res.data.data;
};

export const getSaveByIdApi = async (id) => {
  const res = await axiosInstance.get(`/saves/${id}`);
  return res.data.data;
};

export const updateSaveApi = async ({ id, ...data }) => {
  const res = await axiosInstance.patch(`/saves/${id}`, data);
  return res.data.data;
};

export const deleteSaveApi = async (id) => {
  const res = await axiosInstance.delete(`/saves/${id}`);
  return res.data.data;
};

export const getRelatedSavesApi = async (id) => {
  const res = await axiosInstance.get(`/saves/${id}/related`);
  return res.data.data;
};

export const getResurfaceSaveApi = async () => {
  const res = await axiosInstance.get(`/saves/resurface`);
  return res.data.data;
};
