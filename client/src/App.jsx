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

import NumberHackAuth from './pages/NumberHackAuth';
import NumberHackDashboard from './pages/NumberHackDashboard';
import AdminDashboard from './pages/AdminDashboard';

// 🟢 New WinGo Imports
import WinGoAuth from './pages/WinGoAuth';
import WinGoHackDashboard from './pages/WinGoHackDashboard';

import MASAuth from './pages/mas/auth';         // Aapki Login/Signup Screen
import MASPortal from './pages/mas/portal';       // Aapki Game Selection Screen
import MASGame from './pages/mas/game';

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

// 🔒 5. Number Hack Protection (Uses 'NumberHack_user' key)
const NumberHackProtectedRoute = ({ children }) => {
  const numUser = JSON.parse(localStorage.getItem('NumberHack_user'));
  if (!numUser || !numUser.email) {
    return <Navigate to="/numberhack/signup" replace />;
  }
  return children;
};

// 🔒 6. WinGo Protection (Uses 'WinGo_user' key)
const WinGoProtectedRoute = ({ children }) => {
  const winUser = JSON.parse(localStorage.getItem('WinGo_user'));
  if (!winUser || !winUser.email) {
    return <Navigate to="/wingo/signup" replace />;
  }
  return children;
};

const MASProtectedRoute = ({ children }) => {
  // Internal key name is 'MAS_user'
  const user = JSON.parse(localStorage.getItem('MAS_user'));
  if (!user || !user.email) {
    return <Navigate to="/mas/auth" replace />;
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

// 🔓 6. Number Hack Public Route
const NumberHackPublicRoute = ({ children }) => {
  const numUser = JSON.parse(localStorage.getItem('NumberHack_user'));
  if (numUser && numUser.email) {
    return <Navigate to="/numberhack/dashboard" replace />;
  }
  return children;
};

// 🔓 7. WinGo Public Route
const WinGoPublicRoute = ({ children }) => {
  const winUser = JSON.parse(localStorage.getItem('WinGo_user'));
  if (winUser && winUser.email) {
    return <Navigate to="/wingo/dashboard" replace />;
  }
  return children;
};

const MASPublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('MAS_user'));
  if (user && user.email) {
    return <Navigate to="/mas/portal" replace />;
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
          <Route path="/admin-master" element={<AdminDashboard />} />
          {/* <Route path="/admin-dashboard" element={<WinGoHackDashboard />} /> */}
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

          {/* --- 🟢 7. NUMBER HACK UNIVERSE (New Endpoint: /numberhack) --- */}
          <Route path="/numberhack">
            <Route index element={<Navigate to="signup" replace />} />

            <Route path="signup" element={
              <NumberHackPublicRoute>
                <NumberHackAuth />
              </NumberHackPublicRoute>
            } />

            <Route path="dashboard" element={
              <NumberHackProtectedRoute>
                <NumberHackDashboard />
              </NumberHackProtectedRoute>
            } />
          </Route>

          {/* --- 🟢 8. WIN GO HACK UNIVERSE (New Endpoint: /wingo) --- */}
          <Route path="/wingo">
            <Route index element={<Navigate to="signup" replace />} />
            <Route path="signup" element={
              <WinGoPublicRoute>
                <WinGoAuth />
              </WinGoPublicRoute>
            } />
            <Route path="dashboard" element={
              <WinGoProtectedRoute>
                <WinGoHackDashboard />
              </WinGoProtectedRoute>
            } />
          </Route>

          <Route path="/mas">
            <Route index element={<Navigate to="auth" replace />} />
            <Route path="auth" element={
              <MASPublicRoute>
                <MASAuth />
              </MASPublicRoute>
            } />
            <Route path="portal" element={
              <MASProtectedRoute>
                <MASPortal />
              </MASProtectedRoute>
            } />
            <Route path="game" element={
              <MASProtectedRoute>
                <MASGame />
              </MASProtectedRoute>
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