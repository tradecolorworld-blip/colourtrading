import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthScreen from './pages/auth';
import GamePortal from './pages/portal';
import GameScreen from './pages/game';
// import AdminPanel from './pages/AdminPanel';

// 🟢 Single App Storage Key
const STORAGE_KEY = 'nsspro_user';

// 🔐 Protected Route: Check karega ki user logged in hai ya nahi
const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY));

    // Agar user nahi hai ya email missing hai, to wapas auth pe bhejo
    if (!user || !user.email) {
        return <Navigate to="/auth" replace />;
    }
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-black text-white">
                <Routes>
                    {/* Default Route: Seedha Auth par bhejo */}
                    <Route path="/" element={<Navigate to="/auth" replace />} />

                    {/* Auth Route */}
                    <Route path="/auth" element={<AuthScreen />} />

                    {/* Protected Portal & Game Routes */}
                    <Route
                        path="/portal"
                        element={
                            <ProtectedRoute>
                                <GamePortal />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/game"
                        element={
                            <ProtectedRoute>
                                <GameScreen />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Panel Route */}
                    {/* <Route path="/admin/msa-control" element={<AdminPanel />} /> */}

                    {/* 404/Wrong Path handling */}
                    <Route path="*" element={<Navigate to="/auth" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;