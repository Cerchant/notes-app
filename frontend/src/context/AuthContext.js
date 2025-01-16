import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true); // Указываем, идет ли загрузка
  const navigate = useNavigate();

  useEffect(() => {
    const refreshAuthToken = async () => {
      if (!token) {
        setIsLoading(false); // Завершаем загрузку, если токена нет
        return;
      }

      try {
        const response = await api.post('/users/refresh-token', {
          headers: { Authorization: `Bearer ${token}`},
        });
        const newToken = response.data.token;
        setToken(newToken);
        localStorage.setItem('token', newToken);
      } catch (error) {
        logout(); // Если ошибка, выполняем выход
      } finally {
        setIsLoading(false); // Завершаем загрузку
      }
    };

    refreshAuthToken();
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    navigate('/notes');
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
