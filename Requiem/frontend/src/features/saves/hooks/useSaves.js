import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSavesApi,
  createSaveApi,
  updateSaveApi,
  deleteSaveApi,
} from "../services/saves.service";

export const LIMIT = 8;

export const useSaves = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ["saves", params.type, params.search, params.isFavorite, params.isArchived, params.semantic],
    queryFn: ({ pageParam = 1 }) =>
      getSavesApi({ ...params, page: pageParam, limit: LIMIT }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination || {};
      return page < totalPages ? page + 1 : undefined;
    },
    select: (data) => ({
      saves: data.pages.flatMap((p) => p.data.saves),
      pagination: data.pages[data.pages.length - 1]?.data?.pagination,
    }),
    staleTime: 1000 * 10,
    refetchOnWindowFocus: "always",
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
      queryClient.invalidateQueries({ queryKey: ["tags"] });
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
      queryClient.invalidateQueries({ queryKey: ["tags"] });
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
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};