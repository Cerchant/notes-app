import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthProvider, { AuthContext } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import NoteList from './components/Notes/NoteList';

const ProtectedRoute = ({ children }) => {
  const { token, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>; // Показать индикатор загрузки
  }

  return token ? children : <Navigate to="/login" />;
};

const App = () => (
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <NoteList />
            </ProtectedRoute>
          }
        />
        {/* Перенаправление для всех несуществующих маршрутов */}
        <Route path="*" element={<Navigate to="/notes" />} />
      </Routes>
    </AuthProvider>
  </Router>
);

export default App;
