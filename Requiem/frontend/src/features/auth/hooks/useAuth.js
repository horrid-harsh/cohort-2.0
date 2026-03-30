import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  loginApi,
  registerApi,
  logoutApi,
  verifyEmailApi,
  resendVerificationApi,
  forgotPasswordApi,
  resetPasswordApi,
} from "../services/auth.service";
import useAuthStore from "../store/auth.store";

export const useLogin = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setUser(data.user);
      navigate("/");
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};

export const useVerifyEmail = (token) => {
  return useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => verifyEmailApi(token),
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: (email) => resendVerificationApi(email),
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      queryClient.clear(); // ☢️ NUKE THE CACHE! (Prevents data leak between accounts)
      clearAuth(); // Reset the store immediately
      navigate("/login");
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email) => forgotPasswordApi(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data) => resetPasswordApi(data),
  });
};
