import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hook/useAuth.js";
import AuthLayout from "../../../components/layouts/AuthLayout.jsx";
import {
  Alert, FormField, InputWrapper, SubmitButton, inputClass,
  MailIcon, LockIcon, UserIcon, EyeOpenIcon, EyeClosedIcon,
} from "../../../components/ui/AuthUI.jsx";

export default function SignupPage() {
  const { register: registerUser, isLoading, error, successMessage, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { username: "", email: "", password: "" } });

  const onSubmit = async (data) => {
    try {
      clearError();
      await registerUser(data);  // .unwrap() is called inside useAuth
      reset();                   // clear form on success
      // No navigation — user must verify email first
    } catch {
      // error already in Redux state via rejectWithValue
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-display text-[1.6rem] font-bold tracking-tight text-[#f0f0ee] leading-tight mb-1">
        Create account
      </h1>
      <p className="text-sm text-gray-500 font-light mb-7">
        Start exploring with AI-powered search
      </p>

      <Alert type="error" message={error} />

      {successMessage && (
        <Alert
          type="success"
          message={`${successMessage} Check your inbox to verify your email.`}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">

        {/* Username */}
        <FormField label="Username" error={errors.username?.message}>
          <InputWrapper icon={<UserIcon />}>
            <input
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "At least 3 characters" },
                maxLength: { value: 30, message: "Max 30 characters" },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: "Letters, numbers and underscores only",
                },
              })}
              type="text"
              placeholder="cooluser_42"
              autoComplete="username"
              autoFocus
              className={inputClass}
            />
          </InputWrapper>
        </FormField>

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
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              className={`${inputClass} pr-10`}
            />
          </InputWrapper>
        </FormField>

        <SubmitButton isLoading={isLoading} label="Create account" loadingLabel="Creating account…" />
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="text-[#00d4aa] font-medium hover:opacity-75 transition-opacity">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
