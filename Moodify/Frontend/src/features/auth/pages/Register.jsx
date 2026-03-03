import React, { useState } from "react";
import "../style/form.scss";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import SocialAuth from "../components/SocialAuth";

const Register = () => {

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { registerUser, loading } = useAuth();

  const onSubmit = async (data) => {
    // console.log("Form data register : ", data);
    try {
      const response = await registerUser(data);
      // console.log("Response from registerApi(jsx) : ", response);
      navigate("/");
    } catch (error) {
      // console.error("Error from registerApi(jsx) : ", error);
    }
  };

  return (
    <AuthLayout
      title="Moodify"
      subtitle="Welcome to your emotional hub"
      footer={
        <div className="auth-toggle">
          Already a member? <Link to="/login">Sign In</Link>
        </div>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="@username"
            {...register("username")}
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="name@example.com"
            {...register("email")}
          />
        </div>

        <PasswordInput placeholder="••••••••" {...register("password")} />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <SocialAuth dividerText="Or join with" />
      </form>
    </AuthLayout>
  );
};

export default Register;
