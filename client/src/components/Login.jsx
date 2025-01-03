import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../css/Login.module.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      const decoded = jwtDecode(res.data.token);
      console.log("Decoded JWT:", decoded); // Check decoded token
      localStorage.setItem("userId", decoded.userId);
      localStorage.setItem("username", decoded.username);
      localStorage.setItem("role", decoded.role); // Save role

      toast.success("Successfully logged in!");
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error("Login failed. Please check your credentials.");
    }
  };
  return (
    <>
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.title}>Login</h2>
          <label className={styles.label}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </label>
          <button type="submit" className={styles.button}>
            Login
          </button>
          <div className={styles.extraLinks}>
            <a href="/forgot-password" className={styles.link}>
              Forgot Password?
            </a>
            <a href="/register" className={styles.link}>
              Create an Account
            </a>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;
