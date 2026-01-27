import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
// import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      {/* Global Wrapper for the deep navy background */}
      <div className="min-h-screen bg-[#0e172a] text-white">
        <Routes>
          {/* Default Route: Redirect to Signup */}
          <Route path="/" element={<Navigate to="/signup" replace />} />
          
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/login" element={<Login />} /> */}
          
          {/* Catch-all for 404s */}
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;