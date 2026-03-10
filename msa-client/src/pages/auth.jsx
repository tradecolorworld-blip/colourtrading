import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, UserPlus, Send, Headset, Youtube, Star } from 'lucide-react';
import axios from 'axios';

// 🟢 NEW: Domain Configuration Helper (Matches App.jsx)
const getDomainConfig = () => {
    const host = window.location.hostname;
    if (host.includes('bigsmalltrading.sbs')) {
        return {
            variant: 'msa1',
            storageKey: 'MSA1_user',
            whatsapp: '919875736055',
            telegram: 'modapksh',
            youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4'
        };
    }
    if (host.includes('bigsmallhack.sbs')) {
        return {
            variant: 'msa2',
            storageKey: 'MSA2_user',
            whatsapp: '919057617196',
            telegram: 'modapksales',
            youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4' // Default if not provided
        };
    }
    if (host.includes('patternhack.sbs')) {
        return {
            variant: 'msa3',
            storageKey: 'MSA3_user',
            whatsapp: '917357984291',
            telegram: 'hackerbabaji1',
            youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4' // Default if not provided
        };
    }
    return { variant: 'test', storageKey: 'MSA_test_user', whatsapp: '919116046055', telegram: 'modapksh', youtube: '' };
};

const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    // Get current domain details
    const { variant, storageKey } = getDomainConfig();
    const { whatsapp, telegram, youtube } = getDomainConfig();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 🟢 UPDATED: Using /api/mas endpoints for MAS project
            const endpoint = isLogin ? '/api/mas/login' : '/api/mas/signup';
            // 🟢 UPDATED: Sending 'variant' so backend picks the right DB Model
            const res = await axios.post(endpoint, {
                ...formData,
                variant
            });

            if (res.data.user) {
                // 🟢 UPDATED: Dynamic storage key based on domain
                localStorage.setItem(storageKey, JSON.stringify(res.data.user));

                // Redirect to the MAS Portal
                navigate('/portal');
            }
        } catch (err) {
            alert(err.response?.data?.message || "Authentication failed. Please check details.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-['Poppins'] p-4 relative overflow-x-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-50">
                <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[20%] right-[10%] w-72 h-72 bg-pink-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-[420px] mx-auto pt-10">
                {/* Header Branding */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black italic tracking-tighter text-[#1e293b]">
                        NUMBER <span className="text-indigo-600 underline decoration-indigo-200">HACK</span>
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-[3px]">The Ultimate Prediction Tool</p>
                </div>

                {/* Auth Card */}
                <div className="bg-white border border-[#E2E8F0] rounded-[28px] p-8 shadow-xl relative overflow-hidden">
                    {/* Top Accent Tag */}
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white px-5 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest shadow-md">
                        {isLogin ? 'Login' : 'Signup'}
                    </div>

                    <h2 className="text-2xl font-black text-slate-800 mb-8 uppercase tracking-tight">
                        {isLogin ? 'Welcome Back' : 'Join the Club'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div className="space-y-2 text-left">
                            <label className="text-[11px] font-black text-slate-400 ml-2 uppercase flex items-center gap-1.5">
                                <Mail size={12} /> Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full bg-[#F1F5F9] border border-transparent focus:border-indigo-500 text-slate-800 py-4 px-6 rounded-2xl font-bold outline-none transition-all shadow-inner"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2 text-left">
                            <label className="text-[11px] font-black text-slate-400 ml-2 uppercase flex items-center gap-1.5">
                                <Lock size={12} /> Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-[#F1F5F9] border border-transparent focus:border-indigo-500 text-slate-800 py-4 px-6 rounded-2xl font-bold outline-none transition-all shadow-inner"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 transition-all hover:translate-y-[-2px] disabled:opacity-70 mt-4"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                isLogin ? <><LogIn size={20} /> LOGIN NOW</> : <><UserPlus size={20} /> SIGNUP NOW</>
                            )}
                        </motion.button>
                    </form>

                    {/* Toggle Auth Mode */}
                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-slate-400 font-bold text-xs">
                            {isLogin ? "DON'T HAVE AN ACCOUNT?" : "ALREADY A MEMBER?"}
                        </p>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-indigo-600 font-black italic underline mt-2 uppercase text-sm hover:text-indigo-800"
                        >
                            {isLogin ? 'Register Here' : 'Login Here'}
                        </button>
                    </div>
                </div>



                {/* Bottom Contact Dock */}
                <div className="mt-8 grid grid-cols-3 gap-3">
                    <button
                        onClick={() => window.open(`https://wa.me/${whatsapp}`, '_blank')}
                        className="bg-emerald-500 text-white py-3 rounded-xl font-black text-[10px] shadow-lg flex flex-col items-center gap-1 active:scale-95 transition-all"
                    >
                        <Headset size={16} /> WHATSAPP
                    </button>
                    <button
                        onClick={() => window.open(`https://t.me/${telegram}`, '_blank')}
                        className="bg-indigo-500 text-white py-3 rounded-xl font-black text-[10px] shadow-lg flex flex-col items-center gap-1 active:scale-95 transition-all"
                    >
                        <Send size={16} /> TELEGRAM
                    </button>
                    <button
                        onClick={() => window.open(youtube, '_blank')}
                        className="bg-red-500 text-white py-3 rounded-xl font-black text-[10px] shadow-lg flex flex-col items-center gap-1 active:scale-95 transition-all"
                    >
                        <Youtube size={16} /> YOUTUBE
                    </button>
                </div>

                <p className="mt-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    Version v4.9 • Powered by ModApkSeller
                </p>
            </div>
        </div>
    );
};

// Loader Icon Component
const Loader2 = ({ className }) => (
    <svg className={`animate-spin h-5 w-5 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default AuthScreen;