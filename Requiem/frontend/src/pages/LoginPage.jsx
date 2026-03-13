import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import { useLogin } from "../features/auth/hooks/useAuth";
import styles from "./AuthPage.module.scss";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { mutate: login, isPending, error } = useLogin();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form);
  };

  return (
    <AuthLayout>
      <div className={styles.heading}>
        <h1>Log in to Requiem</h1>
        <p>Don't have an account? <Link to="/register">Sign up</Link></p>
      </div>

      {error && (
        <div className={styles.error}>
          {error.response?.data?.message || "Something went wrong"}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="alan.turing@example.com"
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
            placeholder="••••••••••••"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className={styles.btn} disabled={isPending}>
          {isPending ? "Logging in..." : "Log In"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
