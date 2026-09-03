import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthScreen from './pages/auth';
import GamePortal from './pages/portal';
import GameScreen from './pages/game';
import AdminPanel from './pages/AdminPanel';

// 🟢 Domain Detect karne wala helper (Must match Auth and Portal)
const getDomainConfig = () => {
    const host = window.location.hostname;
    if (host.includes('sureshotpro.sbs')) return { variant: 'sure1', storageKey: 'SURE1PRO_user' };
    if (host.includes('sureshothack.pro')) return { variant: 'sure2', storageKey: 'SURE2PRO_user' };
    if (host.includes('sureshotxpro.sbs')) return { variant: 'sure3', storageKey: 'SURE3PRO_user' };
    return { variant: 'sure1', storageKey: 'SURE_test_user' };
};

// 🔐 Protected Route: Check karega ki user logged in hai ya nahi
const ProtectedRoute = ({ children }) => {
    const { storageKey } = getDomainConfig();
    const user = JSON.parse(localStorage.getItem(storageKey));

    if (!user || !user.phone) {
        return <Navigate to="/auth" replace />;
    }
    return children;
};

function App() {
    return (
        <BrowserRouter basename="/sureshotnew">
            <div className="min-h-screen bg-[#F8FAFC]">
                <Routes>
                    {/* Default Route: Seedha Auth par bhejo */}
                    <Route path="/" element={<Navigate to="/auth" replace />} />

                    {/* Auth Routes */}
                    <Route path="/auth" element={<AuthScreen />} />
                    {/* <Route path="/portal" element={<GamePortal />} />
                    <Route path="/game" element={<GameScreen />} /> */}

                    {/* Protected Portal & Game Routes */}
                    {/* uncomment bellow */}
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

                    <Route path="/admin/sure-control" element={<AdminPanel />} />

                    {/* 404/Wrong Path handling */}
                    <Route path="*" element={<Navigate to="/auth" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;