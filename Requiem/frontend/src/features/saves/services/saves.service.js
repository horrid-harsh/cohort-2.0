import axiosInstance from "../../../utils/axios.instance";

export const getSavesApi = async (params = {}) => {
  const res = await axiosInstance.get("/saves", { params });
  return res.data;
};

export const createSaveApi = async (data) => {
  const res = await axiosInstance.post("/saves", data);
  return res.data;
};

export const updateSaveApi = async ({ id, ...data }) => {
  const res = await axiosInstance.patch(`/saves/${id}`, data);
  return res.data;
};

export const deleteSaveApi = async (id) => {
  const res = await axiosInstance.delete(`/saves/${id}`);
  return res.data;
};
