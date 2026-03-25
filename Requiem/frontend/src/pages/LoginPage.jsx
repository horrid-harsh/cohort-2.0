import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import { useLogin } from "../features/auth/hooks/useAuth";
import { loginSchema } from "../features/auth/validators/auth.schema";
import styles from "./AuthPage.module.scss";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
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
          <input
            id="password"
            name="password"
            type="password"
            className={errors.password ? styles.inputError : ""}
            placeholder="••••••••••••"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
        </div>

        <button type="submit" className={styles.btn} disabled={isPending}>
          {isPending ? "Logging in..." : "Log In"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
