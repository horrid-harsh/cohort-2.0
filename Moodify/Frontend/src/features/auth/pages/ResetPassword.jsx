import React, { useState } from "react";
import "../style/form.scss";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import SubmitButton from "../components/SubmitButton";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { handleResetPasswordUser, loading, error } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      await handleResetPasswordUser(token, data.password);
      setIsSuccess(true);
      // Wait a few seconds then redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Reset password failed:", err);
    }
  };

  return (
    <AuthLayout
      title="Moodify"
      subtitle="Set your new password"
      footer={
        <div className="auth-toggle">
          Back to <Link to="/login">Sign In</Link>
        </div>
      }
    >
      <div className="auth-form-container">
        {isSuccess ? (
          <div
            className="success-state"
            style={{ textAlign: "center", padding: "20px 0" }}
          >
            <div
              className="success-icon"
              style={{ fontSize: "40px", marginBottom: "20px" }}
            >
              ✅
            </div>
            <h3 style={{ color: "#fff", marginBottom: "15px" }}>
              Password Reset!
            </h3>
            <p
              style={{
                color: "#a1a1aa",
                lineHeight: "1.6",
                marginBottom: "25px",
              }}
            >
              Your password has been successfully updated. Redirecting you to
              the login page...
            </p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <PasswordInput
                placeholder="••••••••"
                label="New Password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <span
                  className="error-text"
                  style={{
                    color: "#ff4d4f",
                    fontSize: "12px",
                    marginTop: "5px",
                    display: "block",
                  }}
                >
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <PasswordInput
                placeholder="••••••••"
                label="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <span
                  className="error-text"
                  style={{
                    color: "#ff4d4f",
                    fontSize: "12px",
                    marginTop: "5px",
                    display: "block",
                  }}
                >
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <SubmitButton
              label="Reset Password"
              loading={loading}
              loadingLabel="Updating..."
              style={{ marginTop: "10px" }}
            />
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
