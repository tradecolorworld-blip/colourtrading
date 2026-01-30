import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NeonSignup = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState(null);
    const [formData, setFormData] = useState({ email: '', password: '' });


    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowError(false);

        // Basic Validation
        if (!formData.email || !formData.email.includes('@')) {
            setActiveTooltip('email');
            setTimeout(() => setActiveTooltip(null), 3000);
            return;
        }
        if (!formData.password) {
            setActiveTooltip('password');
            setTimeout(() => setActiveTooltip(null), 3000);
            return;
        }

        try {
            if (!isLogin) {
                // 🟢 SIGNUP API CALL
                const res = await axios.post('/api/neon/signup', formData);
                if (res.status === 201) {
                    setShowSuccess(true);
                    setTimeout(() => {
                        setShowSuccess(false);
                        setIsLogin(true);
                        setFormData({ email: '', password: '' });
                    }, 3000);
                }
            } else {
                // 🟢 LOGIN API CALL
                const res = await axios.post('/api/neon/login', formData);
                console.log("Res", res.data.user)
                if (res.data.user) {
                    // 🟢 SAVE TO NEON_USER KEY (Matches App.jsx logic)
                    console.log("try to navigate")
                    localStorage.setItem('neon_user', JSON.stringify(res.data.user));
                    navigate('/neon/dashboard'); // 🟢 Redirect to new dashboard
                }
                else {
                    console.log("error aa rgya")
                }
            }
        } catch (err) {
            setShowError(true);
            console.error("Auth Error:", err.response?.data?.message || err.message);
            setTimeout(() => setShowError(false), 3000);
        }
    };

    return (
        /* 🟢 Background uses the radial gradient from your CSS */
        <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans"
            style={{ background: 'radial-gradient(circle at top, #20ff6b 0%, #111111 40%, #000000 100%)' }}>

            <div className="w-full max-w-105 text-center">
                {/* 🟢 Glow title */}
                <h1 className="text-[#00ff66] text-[28px] font-bold mb-4.5"
                    style={{ textShadow: '0 0 12px rgba(0,255,120,0.7)' }}>
                    Colour Trading Prediction
                </h1>

                {/* 🟢 Main Auth Card with linear gradient and glow */}
                <div className="bg-linear-to-br from-[#03101b] to-[#14040b] rounded-[18px] pt-6 pb-5.5 px-4.5 border border-[#00ff78]/50 shadow-[0_0_25px_rgba(0,255,120,0.3)]">

                    <h2 className="text-[#00ff66] text-xl font-semibold mb-6 uppercase tracking-wider">
                        {isLogin ? 'Login To Start' : 'Sign Up To Start'}
                    </h2>
                    {showSuccess && (
                        <div className="bg-[#225530]/10 border border-[#39d785]/20 text-[#bff7d8] text-xs p-3 rounded-lg mb-4">
                            Account created! Please login now.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white text-black py-1.5 px-6 rounded-full outline-none text-lg placeholder:text-gray-400"
                            />
                            {activeTooltip === 'phone' && <Tooltip msg="Please fill in this field." />}
                        </div>

                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-white text-black py-1.5 px-6 rounded-full outline-none text-lg placeholder:text-gray-400"
                            />
                            {activeTooltip === 'password' && <Tooltip msg="Please fill in this field." />}
                        </div>

                        {/* 🟢 Neon Button */}
                        <button className="w-[60%] bg-[#ff4b4b] text-black font-black py-1.5 rounded-full text-lg mt-4 border-2 border-[#00ff66] active:scale-95 transition-transform">
                            {isLogin ? 'Login' : 'Sign Up'}
                        </button>
                    </form>

                    {showError && (
                        <div className="text-[#ffbcbc] text-sm mt-4 animate-pulse">
                            Invalid login details
                        </div>
                    )}

                    <p
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[#58ff9a] text-sm mt-6 cursor-pointer hover:underline underline-offset-4"
                    >
                        {isLogin ? 'New User? Sign Up' : 'Already a member? Login'}
                    </p>


                </div>
                {/* 🟢 Social Buttons */}
                <div className="flex justify-between gap-2 mt-8">
                    <SocialBtn icon="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" color="#06b438" label="WHATSAPP" />
                    <SocialBtn icon="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" color="#ff3333" label="YOUTUBE" />
                    <SocialBtn icon="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" color="#00a8ff" label="TELEGRAM" />
                </div>
            </div>
        </div>
    );
};

// Internal Social Button Component
const SocialBtn = ({ icon, color, label }) => (
    <a href="#" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-[10px] font-bold text-white transition-opacity hover:opacity-80"
        style={{ backgroundColor: color }}>
        <img src={icon} className="w-4 h-4" alt={label} />
        {label}
    </a>
);

// Tooltip Component
const Tooltip = ({ msg }) => (
    <div className="absolute left-1/2 -translate-x-1/2 top-[105%] z-20 flex flex-col items-center animate-in zoom-in duration-150">
        <div className="w-3 h-3 bg-white rotate-45 -mb-2 border-l border-t border-gray-400"></div>
        <div className="bg-white text-black text-[12px] py-1 px-3 rounded shadow-lg border border-gray-400 min-w-max">
            {msg}
        </div>
    </div>
);

export default NeonSignup;