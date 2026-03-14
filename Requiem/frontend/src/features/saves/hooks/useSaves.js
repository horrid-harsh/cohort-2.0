import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSavesApi,
  createSaveApi,
  updateSaveApi,
  deleteSaveApi,
} from "../services/saves.service";

export const useSaves = (params = {}) => {
  return useQuery({
    queryKey: ["saves", params.type, params.search],
    queryFn: () => getSavesApi(params),
    select: (data) => data.data,
    staleTime: 1000 * 60 * 2, // ← keep data fresh 2 mins, no background refetch
    placeholderData: (prev) => prev, // ← keep showing OLD data while new data loads
  });
};

export const useCreateSave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSaveApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saves"] });
    },
  });
};

export const useUpdateSave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSaveApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saves"] });
    },
  });
};

export const useDeleteSave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSaveApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saves"] });
    },
  });
};
