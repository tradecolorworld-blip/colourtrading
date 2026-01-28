import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

// 🔒 1. Create a Protection Component
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  // If no user exists, redirect to signup
  if (!user || !user.phone) {
    return <Navigate to="/signup" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0e172a] text-white">
        <Routes>
          {/* Default Route: Redirect to Signup */}
          <Route path="/" element={<Navigate to="/signup" replace />} />
          
          <Route path="/signup" element={<Signup />} />
          
          {/* 🛡️ 2. Wrap Dashboard in Protection */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all: Redirect unknown paths to Signup */}
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;