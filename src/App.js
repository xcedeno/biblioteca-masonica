// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
