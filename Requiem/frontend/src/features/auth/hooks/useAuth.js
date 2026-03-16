import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginApi, registerApi, logoutApi } from "../services/auth.service";
import useAuthStore from "../store/auth.store";

export const useLogin = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setUser(data.data.user);
      navigate("/");
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      navigate("/login");
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      clearAuth(); // Reset the store immediately, even if logoutApi fails (e.g. 401 already)
      navigate("/login");
    },
  });
};
