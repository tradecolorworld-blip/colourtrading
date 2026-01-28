import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

// 🔒 1. Create a Protection Component
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('user',user)
  // If no user exists, redirect to signup
  if (!user || !user.phone) {
    return <Navigate to="/signup" replace />;
  }
  
  return children;
};

// 🔓 Redirect if already logged in
const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.phone) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0e172a] text-white">
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          
          {/* 🟢 Wrap Signup so logged-in users can't see it */}
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;