import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hook/useAuth.js";
import AuthLayout from "../../../components/layouts/AuthLayout.jsx";
import {
  Alert, FormField, InputWrapper, SubmitButton, inputClass,
  MailIcon, LockIcon, EyeOpenIcon, EyeClosedIcon,
} from "../../../components/ui/AuthUI.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const onSubmit = async (data) => {
    try {
      clearError();
      await login(data);         // .unwrap() is called inside useAuth
      navigate("/dashboard");    // only runs on success
    } catch {
      // error is already in Redux state via rejectWithValue — nothing to do here
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-display text-[1.6rem] font-bold tracking-tight text-[#f0f0ee] leading-tight mb-1">
        Welcome back
      </h1>
      <p className="text-sm text-gray-500 font-light mb-7">
        Sign in to continue your research
      </p>

      <Alert type="error" message={error} />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">

        {/* Email */}
        <FormField label="Email" error={errors.email?.message}>
          <InputWrapper icon={<MailIcon />}>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
              })}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
              className={inputClass}
            />
          </InputWrapper>
        </FormField>

        {/* Password */}
        <FormField label="Password" error={errors.password?.message}>
          <InputWrapper
            icon={<LockIcon />}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-600 hover:text-gray-400 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            }
          >
            <input
              {...register("password", { required: "Password is required" })}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`${inputClass} pr-10`}
            />
          </InputWrapper>
        </FormField>

        <SubmitButton isLoading={isLoading} label="Sign in" loadingLabel="Signing in…" />
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link to="/signup" className="text-[#00d4aa] font-medium hover:opacity-75 transition-opacity">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
