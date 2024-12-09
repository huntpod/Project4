import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import AdminPage from './components/AdminPage';
import ProfessorsPage from './components/ProfessorsPage';
import ReviewsPage from './components/ReviewsPage';
import NavBar from './components/NavBar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/professors" element={<ProfessorsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;