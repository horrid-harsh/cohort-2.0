import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import { useForgotPassword } from "../features/auth/hooks/useAuth";
import styles from "./AuthPage.module.scss";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate: forgotPassword, isPending, error } = useForgotPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    forgotPassword(email, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
    });
  };

  return (
    <AuthLayout>
      <div className={styles.heading}>
        <h1>Forgot password?</h1>
        <p>No worries, we'll send you reset instructions.</p>
      </div>

      {isSubmitted ? (
        <div className={styles.verificationSuccess}>
          <div className={`${styles.icon} ${styles.success}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2>Check your email</h2>
          <p>We've sent a password reset link to <strong>{email}</strong>.</p>
          <button className={styles.btn} onClick={() => setIsSubmitted(false)}>
            Try another email
          </button>
          <div className={styles.switchText}>
            <Link to="/login">Back to login</Link>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <div className={styles.error}>
              {error.response?.data?.errors && Object.keys(error.response.data.errors).length > 0
                ? Object.values(error.response.data.errors)[0]
                : error.response?.data?.message || "Something went wrong"}
            </div>
          )}
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.btn} disabled={isPending}>
              {isPending ? "Sending..." : "Reset password"}
            </button>
          </form>

          <div className={styles.switchText}>
            <Link to="/login">Back to login</Link>
          </div>
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
