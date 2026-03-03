import React, { useState } from "react";
import "../style/form.scss";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import AuthLayout from "../components/AuthLayout";

const ForgotPassword = () => {
  const { handleForgotPasswordUser, loading, error } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await handleForgotPasswordUser(data.email);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Forgot password failed:", err);
    }
  };

  return (
    <AuthLayout
      title="Moodify"
      subtitle="Reset your password"
      footer={
        <div className="auth-toggle">
          Remembered your password? <Link to="/login">Sign In</Link>
        </div>
      }
    >
      <div className="auth-form-container">
        {isSubmitted ? (
          <div
            className="success-state"
            style={{ textAlign: "center", padding: "20px 0" }}
          >
            <div
              className="success-icon"
              style={{ fontSize: "40px", marginBottom: "20px" }}
            >
              ✉️
            </div>
            <h3 style={{ color: "#fff", marginBottom: "15px" }}>
              Check your email
            </h3>
            <p
              style={{
                color: "#a1a1aa",
                lineHeight: "1.6",
                marginBottom: "25px",
              }}
            >
              If an account exists for that email, we've sent instructions to
              reset your password.
            </p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
              style={{ marginTop: "10px" }}
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
