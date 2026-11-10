import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure you have this installed

// Using the same storage key as defined in App.jsx
const STORAGE_KEY = 'nsspro_user';
// Replace with your actual backend URL or keep relative if proxy is setup
const API_BASE_URL = 'http://localhost:5000'; // Make sure to change this to your production URL later if needed

const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Validation Checks
        if (!isLogin && formData.phone.length !== 10) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }

        if (formData.password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }

        setLoading(true);

        try {
            // 2. Select Endpoint based on Tab
            const endpoint = isLogin ? `${API_BASE_URL}/api/nsspro/login` : `${API_BASE_URL}/api/nsspro/signup`;
            
            // 3. Make API Request
            const res = await axios.post(endpoint, formData);

            if (res.data.user) {
                // 4. Save User to Local Storage
                localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data.user));

                // 5. Navigate to Portal
                navigate('/portal');
            }
        } catch (err) {
            // Handle Errors smoothly
            alert(err.response?.data?.message || "Authentication failed. Please check details.");
            console.error("Auth Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        // .auth-page + mobile overrides (@media max-width:480px)
        <div className="min-h-screen relative flex sm:items-center justify-center items-start pt-[40px] sm:pt-0 p-[16px_14px] sm:p-[24px_16px] font-['Inter',sans-serif]">
            
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-[#050A08] bg-cover bg-center bg-no-repeat z-0"
                style={{ backgroundImage: "url('https://number.colourhack.sbs/images/bg-login.jpg')" }}
            ></div>
            
            {/* .auth-page::before (Dark overlay) */}
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.58)] z-10 pointer-events-none"></div>

            {/* .auth-card (Exact rgba, blur, border, shadow, and mobile padding) */}
            <div className="relative z-20 w-full max-w-[420px] bg-[rgba(4,10,6,0.85)] backdrop-blur-[18px] border border-[rgba(255,255,255,0.16)] shadow-[0_20px_60px_rgba(0,0,0,0.75)] rounded-[18px] sm:rounded-[28px] p-[28px_20px] sm:p-[44px_36px]">
                
                {/* .auth-logo */}
                <div className="text-center mb-[36px]">
                    <div className="relative inline-block mb-[16px]">
                        <img 
                            src="https://number.colourhack.sbs/images/logo.png" 
                            alt="Logo"
                            className="w-[72px] h-[72px] mx-auto rounded-[18px] object-contain shadow-[0_0_30px_rgba(123,53,217,0.4)] relative z-10"
                        />
                        {/* .auth-logo-ring */}
                        <div className="absolute inset-[-6px] rounded-[24px] border-[2px] border-[rgba(0,210,100,0.5)]"></div>
                    </div>
                    
                    {/* .auth-site-name */}
                    <h1 className="text-[24px] font-bold font-['Rajdhani',sans-serif] tracking-[0.5px] bg-gradient-to-br from-[#9B55FF] to-[#D4A017] bg-clip-text text-transparent leading-tight">
                        Number SureShot Pro
                    </h1>
                    {/* .auth-tagline */}
                    <p className="text-[12.5px] text-[#7060A0] mt-[6px] tracking-[0.3px]">
                        AI-powered colour predictions · Live
                    </p>
                </div>

                {/* .auth-tabs */}
                <div className="flex bg-[rgba(0,0,0,0.4)] border border-[rgba(120,60,220,0.15)] rounded-[14px] p-[4px] mb-[28px]">
                    <button 
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-[10px] rounded-[12px] text-[14px] font-semibold transition-all duration-200 tracking-[0.3px] ${
                            isLogin 
                            ? 'bg-gradient-to-br from-[#7B35D9] to-[#5B15A9] text-white shadow-[0_2px_16px_rgba(123,53,217,0.5)]' 
                            : 'text-[#7060a0] hover:text-[#B0A8C8]'
                        }`}
                    >
                        Login
                    </button>
                    <button 
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-[10px] rounded-[12px] text-[14px] font-semibold transition-all duration-200 tracking-[0.3px] ${
                            !isLogin 
                            ? 'bg-gradient-to-br from-[#7B35D9] to-[#5B15A9] text-white shadow-[0_2px_16px_rgba(123,53,217,0.5)]' 
                            : 'text-[#7060a0] hover:text-[#B0A8C8]'
                        }`}
                    >
                        Register
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    
                    {/* Only in Register: Full Name */}
                    {!isLogin && (
                        <div className="mb-[16px]">
                            <label className="block text-[12px] font-semibold text-[#B0A8C8] mb-[8px] tracking-[0.5px] uppercase">
                                Full name
                            </label>
                            <input
                                type="text"
                                placeholder="Your name"
                                required={!isLogin}
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-[rgba(0,0,0,0.5)] border border-[rgba(120,60,220,0.2)] rounded-[8px] px-[16px] py-[13px] text-[14.4px] text-[#F0F0F8] outline-none transition-all placeholder:text-[#7060A0] focus:border-[rgba(0,200,81,0.5)] focus:shadow-[0_0_0_3px_rgba(0,200,81,0.12)]"
                            />
                        </div>
                    )}

                    {/* Shown in both: Email Address */}
                    <div className="mb-[16px]">
                        <label className="block text-[12px] font-semibold text-[#B0A8C8] mb-[8px] tracking-[0.5px] uppercase">
                            Email address
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-[rgba(0,0,0,0.5)] border border-[rgba(120,60,220,0.2)] rounded-[8px] px-[16px] py-[13px] text-[14.4px] text-[#F0F0F8] outline-none transition-all placeholder:text-[#7060A0] focus:border-[rgba(0,200,81,0.5)] focus:shadow-[0_0_0_3px_rgba(0,200,81,0.12)]"
                        />
                    </div>

                    {/* Only in Register: Mobile Number */}
                    {!isLogin && (
                        <div className="mb-[16px]">
                            <label className="block text-[12px] font-semibold text-[#B0A8C8] mb-[8px] tracking-[0.5px] uppercase">
                                Mobile number
                            </label>
                            <input
                                type="tel"
                                placeholder="10-digit number"
                                required={!isLogin}
                                maxLength={10}
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                                className="w-full bg-[rgba(0,0,0,0.5)] border border-[rgba(120,60,220,0.2)] rounded-[8px] px-[16px] py-[13px] text-[14.4px] text-[#F0F0F8] outline-none transition-all placeholder:text-[#7060A0] focus:border-[rgba(0,200,81,0.5)] focus:shadow-[0_0_0_3px_rgba(0,200,81,0.12)]"
                            />
                        </div>
                    )}

                    {/* Shown in both: Password */}
                    <div className="mb-[16px]">
                        <label className="block text-[12px] font-semibold text-[#B0A8C8] mb-[8px] tracking-[0.5px] uppercase">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder={isLogin ? "••••••••" : "Min 8 characters"}
                            required
                            minLength={8}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-[rgba(0,0,0,0.5)] border border-[rgba(120,60,220,0.2)] rounded-[8px] px-[16px] py-[13px] text-[14.4px] text-[#F0F0F8] outline-none transition-all placeholder:text-[#7060A0] focus:border-[rgba(0,200,81,0.5)] focus:shadow-[0_0_0_3px_rgba(0,200,81,0.12)]"
                        />
                    </div>

                    {/* .btn-primary (Green Gradient) */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-[6px] p-[15px] bg-gradient-to-br from-[#00C851] to-[#007A30] hover:from-[#00E563] hover:to-[#009A40] disabled:opacity-50 text-white rounded-[8px] font-['Rajdhani',sans-serif] font-bold text-[16px] tracking-[0.8px] shadow-[0_4px_20px_rgba(0,200,81,0.35)] transition-all flex justify-center items-center gap-2"
                    >
                        {loading ? (
                           <span className="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-white rounded-full" />
                        ) : (
                            isLogin ? "Login →" : "Create Account →"
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default AuthScreen;