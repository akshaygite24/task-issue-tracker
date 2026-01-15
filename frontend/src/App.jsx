import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on mount
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<LoginPage onLogin={handleLogin} />} 
        />
        <Route 
          path="/register" 
          element={<RegisterPage onRegister={handleLogin} />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/project/:id" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProjectDetail onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
