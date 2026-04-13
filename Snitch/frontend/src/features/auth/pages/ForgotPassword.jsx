import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";
import authImage from "../../../assets/auth-modal.png";
import styles from "./Login.module.scss"; // Reusing Login styles for consistent form look

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { handleForgotPassword, isLoading, serverError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    const res = await handleForgotPassword(data.email);
    if (res.success) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout
        imageUrl={authImage}
        quote={{
          label: "Password Recovery",
          heading: "Restoring\nAccess.",
        }}
      >
        <div className={styles.container}>
          <div className={styles.heading}>
            <h1 className={styles.title}>
              Check your
              <br />
              email
            </h1>
            <p className={styles.subtitle}>
              We've sent a password reset link to your email address.
            </p>
          </div>

          <div className={styles.form}>
            <Link
              to="/login"
              className={styles.btnPrimary}
              style={{
                textAlign: "center",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Back to Sign In
            </Link>
          </div>

          <p className={styles.switchAuth}>
            Didn't receive the email?{" "}
            <button
              onClick={handleSubmit(onSubmit)}
              className={styles.switchLink}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                font: "inherit",
                cursor: "pointer",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Click to resend"}
            </button>
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      imageUrl={authImage}
      quote={{
        label: "Password Recovery",
        heading: "Restoring\nAccess.",
      }}
    >
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1 className={styles.title}>
            Forgot
            <br />
            password?
          </h1>
          <p className={styles.subtitle}>
            Enter your email to reset your password
          </p>
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

          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className={styles.switchAuth}>
          Remember your password?{" "}
          <Link to="/login" className={styles.switchLink}>
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
