import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import {
  useRegister,
  useResendVerification,
} from "../features/auth/hooks/useAuth";
import { registerSchema } from "../features/auth/validators/auth.schema";
import styles from "./AuthPage.module.scss";
import toast from "react-hot-toast";

const BadgeIcon = ({ type }) => {
  return (
    <div className={`${styles.icon} ${styles.success}`}>
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L14.4 3.6L17.2 3.2L18.4 5.8L21 6.8L21 9.6L22.6 12L21 14.4L21 17.2L18.4 18.2L17.2 20.8L14.4 20.4L12 22L9.6 20.4L6.8 20.8L5.6 18.2L3 17.2L3 14.4L1.4 12L3 9.6L3 6.8L5.6 5.8L6.8 3.2L9.6 3.6L12 2Z" />
        <path
          d="M6.5 9C6.5 8.17157 7.17157 7.5 8 7.5H16C16.8284 7.5 17.5 8.17157 17.5 9V15C17.5 15.8284 16.8284 16.5 16 16.5H8C7.17157 16.5 6.5 15.8284 6.5 15V9Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M6.5 8.5L12 12L17.5 8.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const {
    mutate: register,
    isPending,
    isSuccess,
    error: serverError,
  } = useRegister();

  const { mutate: resend, isPending: isResending } = useResendVerification();

  useEffect(() => {
    let timer;
    if (isSuccess && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [isSuccess, countdown]);

  const validateField = (name, value) => {
    const fieldSchema = registerSchema.shape[name];
    const result = fieldSchema.safeParse(value);

    if (result.success) return "";

    return result.error.issues[0].message;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = registerSchema.safeParse(form);

    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0];
        if (!newErrors[field]) newErrors[field] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    register(form);
  };

  const handleResend = () => {
    resend(form.email, {
      onSuccess: () => {
        toast.success("Verification email resent!");
        setCountdown(60);
        setIsResendDisabled(true);
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to resend email");
      },
    });
  };

  if (isSuccess) {
    return (
      <AuthLayout>
        <div className={styles.verificationSuccess}>
          <BadgeIcon type="mail" />
          <h2>Verify your email</h2>
          <p>
            We've sent a verification link to <strong>{form.email}</strong>.
            Please check your inbox and click the link to activate your account.
          </p>

          <div className={styles.resendContainer}>
            <button
              className={styles.resendBtn}
              onClick={handleResend}
              disabled={isResendDisabled || isResending}
            >
              {isResendDisabled
                ? `Resend in ${countdown}s`
                : isResending
                  ? "Resending..."
                  : "Resend Email"}
            </button>
            <Link to="/login" className={styles.secondaryBtn}>
              Back to Login
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className={styles.heading}>
        <h1>Create your account</h1>
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>

      {serverError && (
        <div className={styles.error}>
          {serverError.response?.data?.errors &&
          Object.keys(serverError.response.data.errors).length > 0
            ? Object.values(serverError.response.data.errors)[0]
            : serverError.response?.data?.message || "Something went wrong"}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            className={errors.name ? styles.inputError : ""}
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />
          {errors.name && (
            <span className={styles.fieldError}>{errors.name}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className={errors.email ? styles.inputError : ""}
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && (
            <span className={styles.fieldError}>{errors.email}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className={errors.password ? styles.inputError : ""}
              placeholder="••••••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.88 9.88L14.12 14.12" stroke="currentColor" />
                  <path d="M2.1 2.1L21.9 21.9" stroke="currentColor" />
                  <path
                    d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                    stroke="currentColor"
                  />
                  <path
                    d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                    stroke="currentColor"
                  />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                    stroke="currentColor"
                  />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <span className={styles.fieldError}>{errors.password}</span>
          )}
        </div>

        <button type="submit" className={styles.btn} disabled={isPending}>
          {isPending ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
