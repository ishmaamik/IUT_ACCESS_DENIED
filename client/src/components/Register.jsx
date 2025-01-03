import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../css/Register.module.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        password,
        role,
      });
      toast.success("Registration successful!", {
        position: "top-center",
        autoClose: 3000,
      });
      console.log("User Registered:", res.data);
    } catch (error) {
      toast.error("Registration failed. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Register</h2>
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
        <label className={styles.label}>
          <div className={styles.dropdownWrapper}>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.select}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
        </label>
        <button type="submit" className={styles.button}>
          Register
        </button>
        <div className={styles.extraLinks}>
          <a href="/login" className={styles.link}>
            Already have an account? Login
          </a>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Register;
