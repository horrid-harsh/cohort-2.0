import React, { useEffect } from "react";
import "../style/form.scss";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import SocialAuth from "../components/SocialAuth";
import SubmitButton from "../components/SubmitButton";

const Register = () => {
  const navigate = useNavigate();
  const { user, handleRegisterUser, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user && !loading) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const onSubmit = async (data) => {
    try {
      await handleRegisterUser(data);
    } catch (error) {
      console.error("Register Error:", error);
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

        <PasswordInput
          placeholder="••••••••"
          label="Password"
          {...register("password")}
        />

        <SubmitButton
          label="Register Now"
          loading={loading}
          loadingLabel="Creating Account..."
        />

        <SocialAuth dividerText="Or" />
      </form>
    </AuthLayout>
  );
};

export default Register;
