import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";
import authImage from "../../../assets/auth-modal.png";
import styles from "./AuthFeedback.module.scss";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { handleVerifyEmail, isLoading } = useAuth();
  const [status, setStatus] = useState({ state: "loading", message: "" });

  useEffect(() => {
    const runVerification = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus({
          state: "error",
          message: "Verification token is missing. Please check your link.",
        });
        return;
      }

      const res = await handleVerifyEmail(token);
      if (res.success) {
        setStatus({ state: "success", message: res.message });
      } else {
        setStatus({ state: "error", message: res.message });
      }
    };

    runVerification();
  }, []); // Empty dependency array means this runs only once on mount

  return (
    <AuthLayout
      imageUrl={authImage}
      quote={{
        label: "Account Verification",
        heading:
          status.state === "success"
            ? "Welcome to\nthe Atelier."
            : "Checking your\ncredentials.",
      }}
    >
      <div className={styles.container}>
        {isLoading || status.state === "loading" ? (
          <div className={styles.content}>
            <h1 className={styles.title}>Verifying account...</h1>
            <p className={styles.description}>
              We are verifying your email address. Please wait a moment.
            </p>
          </div>
        ) : status.state === "success" ? (
          <>
            <div className={`${styles.iconWrapper} ${styles.iconSuccess}`}>
              <CheckIcon />
            </div>
            <div className={styles.content}>
              <h1 className={styles.title}>Account verified</h1>
              <p className={styles.description}>
                Great news! Your account is now fully active. You can now log in
                and start shopping.
              </p>
            </div>
            <div className={styles.actions}>
              <Link to="/login" className={styles.btnPrimary}>
                Log In
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className={`${styles.iconWrapper} ${styles.iconError}`}>
              <ErrorIcon />
            </div>
            <div className={styles.content}>
              <h1 className={styles.title}>Verification failed</h1>
              <p className={styles.description}>{status.message}</p>
            </div>
            <div className={styles.actions}>
              <Link to="/login" className={styles.btnPrimary}>
                Return to Login
              </Link>
              <Link to="/resend-verification" className={styles.btnOutline}>
                Need a new link?
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
