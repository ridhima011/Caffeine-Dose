import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSucess } from "../utils"; 
import styles from "./Login.module.css"; 

function AdminLogin() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target; 
    setLoginInfo({ ...loginInfo, [name]: value }); 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      handleError("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log("Response from API:", result);

      if (response.ok && result.success) {
        handleSucess(result.message);
        localStorage.setItem("adminToken", result.token);
        setTimeout(() => navigate("/adminpage"), 1000);
      } else {
        handleError(result.message || "Login failed!");
      }
    } catch (err) {
      console.error("Login Error:", err);
      handleError("Something went wrong!");
    }
  };

  return (
    <div className={styles.centerContainer}>
      <div className={styles.loginContainer}>
        <h1 className={styles.header}>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email"
              value={loginInfo.email}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginInfo.password}
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.button}>Login</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default AdminLogin;
