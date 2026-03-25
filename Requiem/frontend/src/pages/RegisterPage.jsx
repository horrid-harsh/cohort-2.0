import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import { useRegister } from "../features/auth/hooks/useAuth";
import { registerSchema } from "../features/auth/validators/auth.schema";
import styles from "./AuthPage.module.scss";

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { mutate: register, isPending, error: serverError } = useRegister();

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

  return (
    <AuthLayout>
      <div className={styles.heading}>
        <h1>Create your account</h1>
        <p>Already have an account? <Link to="/login">Log in</Link></p>
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
          {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
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
            autoComplete="new-password"
          />
          {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
        </div>

        <button type="submit" className={styles.btn} disabled={isPending}>
          {isPending ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
