import React, { useState } from "react";
import { useLocation, Link } from "react-router";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";
import authImage from "../../../assets/auth-modal.png";
import styles from "./AuthFeedback.module.scss";

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
);

const EmailSent = () => {
  const { state } = useLocation();
  const { handleResendVerification, isLoading } = useAuth();
  const [resendStatus, setResendStatus] = useState(null);

  const email = state?.email || "your email address";

  const onResend = async () => {
    setResendStatus(null);
    const res = await handleResendVerification(email);
    setResendStatus(res);
  };

  return (
    <AuthLayout
      imageUrl={authImage}
      quote={{
        label: "Registration",
        heading: "Check your\ninbox.",
      }}
    >
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <MailIcon />
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>Confirm your email</h1>
          <p className={styles.description}>
            We've sent a verification link to <strong>{email}</strong>. Please
            click the link to activate your account.
          </p>
        </div>

        <div className={styles.actions}>
          <Link to="/login" className={styles.btnPrimary}>
            Return to Login
          </Link>
        </div>

        <div className={styles.resendSection}>
          <p className={styles.resendText}>
            Didn't receive the email?
            <button onClick={onResend} disabled={isLoading || !state?.email}>
              {isLoading ? "Sending..." : "Resend link"}
            </button>
          </p>

          {resendStatus && (
            <div
              className={`${styles.statusMessage} ${resendStatus.success ? styles.success : styles.error}`}
            >
              {resendStatus.message}
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailSent;
