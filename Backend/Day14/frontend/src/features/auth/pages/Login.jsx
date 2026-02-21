import React, { useState } from "react";
import "../style/form.scss";
import AuthLayout from "../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const { handleLogin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await handleLogin(identifier, password);
      // console.log(res);
      setIdentifier("");
      setPassword("");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthLayout>
      <h2 className="cursive">Instagram</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            onInput={(e) => {
              setIdentifier(e.target.value);
            }}
            value={identifier}
            required
            type="text"
            placeholder="Username or email"
          />

          <div className="password-field">
            <input
              onInput={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
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
