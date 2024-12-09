import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSucess } from '../utils';
import styles from './Login.module.css';
// import '../components/Home.css'

function Signup() {
  const [signUpInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: '',
    role:'',
  });

  const navigate = useNavigate();
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo({ ...signUpInfo, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = signUpInfo;
  
    if (!name || !email || !password || !role) {
      handleError("All fields are required");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpInfo),
      });
      const result = await response.json();
  
      const { success, message } = result;
  
      if (success) {
        handleSucess(message);
        setTimeout(() => {
          if (role === "admin") {
            navigate("/register");
          } else {
            navigate("/login");
          }
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (err) {
      console.error(err);
      handleError("Something went wrong!");
    }
  };
  
  return (
    <div className={styles.centerContainer}>
      <div className={styles.signupContainer}>
        <h1 className={styles.header}>Sign Up</h1>
        <form onSubmit={handleSignup}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>Name</label>
        <input
          onChange={handleChange}
          type="text"
          name="name"
          placeholder="Enter your name..."
          value={signUpInfo.name}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          onChange={handleChange}
          type="email"
          name="email"
          placeholder="Enter your email..."
          value={signUpInfo.email}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>Password</label>
        <input
          onChange={handleChange}
          type="password"
          name="password"
          placeholder="Enter your password..."
          value={signUpInfo.password}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="role" className={styles.label}>Role</label>
        <select
          onChange={handleChange}
          name="role"
          value={signUpInfo.role}
          className={styles.input}
        >
          <option value="" disabled>Select your role...</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" className={styles.button}>Signup</button>
      <span className={styles.footerText}>
        Already signed up? <Link to="/login" className={styles.link}>Login</Link>
      </span>
    </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Signup;
