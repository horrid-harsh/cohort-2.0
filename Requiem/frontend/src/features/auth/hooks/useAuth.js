import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginApi, registerApi, logoutApi } from "../services/auth.service";
import useAuthStore from "../store/auth.store";

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.accessToken);
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
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      clearAuth();
      navigate("/login");
    },
  });
};
