import axiosInstance from "../../../utils/axios.instance";

export const getGraphApi = async () => {
  const res = await axiosInstance.get("/graph");
  return res.data.data;
};

export const getClustersApi = async () => {
  const res = await axiosInstance.get("/clusters");
  return res.data.data;
};
