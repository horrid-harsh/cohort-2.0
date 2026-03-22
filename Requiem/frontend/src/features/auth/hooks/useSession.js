import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMeApi } from "../services/auth.service";
import useAuthStore from "../store/auth.store";

export const useSession = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const query = useQuery({
    queryKey: ["session"],
    queryFn: getMeApi,
    retry: false,
    staleTime: Infinity, // don't refetch session automatically
  });

  useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data);
    }
    if (query.isError) {
      // Only clear auth on actual unauthorized/forbidden errors (401, 403)
      // Do NOT clear on 429 (Rate Limit) or other network errors
      const status = query.error?.response?.status;
      if (status === 401 || status === 403) {
        clearAuth();
      }
    }
  }, [query.isSuccess, query.isError]);

  return {
    isLoading: query.isPending,
    user: query.data || null,
    isError: query.isError,
  };
};