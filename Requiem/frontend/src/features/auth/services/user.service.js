import axiosInstance from "../../../utils/axios.instance";

/**
 * Upload or Update User Avatar
 * @param {File} file - Image file to upload
 */
export const uploadAvatarApi = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await axiosInstance.patch("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/**
 * Delete User Avatar
 */
export const deleteAvatarApi = async () => {
  const res = await axiosInstance.delete("/users/avatar");
  return res.data;
};
