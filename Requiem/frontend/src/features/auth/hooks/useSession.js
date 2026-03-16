import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axios.instance";
import useAuthStore from "../store/auth.store";

export const useSession = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const query = useQuery({
    queryKey: ["session"],
    queryFn: () => axiosInstance.get("/auth/me"),
    retry: false,
    staleTime: Infinity, // don't refetch session automatically
  });

  useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data?.data?.data);
    }
    if (query.isError) {
      clearAuth();
    }
  }, [query.isSuccess, query.isError]);

  return {
    isLoading: query.isPending,
    user: query.data?.data?.data || null,
    isError: query.isError,
  };
};