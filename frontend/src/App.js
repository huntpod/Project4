import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import AdminPage from './components/AdminPage';
import ProfessorsPage from './components/ProfessorsPage';
import ReviewsPage from './components/ReviewsPage';
import AdminLogin from './components/AdminLogin';
import ProfessorLogin from './components/ProfessorLogin';
import NavBar from './components/NavBar';
import AuthContextProvider, { AuthContext } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <Router>
      <AuthContextProvider>
        <div className="app-container">
          <NavBar />
          <div className="content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/professor/login" element={<ProfessorLogin />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/admin" element={<PrivateRoute element={<AdminPage />} role="admin" />} />
              <Route path="/professors" element={<PrivateRoute element={<ProfessorsPage />} role="professor" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </AuthContextProvider>
    </Router>
  );
}

function PrivateRoute({ element, role }) {
  const { isAuthenticated, userRole } = React.useContext(AuthContext);

  console.log(`PrivateRoute -> isAuthenticated: ${isAuthenticated}, userRole: ${userRole}, expectedRole: ${role}`);

  if (!isAuthenticated || userRole !== role) {
    return <Navigate to={`/${role}/login`} replace />;
  }

  return element;
}

export default App;