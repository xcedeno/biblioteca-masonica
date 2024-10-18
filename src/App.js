// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import CreateCategories from './pages/CreateCategories';
import UploadDocuments from './pages/UploadDocuments';
import Arte from './categories/Arte';
import PdfReaderModal from './components/PdfReaderModal';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/arte" element={<Arte />} />
        <Route path="/pdf-reader" element={<PdfReaderModal />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Correctly nested routes under AdminPage */}
        <Route path="/admin" element={<AdminPage />} >
          <Route path="create-categories" element={<CreateCategories />} />
          <Route path="upload-documents" element={<UploadDocuments />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
