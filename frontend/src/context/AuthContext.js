import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, loginProfessor } from '../services/api'; // Import the login functions

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const login = async (credentials, role) => {
    try {
      let response;
      if (role === 'admin') {
        response = await loginAdmin(credentials);
      } else if (role === 'professor') {
        response = await loginProfessor(credentials);
      }

      if (response.success) {
        localStorage.setItem('token', 'dummy-token'); // Use actual token in production
        localStorage.setItem('role', role);
        setIsAuthenticated(true);
        setUserRole(role);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;