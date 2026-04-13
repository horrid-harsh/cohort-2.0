import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";
import authImage from "../../../assets/auth-modal.png";
import styles from "./Login.module.scss";
import { GoogleIcon, EyeIcon, EyeOffIcon } from "../components/AuthIcons";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const successMessage = location.state?.message;
  const { handleLogin, isLoading, serverError } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    await handleLogin(data, setError);
  };

  return (
    <AuthLayout
      imageUrl={authImage}
      quote={{
        label: "New Arrivals",
        heading: "Dressed in\nConfidence.",
      }}
    >
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1 className={styles.title}>
            Welcome
            <br />
            back
          </h1>
          <p className={styles.subtitle}>Sign in to your Snitch account</p>
        </div>

        {serverError && (
          <div className={styles.serverError} role="alert">
            {serverError}
          </div>
        )}

        {successMessage && !serverError && (
          <div className={styles.successMsg} role="alert">
            {successMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={styles.form}
        >
          {/* Email */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="atelier@snitch.com"
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                },
              })}
            />
            {errors.email && (
              <span className={styles.errorMsg} role="alert">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>
            <div className={styles.inputWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`${styles.input} ${styles.inputWithIcon} ${errors.password ? styles.inputError : ""}`}
                {...register("password", {
                  required: "Password is required",
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

          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <div className={styles.divider}>or</div>

          <button type="button" className={styles.btnGoogle}>
            <GoogleIcon />
            Continue with Google
          </button>
        </form>

        <p className={styles.switchAuth}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.switchLink}>
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
