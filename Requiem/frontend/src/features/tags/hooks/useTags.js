import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTagsApi, createTagApi, deleteTagApi } from "../services/tags.service";

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: getTagsApi,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTagApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTagApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};
