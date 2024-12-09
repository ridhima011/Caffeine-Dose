import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSucess } from '../utils'; // Make sure these are correctly implemented
import styles from './Login.module.css'; // Reuse your existing CSS or create a new one for Admin Register

function AdminRegister() {
  const [adminInfo, setAdminInfo] = useState({
    name: '',
    email: '',
    password: '',
    adminCode: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminInfo({ ...adminInfo, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, adminCode } = adminInfo;

    if (!name || !email || !password || !adminCode) {
      handleError('All fields are required');
      return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminInfo),
        });
      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSucess(message);
        setTimeout(() => {
          navigate('/admin/login'); // Redirect to login after registration
        }, 1000);
      } else {
        handleError(message || error?.details[0]?.message);
      }
    } catch (err) {
      handleError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className={styles.centerContainer}>
      <div className={styles.signupContainer}>
        <h1 className={styles.header}>Admin Register</h1>
        <form onSubmit={handleRegister}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              placeholder="Enter your name..."
              value={adminInfo.name}
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
              value={adminInfo.email}
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
              value={adminInfo.password}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="adminCode" className={styles.label}>Admin Code</label>
            <input
              onChange={handleChange}
              type="text"
              name="adminCode"
              placeholder="Enter the admin authorization code..."
              value={adminInfo.adminCode}
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.button}>Register</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default AdminRegister;
