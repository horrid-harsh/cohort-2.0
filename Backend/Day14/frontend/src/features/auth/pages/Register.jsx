import "../style/form.scss";
import AuthLayout from "../components/layouts/AuthLayout";
import { Link } from "react-router"; // Ensure correct import for react-router v6/7
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await axios.post("http://localhost:3000/api/auth/register", {
      username,
      email,
      password,
    }, {
      withCredentials: true,
    });

    console.log(response.data);

    setUsername("");
    setEmail("");
    setPassword("");
  }

  return (
    <AuthLayout>
      <h2 className="cursive">Instagram</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            onInput={(e) => {
              setUsername(e.target.value);
            }}
            required
            type="text"
            placeholder="Username"
          />
          <input
            onInput={(e) => {
              setEmail(e.target.value);
            }}
            required
            type="text"
            placeholder="Email address"
          />
          <div className="password-field">
            <input
              onInput={(e) => {
                setPassword(e.target.value);
              }}
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
            Sign Up
          </button>
        </form>
        <div className="login-container">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
