import React, { useEffect } from "react";
import "../style/form.scss";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import SocialAuth from "../components/SocialAuth";

const Login = () => {
  const navigate = useNavigate();
  const { user, loginUser, loading, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const onSubmit = async (data) => {
    try {
      await loginUser(data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <AuthLayout
      title="Moodify"
      subtitle="Welcome back to your emotional hub"
      footer={
        <div className="auth-toggle">
          New here? <Link to="/register">Create Account</Link>
        </div>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Email or username</label>
          <input
            type="text"
            placeholder="Enter email or username"
            {...register("identifier", {
              required: "Email or username is required",
            })}
          />
        </div>

        <PasswordInput
          placeholder="••••••••"
          {...register("password", { required: "Password is required" })}
        />

        <div className="form-options">
          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Sign In"}
        </button>

        <SocialAuth dividerText="Or continue with" />
      </form>
    </AuthLayout>
  );
};

export default Login;
