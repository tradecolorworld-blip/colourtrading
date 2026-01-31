import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import JoinTelegram from './pages/JoinTelegram'; // 🟢 Import your new page

import NeonSignup from './pages/NeonSignup';
import NeonDashboard from './pages/NeonDashboard';

import JalwaDarkSignup from './pages/JalwaSignUp';
import JalwaDashboard from './pages/JalwaDashboard';

import SureShotAuth from './pages/SureshotSignUp';
import SureShotDashboard from './pages/SureShotDasboard';

// 🔒 Protection Component (For Logged-in Users Only)
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.phone) {
    return <Navigate to="/signup" replace />;
  }
  return children;
};

// 🔒 2. Neon Protection (Uses 'neon_user' key)
const NeonProtectedRoute = ({ children }) => {
  const neonUser = JSON.parse(localStorage.getItem('neon_user'));
  if (!neonUser || !neonUser.email) {
    return <Navigate to="/neon/signup" replace />;
  }
  return children;
};

// 🔒 3. jalwa Protection (Uses 'neon_user' key)
const JalwaProtectedRoute = ({ children }) => {
  const jalwaUser = JSON.parse(localStorage.getItem('Jalwa_user'));
  if (!jalwaUser || !jalwaUser.email) {
    return <Navigate to="/jalwa/signup" replace />;
  }
  return children;
};

// 🔒 4. sureshot Protection (Uses 'neon_user' key)
const SureShotProtectedRoute = ({ children }) => {
  const sureUser = JSON.parse(localStorage.getItem('Sure_user'));
  if (!sureUser || !sureUser.email) {
    return <Navigate to="/sureshot/signup" replace />;
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

const NeonPublicRoute = ({ children }) => {
  const neonUser = JSON.parse(localStorage.getItem('neon_user'));
  if (neonUser && neonUser.email) {
    return <Navigate to="/neon/dashboard" replace />;
  }
  return children;
};

const JalwaPublicRoute = ({ children }) => {
  const jalwaUser = JSON.parse(localStorage.getItem('Jalwa_user'));
  if (jalwaUser && jalwaUser.email) {
    return <Navigate to="/jalwa/dashboard" replace />;
  }
  return children;
};

const SureShotPublicRoute = ({ children }) => {
  const sureUser = JSON.parse(localStorage.getItem('Sure_user'));
  if (sureUser && sureUser.email) {
    return <Navigate to="/sureshot/dashboard" replace />;
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

          {/* --- 🟢 NEON MOD UNIVERSE (New Endpoint: /neon) --- */}
          <Route path="/neon">
            {/* Redirect /neon to /neon/signup automatically */}
            <Route index element={<Navigate to="signup" replace />} />

            <Route path="signup" element={
              <NeonPublicRoute>
                <NeonSignup />
              </NeonPublicRoute>
            } />

            <Route path="dashboard" element={
              <NeonProtectedRoute>
                <NeonDashboard />
              </NeonProtectedRoute>
            } />
          </Route>

          {/* --- 🟢 Jalw MOD UNIVERSE (New Endpoint: /neon) --- */}
          <Route path="/jalwa">
            {/* Redirect /neon to /neon/signup automatically */}
            <Route index element={<Navigate to="signup" replace />} />

            <Route path="signup" element={
              <JalwaPublicRoute>
                <JalwaDarkSignup />
              </JalwaPublicRoute>
            } />

            <Route path="dashboard" element={
              <JalwaProtectedRoute>
                <JalwaDashboard />
              </JalwaProtectedRoute>
            } />
          </Route>
          

          {/* --- 🟢 sureshot MOD UNIVERSE (New Endpoint: /neon) --- */}
          <Route path="/sureshot">
            {/* Redirect /neon to /neon/signup automatically */}
            <Route index element={<Navigate to="signup" replace />} />

            <Route path="signup" element={
              <SureShotPublicRoute>
                <SureShotAuth />
              </SureShotPublicRoute>
            } />

            <Route path="dashboard" element={
              <SureShotProtectedRoute>
                <SureShotDashboard />
              </SureShotProtectedRoute>
            } />
          </Route>



          {/* --- NAVIGATION LOGIC --- */}
          {/* 🟢 Root domain now leads to Original Signup */}
          <Route path="/" element={<Navigate to="/signup" replace />} />

          {/* 🟢 Catch-all unknown routes also lead to Original Signup */}
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;