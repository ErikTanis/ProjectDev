import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '~contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import './styles.css';
import Register from '~pages/Register';
import TermsAndConditions from '~pages/TermsAndConditions';
import TopNavBar from '~components/TopNavBar';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="dark">
      <AuthProvider>
        <Router>
          <TopNavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  </React.StrictMode>
);