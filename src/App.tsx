import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Setup Pages
import BusinessInfo from './pages/setup/BusinessInfo';
import BrandIdentity from './pages/setup/BrandIdentity';

// Main App Pages
import Dashboard from './pages/app/Dashboard';
import ContentGenerator from './pages/app/ContentGenerator';
import Schedule from './pages/app/Schedule';
import Settings from './pages/app/Settings';

// Auth Provider
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Setup Routes */}
          <Route path="/setup/business-info" element={
            <ProtectedRoute>
              <BusinessInfo />
            </ProtectedRoute>
          } />
          <Route path="/setup/brand-identity" element={
            <ProtectedRoute>
              <BrandIdentity />
            </ProtectedRoute>
          } />
          
          {/* App Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/content" element={
            <ProtectedRoute>
              <ContentGenerator />
            </ProtectedRoute>
          } />
          <Route path="/schedule" element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          {/* Default Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
