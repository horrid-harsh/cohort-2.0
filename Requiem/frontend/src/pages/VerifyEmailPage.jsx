import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import useAuthStore from "../features/auth/store/auth.store";
import {
  useVerifyEmail,
  useResendVerification,
} from "../features/auth/hooks/useAuth";
import styles from "./AuthPage.module.scss";
import toast from "react-hot-toast";

const BadgeIcon = ({ type }) => {
  const isSuccess = type === "success";
  const isLoading = type === "loading";

  return (
    <div className={`${styles.icon} ${styles[type]}`}>
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L14.4 3.6L17.2 3.2L18.4 5.8L21 6.8L21 9.6L22.6 12L21 14.4L21 17.2L18.4 18.2L17.2 20.8L14.4 20.4L12 22L9.6 20.4L6.8 20.8L5.6 18.2L3 17.2L3 14.4L1.4 12L3 9.6L3 6.8L5.6 5.8L6.8 3.2L9.6 3.6L12 2Z" />
        {isLoading ? (
          <path
            d="M12 7V12L15 15"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        ) : isSuccess ? (
          <path
            d="M8 12L11 15L16 9"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : (
          <path
            d="M9 9L15 15M15 9L9 15"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </svg>
    </div>
  );
};

const VerifyEmailPage = () => {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [isResent, setIsResent] = useState(false);

  const {
    isLoading: isVerifying,
    isSuccess: isVerified,
    isError: isVerifyError,
    error: verifyError,
    data: responseData,
  } = useVerifyEmail(token);

  const { mutate: resend, isPending: isResending } = useResendVerification();


  const handleResend = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    resend(email, {
      onSuccess: () => {
        toast.success("Verification link sent to your email!");
        setIsResent(true);
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to resend link");
      },
    });
  };

  if (isVerifying) {
    return (
      <AuthLayout>
        <div className={styles.verificationSuccess}>
          <BadgeIcon type="loading" />
          <h2>Verifying your email</h2>
          <p>Please wait while we verify your account...</p>
        </div>
      </AuthLayout>
    );
  }

  const isAlreadyVerified = responseData?.alreadyVerified;

  if (isVerified) {
    return (
      <AuthLayout>
        <div className={styles.verificationSuccess}>
          <BadgeIcon type="success" />
          <h2>
            {isAlreadyVerified
              ? "Account Already Verified"
              : "Email Verified Successfully"}
          </h2>
          <p>
            {isAlreadyVerified
              ? "Your email address has already been verified. "
              : "Your account has been verified. "}
            {user
              ? "You can continue using Requiem."
              : "You can now log in."}
          </p>
          <Link to={user ? "/" : "/login"} className={styles.btn}>
            {user ? "Go to Dashboard" : "Log In"}
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (isVerifyError || !token) {
    return (
      <AuthLayout>
        <div className={styles.verificationSuccess}>
          <BadgeIcon type="error" />
          <h2>Verification Failed</h2>
          <p>
            {verifyError?.response?.data?.message ||
              "The verification link is invalid or expired."}
          </p>

          {!isResent ? (
            <form className={styles.form} onSubmit={handleResend}>
              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className={styles.btn}
                disabled={isResending}
              >
                {isResending ? "Sending..." : "Request New Verification Link"}
              </button>
            </form>
          ) : (
            <div className={styles.verificationSuccess}>
              <p>
                A new verification link has been sent to <strong>{email}</strong>.
              </p>
              <Link to="/login" className={styles.secondaryBtn}>
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </AuthLayout>
    );
  }

  return null;
};

export default VerifyEmailPage;
