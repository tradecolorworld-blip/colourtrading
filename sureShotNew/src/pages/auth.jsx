import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Lock, LogIn, UserPlus, Send, Headset, Youtube } from 'lucide-react';
import axios from 'axios';

// Domain Configuration Helper
const getDomainConfig = () => {
    const host = window.location.hostname;
    if (host.includes('sureshotpro.sbs')) {
        return {
            variant: 'sure1',
            storageKey: 'SURE1PRO_user',
            whatsapp: '919116046055',
            telegram: 'modapksh',
            youtube: 'https://youtu.be/qQAtpOn-tFw'
        };
    }
    if (host.includes('sureshothack.pro')) {
        return {
            variant: 'sure2',
            storageKey: 'SURE2PRO_user',
            whatsapp: '919001410711',
            telegram: 'modapksales',
            youtube: 'https://youtu.be/qQAtpOn-tFw'
        };
    }
    if (host.includes('sureshotxpro.sbs')) {
        return {
            variant: 'sure3',
            storageKey: 'SURE3PRO_user',
            whatsapp: '917891202468',
            telegram: 'hackerbabaji1',
            youtube: 'https://youtu.be/qQAtpOn-tFw'
        };
    }
    return { variant: 'sure1', storageKey: 'SURE_test_user', whatsapp: '919116046055', telegram: 'modapksh', youtube: '' };
};

const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ phone: '', password: '' });
    const navigate = useNavigate();

    const { variant, storageKey, whatsapp, telegram, youtube } = getDomainConfig();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { phone, password } = formData;
        const phoneRegex = /^[0-9]{10}$/;

        if (!phone) return alert("Please enter your phone number.");
        if (!phoneRegex.test(phone)) return alert("Invalid Phone Number! Please enter exactly 10 digits.");
        if (password.length < 6) return alert("Password is too short! It must be at least 6 characters long.");

        setLoading(true);

        try {
            const endpoint = isLogin ? '/api/sureshotnew/login' : '/api/sureshotnew/signup';
            const res = await axios.post(endpoint, { ...formData, variant });

            if (res.data.user) {
                localStorage.setItem(storageKey, JSON.stringify(res.data.user));
                navigate('/portal');
            }
        } catch (err) {
            alert(err.response?.data?.message || "Authentication failed. Please check details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0D0620] via-[#1A0535] to-[#2D0A5C] text-[#F5F0FF] font-['Poppins'] p-4 relative overflow-x-hidden selection:bg-[#F59E0B] selection:text-[#0D0620]">
            
            {/* Background Decor - Particles & Glows matching the HTML theme */}
            <div 
                className="fixed inset-0 pointer-events-none z-0 opacity-40"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.08) 1px, transparent 1px), radial-gradient(circle, rgba(168,85,247,0.06) 1px, transparent 1px)',
                    backgroundSize: '60px 60px, 90px 90px',
                    backgroundPosition: '0 0, 30px 30px'
                }}
            />
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-[#7C3AED]/20 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#F59E0B]/10 rounded-full blur-[80px] animate-pulse" />
            </div>

            {/* Top Gold Divider Line */}
            <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent z-50 opacity-80" />

            <div className="relative z-10 max-w-[420px] mx-auto pt-8 pb-12">
                {/* Header Branding */}
                <div className="text-center mb-8">
                    <div className="w-[80px] h-[80px] mx-auto mb-4  flex items-center justify-center">
                        <img src="https://i.ibb.co/bjw5cRXm/sure-Shot.png" alt="Logo" className="w-[80px] h-[80px]" />
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-white drop-shadow-md">
                        Sure Shot <span className="text-[#F59E0B] drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]">PRO</span>
                    </h1>
                    <p className="text-[11px] font-bold text-[#A855F7] mt-1 uppercase tracking-[3px]">Game Hub Access</p>
                </div>

                {/* Glassmorphic Auth Card */}
                <div className="bg-[#1E0A3C]/80 border border-[#F59E0B]/30 backdrop-blur-xl rounded-[28px] p-8 shadow-[0_8px_32px_rgba(124,58,237,0.35)] relative overflow-hidden">
                    
                    {/* Top Accent Tag (VIP Gold) */}
                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-[#F59E0B] to-[#D97706] text-[#0D0620] px-5 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                        {isLogin ? 'Login' : 'Signup'}
                    </div>

                    <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-tight flex items-center gap-2">
                        {isLogin ? 'Welcome Back' : 'Join the Club'}
                        <span className="text-[#F59E0B] text-xl">✦</span>
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Phone Input */}
                        <div className="space-y-2 text-left">
                            <label className="text-[11px] font-bold text-[#C4B5FD] ml-2 uppercase flex items-center gap-1.5 tracking-wider">
                                <Phone size={12} className="text-[#F59E0B]" /> Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="Enter 10 digits"
                                className="w-full bg-[#0D0620]/60 border border-[#7C3AED]/40 focus:border-[#F59E0B] text-white py-4 px-6 rounded-2xl font-bold outline-none transition-all shadow-inner placeholder-[#8B7CB8]/50 focus:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                                maxLength={10}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2 text-left">
                            <label className="text-[11px] font-bold text-[#C4B5FD] ml-2 uppercase flex items-center gap-1.5 tracking-wider">
                                <Lock size={12} className="text-[#F59E0B]" /> Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-[#0D0620]/60 border border-[#7C3AED]/40 focus:border-[#F59E0B] text-white py-4 px-6 rounded-2xl font-bold outline-none transition-all shadow-inner placeholder-[#8B7CB8]/50 focus:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] border border-[#F59E0B]/80 text-white py-4 rounded-2xl font-black text-lg shadow-[0_0_18px_rgba(168,85,247,0.4)] flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:border-[#F59E0B] disabled:opacity-70 mt-6 uppercase tracking-wide"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                isLogin ? <><LogIn size={20} /> Login Now</> : <><UserPlus size={20} /> Create Account</>
                            )}
                        </motion.button>
                    </form>

                    {/* Toggle Auth Mode */}
                    <div className="mt-8 pt-6 border-t border-[#7C3AED]/20 text-center">
                        <p className="text-[#8B7CB8] font-bold text-xs tracking-wider">
                            {isLogin ? "DON'T HAVE AN ACCOUNT?" : "ALREADY A MEMBER?"}
                        </p>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[#F59E0B] font-black underline mt-2 uppercase text-sm hover:text-[#FBBF24] transition-colors drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                        >
                            {isLogin ? 'Register Here' : 'Login Here'}
                        </button>
                    </div>
                </div>

                {/* Bottom Contact Dock (Styled to match theme tags) */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                    <button
                        onClick={() => window.open(`https://wa.me/${whatsapp}`, '_blank')}
                        className="bg-gradient-to-br from-[#10b981] to-[#059669] border border-[#34d399]/40 text-white py-3 rounded-xl font-bold text-[10px] shadow-[0_4px_15px_rgba(16,185,129,0.3)] flex flex-col items-center gap-1 active:scale-95 transition-all hover:border-[#34d399]"
                    >
                        <Headset size={16} /> WHATSAPP
                    </button>
                    <button
                        onClick={() => window.open(`https://t.me/${telegram}`, '_blank')}
                        className="bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] border border-[#A855F7]/40 text-white py-3 rounded-xl font-bold text-[10px] shadow-[0_4px_15px_rgba(124,58,237,0.3)] flex flex-col items-center gap-1 active:scale-95 transition-all hover:border-[#A855F7]"
                    >
                        <Send size={16} /> TELEGRAM
                    </button>
                    <button
                        onClick={() => window.open(youtube, '_blank')}
                        className="bg-gradient-to-br from-[#ef4444] to-[#dc2626] border border-[#f87171]/40 text-white py-3 rounded-xl font-bold text-[10px] shadow-[0_4px_15px_rgba(239,68,68,0.3)] flex flex-col items-center gap-1 active:scale-95 transition-all hover:border-[#f87171]"
                    >
                        <Youtube size={16} /> YOUTUBE
                    </button>
                </div>

                <p className="mt-8 text-center text-[10px] font-bold text-[#8B7CB8] uppercase tracking-widest">
                    Version v5.0 • Nexus Arcade
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