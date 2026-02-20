import React, { useState } from "react";
import "../style/form.scss";
import AuthLayout from "../components/layouts/AuthLayout";
import { Link } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout>
      <h2 className="cursive">Instagram</h2>
      <div className="form-container">
        <form action="">
          <input required type="text" placeholder="Username" />
          <input required type="text" placeholder="Email address" />

          <div className="password-field">
            <input
              required
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>
        <div className="login-container">
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
