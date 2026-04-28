import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";
import authImage from "../../../assets/auth-model.avif";
import styles from "./Register.module.scss";
import Button from "../../shared/Button";
import { GoogleIcon, EyeIcon, EyeOffIcon } from "../components/AuthIcons";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleRegister, isLoading, serverError } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "buyer",
    },
  });

  const onSubmit = async (data) => {
    // Pass setError so useAuth can map server validation errors back to fields
    await handleRegister(data, setError);
  };

  return (
    <AuthLayout
      imageUrl={authImage}
      quote={{
        label: "Collection 2026",
        heading: "Elegance in\nModesty.",
      }}
    >
      <div className={styles.container}>
        {/* Heading */}
        <div className={styles.heading}>
          <h1 className={styles.title}>
            Create your
            <br />
            account
          </h1>
          <p className={styles.subtitle}>
            Join the marketplace for modern fashion
          </p>
        </div>

        {/* Server-level error (non-field) */}
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
          {/* Full Name */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Julianne Moore"
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Name cannot exceed 50 characters",
                },
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: "Name can only contain letters and spaces",
                },
              })}
            />
            {errors.name && (
              <span className={styles.errorMsg} role="alert">
                {errors.name.message}
              </span>
            )}
          </div>

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

          {/* Password + Phone — side by side */}
          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="password">
                Password
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

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[\d\s\-\+\(\)]{10,15}$/,
                    message: "Enter a valid phone number",
                  },
                })}
              />
              {errors.phone && (
                <span className={styles.errorMsg} role="alert">
                  {errors.phone.message}
                </span>
              )}
            </div>
          </div>

          {/* Role selector */}
          <div className={styles.roleGroup}>
            <span className={styles.label}>I am a</span>
            <div className={styles.roleOptions}>
              {["buyer", "seller"].map((r) => (
                <label key={r} className={styles.roleOption}>
                  <input type="radio" value={r} {...register("role")} />
                  <span>{r.charAt(0).toUpperCase() + r.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            Sign Up
          </Button>

          {/* Divider */}
          <div className={styles.divider}>or</div>

          {/* Google */}
          <Button
            as="a"
            variant="outline"
            fullWidth
            href="http://localhost:3000/api/v1/auth/google"
            className={styles.btnGoogle}
          >
            <GoogleIcon />
            Continue with Google
          </Button>
        </form>

        {/* Footer link */}
        <p className={styles.switchAuth}>
          Already have an account?{" "}
          <Link to="/login" className={styles.switchLink}>
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
