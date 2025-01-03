import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../css/Login.module.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      console.log("Logged in:", res.data); // Handle login logic, save token, etc.
      toast.success("Successfully logged in!"); // Show success notification
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please check your credentials."); // Show error notification
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
