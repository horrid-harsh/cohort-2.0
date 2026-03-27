import { useMutation } from "@tanstack/react-query";
import { uploadAvatarApi, deleteAvatarApi } from "../services/user.service";
import useAuthStore from "../store/auth.store";
import toast from "react-hot-toast";

export const useUploadAvatar = () => {
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: uploadAvatarApi,
    onSuccess: (data) => {
      // Assuming backend returns the updated user or avatar data
      // If result is { success: true, data: { avatarUrl: "...", avatar: "..." } }
      const avatarUrl = data.data?.avatarUrl || data.data?.avatar;
      updateUser({ avatar: avatarUrl, avatarUrl: avatarUrl });
      toast.success("Avatar updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to upload avatar");
    },
  });
};

export const useDeleteAvatar = () => {
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: deleteAvatarApi,
    onSuccess: () => {
      updateUser({ avatar: "", avatarUrl: "" });
      toast.success("Avatar deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete avatar");
    },
  });
};
