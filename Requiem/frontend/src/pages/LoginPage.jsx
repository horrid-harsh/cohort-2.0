import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import { useLogin } from "../features/auth/hooks/useAuth";
import { loginSchema } from "../features/auth/validators/auth.schema";
import styles from "./AuthPage.module.scss";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error: serverError } = useLogin();

  const validateField = (name, value) => {
    const fieldSchema = loginSchema.shape[name];
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
    const result = loginSchema.safeParse(form);

    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0];
        if (!newErrors[field]) newErrors[field] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    login(form);
  };

  return (
    <AuthLayout>
      <div className={styles.heading}>
        <h1>Log in to Requiem</h1>
        <p>Don't have an account? <Link to="/register">Sign up</Link></p>
      </div>

      {serverError && (
        <div className={styles.error}>
          {serverError.response?.data?.errors && Object.keys(serverError.response.data.errors).length > 0
            ? Object.values(serverError.response.data.errors)[0]
            : serverError.response?.data?.message || "Something went wrong"}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className={errors.email ? styles.inputError : ""}
            placeholder="alan.turing@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
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
              autoComplete="current-password"
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
          {isPending ? "Logging in..." : "Log In"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
