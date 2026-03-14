import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSavesApi,
  createSaveApi,
  updateSaveApi,
  deleteSaveApi,
} from "../services/saves.service";

export const useSaves = (params = {}) => {
  return useQuery({
    queryKey: ["saves", params.type, params.search, params.isFavorite, params.isArchived],
    queryFn: () => getSavesApi(params),
    select: (data) => data.data,
    staleTime: 1000 * 10, // ← keep data fresh 2 mins, no background refetch
  });
};

export const useCreateSave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSaveApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saves"] });
      queryClient.invalidateQueries({ queryKey: ["saves-by-tag"] });
      queryClient.invalidateQueries({ queryKey: ["collection"] });
    },
  });
};

export const useUpdateSave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSaveApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saves"] });
      queryClient.invalidateQueries({ queryKey: ["saves-by-tag"] });
      queryClient.invalidateQueries({ queryKey: ["collection"] });
    },
  });
};

export const useDeleteSave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSaveApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saves"] });
      queryClient.invalidateQueries({ queryKey: ["saves-by-tag"] });
      queryClient.invalidateQueries({ queryKey: ["collection"] });
    },
  });
};
