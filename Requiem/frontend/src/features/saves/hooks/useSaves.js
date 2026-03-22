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
      const { page, totalPages } = lastPage.pagination || {};
      return page < totalPages ? page + 1 : undefined;
    },
    select: (data) => ({
      saves: data.pages.flatMap((p) => p.saves),
      pagination: data.pages[data.pages.length - 1]?.pagination,
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
    // Optimistic Update
    onMutate: async (updatedSave) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["saves"] });
      await queryClient.cancelQueries({ queryKey: ["save", updatedSave.id] });

      // Snapshot previous values
      const prevSaves = queryClient.getQueryData(["saves"]);
      const prevSaveDetail = queryClient.getQueryData(["save", updatedSave.id]);

      // Optimistically update individual save detail
      if (prevSaveDetail) {
        queryClient.setQueryData(["save", updatedSave.id], {
          ...prevSaveDetail,
          ...updatedSave,
        });
      }

      // Optimistically update the infinite list
      queryClient.setQueriesData({ queryKey: ["saves"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            saves: page.saves.map((s) =>
              s._id === updatedSave.id ? { ...s, ...updatedSave } : s
            ),
          })),
        };
      });

      return { prevSaves, prevSaveDetail };
    },
    // Rollback on error
    onError: (err, updatedSave, context) => {
      if (context?.prevSaveDetail) {
        queryClient.setQueryData(["save", updatedSave.id], context.prevSaveDetail);
      }
      if (context?.prevSaves) {
        queryClient.setQueryData(["saves"], context.prevSaves);
      }
    },
    // Refetch on settled
    onSettled: (data, err, updatedSave) => {
      queryClient.invalidateQueries({ queryKey: ["saves"] });
      queryClient.invalidateQueries({ queryKey: ["save", updatedSave.id] });
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