import React, { useState } from "react";
import "../style/form.scss";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import SocialAuth from "../components/SocialAuth";

const Login = () => {

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { loginUser, loading } = useAuth(); 

  const onSubmit = async (data) => {
    console.log("Form data : ", data);
    try {
      const response = await loginUser(data);
      console.log("Response from loginUser(Login.jsx) : ", response);
      navigate("/");
    } catch (error) {
      console.log("Error from loginUser(Login.jsx) : ", error);
    }
  }

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
          <input type="text" 
            placeholder="Enter email or username" 
            {...register("identifier")} 
          />
        </div>

        <PasswordInput placeholder="••••••••" {...register("password")} />

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
