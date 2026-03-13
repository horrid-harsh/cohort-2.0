import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCollectionsApi,
  createCollectionApi,
  deleteCollectionApi,
} from "../services/collections.service";

export const useCollections = () => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: getCollectionsApi,
    select: (data) => data.data,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCollectionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCollectionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
};
