import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Используем для навигации между страницами
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import styles from './AuthForm.module.css';

const Register = () => {
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ username: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (credentials.password !== credentials.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      const response = await api.post('/users/register', {
        username: credentials.username,
        password: credentials.password,
      });
      login(response.data.token);
      setMessage('Registration successful');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage('User already exists. Please choose a different username.');
      } else {
        setMessage('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={credentials.confirmPassword}
          onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Register</button>
        {message && <div className={message.includes('failed') || message.includes('Passwords') || message.includes('User') ? styles.alert : styles.success}>{message}</div>}
        <button type="button" className={styles.button} onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </form>
    </div>
  );
};

export default Register;
