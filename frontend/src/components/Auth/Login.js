import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Используем для навигации между страницами
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import styles from './AuthForm.module.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', credentials);
      login(response.data.token);
      setMessage('Login successful');
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
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
        <button type="submit" className={styles.button}>Login</button>
        {message && <div className={message.includes('failed') ? styles.alert : styles.success}>{message}</div>}
        <button type="button" className={styles.button} onClick={() => navigate('/register')}>
          Go to Register
        </button>
      </form>
    </div>
  );
};

export default Login;
