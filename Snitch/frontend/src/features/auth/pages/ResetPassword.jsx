import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams, useNavigate } from "react-router";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";
import authImage from "../../../assets/auth-model.avif";
import styles from "./Login.module.scss";

import { EyeIcon, EyeOffIcon } from "../components/AuthIcons";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleResetPassword, isLoading, serverError } = useAuth();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const newPassword = watch("password");

  const onSubmit = async (data) => {
    if (!token) {
      // Logic for missing token
      return;
    }
    const res = await handleResetPassword(
      { token, password: data.password },
      setError,
    );
    if (res.success) {
      // Redirect to login with success msg maybe?
      navigate("/login", {
        state: { message: "Password reset successfully. You can now login." },
      });
    }
  };

  if (!token) {
    return (
      <AuthLayout
        imageUrl={authImage}
        quote={{ label: "Error", heading: "Invalid Session" }}
      >
        <div className={styles.container}>
          <div className={styles.heading}>
            <h1 className={styles.title}>
              Missing
              <br />
              token
            </h1>
            <p className={styles.subtitle}>
              The reset password link is invalid or expired. Please request a
              new one.
            </p>
          </div>
          <Link
            to="/forgot-password"
            className={styles.btnPrimary}
            style={{
              textAlign: "center",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Request new link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      imageUrl={authImage}
      quote={{
        label: "Security",
        heading: "Securing\nYour Identity.",
      }}
    >
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1 className={styles.title}>
            Set new
            <br />
            password
          </h1>
          <p className={styles.subtitle}>Enter your new password below</p>
        </div>

        {serverError && (
          <div className={styles.serverError} role="alert">
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={styles.form}
        >
          {/* New Password */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="password">
              New Password
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`${styles.input} ${styles.inputWithIcon} ${errors.password ? styles.inputError : ""}`}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Minimum 8 characters" },
                  validate: {
                    hasUpper: (v) =>
                      /[A-Z]/.test(v) || "Add an uppercase letter",
                    hasLower: (v) =>
                      /[a-z]/.test(v) || "Add a lowercase letter",
                    hasNumber: (v) => /[0-9]/.test(v) || "Add a number",
                    hasSpecial: (v) =>
                      /[\W]/.test(v) || "Add a special character",
                  },
                })}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <span className={styles.errorMsg} role="alert">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`${styles.input} ${styles.inputWithIcon} ${errors.confirmPassword ? styles.inputError : ""}`}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowConfirmPassword((p) => !p)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={styles.errorMsg} role="alert">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className={styles.switchAuth}>
          Back to{" "}
          <Link to="/login" className={styles.switchLink}>
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
