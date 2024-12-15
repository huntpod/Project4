import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, loginProfessor } from '../services/api'; // Import the login functions

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null); // Add userId state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('userId'); // Ensure userId is retrieved from localStorage

    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserId(id); // Set userId state
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
        localStorage.setItem('userId', response.userId); // Store userId in localStorage
        setIsAuthenticated(true);
        setUserRole(role);
        setUserId(response.userId); // Set userId state
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
    setUserId(null); // Reset userId state
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId'); // Remove userId from localStorage
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;