import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import JoinTelegram from './pages/JoinTelegram'; // 🟢 Import your new page

// 🔒 Protection Component (For Logged-in Users Only)
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.phone) {
    return <Navigate to="/signup" replace />;
  }
  return children;
};

// 🔓 Public Component (Redirects to Dashboard if already logged in)
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
          {/* 1. Standard Routes (No Auth Needed) */}
          {/* This is the page you will use for your Ads */}
          <Route path="/join" element={<JoinTelegram />} /> 
          
          {/* 2. Auth Routes (Redirects if logged in) */}
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
          
          {/* 3. Protected Routes (Redirects if logged out) */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* 4. Navigation Logic */}
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;