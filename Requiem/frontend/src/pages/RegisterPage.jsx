import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import { useRegister } from "../features/auth/hooks/useAuth";
import styles from "./AuthPage.module.scss";

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { mutate: register, isPending, error } = useRegister();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form);
  };

  return (
    <AuthLayout>
      <div className={styles.heading}>
        <h1>Create account</h1>
        <p>Start building your second brain</p>
      </div>

      {error && (
        <div className={styles.error}>
          {error.response?.data?.message || "Something went wrong"}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className={styles.btn} disabled={isPending}>
          {isPending ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className={styles.switchText}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
