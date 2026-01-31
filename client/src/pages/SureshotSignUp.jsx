import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SureShotAuth = () => {
    // Default state is Login
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Mock form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!isLogin) {
                // 🟢 SIGNUP API CALL with Auto-Login
                if (formData.password !== formData.confirmPassword) {
                    alert("Passwords do not match!");
                    setLoading(false);
                    return;
                }

                const res = await axios.post('/api/sureshot/signup', {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });

                if (res.status === 201 && res.data.user) {
                    // Save to Sure_user key and go to dashboard immediately
                    localStorage.setItem('Sure_user', JSON.stringify(res.data.user));
                    navigate('/sureshot/dashboard');
                }
            } else {
                // 🟢 LOGIN API CALL
                const res = await axios.post('/api/sureshot/login', {
                    email: formData.email,
                    password: formData.password
                });

                if (res.data.user) {
                    // Save to Sure_user key
                    localStorage.setItem('Sure_user', JSON.stringify(res.data.user));
                    navigate('/sureshot/dashboard');
                }
            }
        } catch (err) {
            alert(err.response?.data?.message || "Authentication failed. Please try again.");
            console.error("SureShot Auth Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-inter text-[#f7fafc]"
            style={{
                background: `
                    radial-gradient(1000px 320px at 50% 10%, rgba(255,59,16,.22), transparent 60%),
                    radial-gradient(1000px 320px at 50% 90%, rgba(23,230,255,.20), transparent 60%),
                    #05070b`
            }}>

            <div className="w-full max-w-130 text-center">

                {/* Logo + Title Section */}
                <div className="flex flex-col items-center gap-2 mb-4">
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/colour-trading-hack-73283.appspot.com/o/sureshothack%20logo.png?alt=media&token=e8bfd014-4ab5-4bf3-ac14-96df789d284e"
                        alt="SureShot_Hack Logo"
                        className="w-19.5 h-19.5 rounded-2xl shadow-[0_8px_28px_rgba(255,59,16,0.35)]"
                    />
                    <h1 className="font-black text-5xl tracking-tight text-white">
                        SureShot_Hack
                    </h1>
                </div>

                {/* Segmented Tab Switcher */}
                <div className="grid grid-cols-2 gap-4 my-4">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`py-1.5 rounded-2xl font-extrabold text-lg transition-all duration-300 ${isLogin
                                ? 'bg-[#ff3b10] text-white shadow-[0_12px_28px_rgba(255,59,16,0.45),0_0_0_6px_rgba(255,59,16,0.18)]'
                                : 'bg-[#181a1f] text-[#f1f5f9] shadow-lg'
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`py-1.5 rounded-2xl font-extrabold text-lg transition-all duration-300 ${!isLogin
                                ? 'bg-[#ff3b10] text-white shadow-[0_12px_28px_rgba(255,59,16,0.45),0_0_0_6px_rgba(255,59,16,0.18)]'
                                : 'bg-[#181a1f] text-[#f1f5f9] shadow-lg'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Authentication Card */}
                <div className="bg-[#0d1117] rounded-[22px] px-6 py-5 border border-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                    <form onSubmit={handleSubmit} className="text-left space-y-4">

                        {!isLogin && (
                            <div>
                                <label className="block font-bold mb-1 ml-1 text-[#ffdfe0]">Full Name</label>
                                <input
                                    className="w-full bg-[#0b0f14] border border-white/10 rounded-2xl p-4 text-[#e9eef6] outline-none focus:ring-4 focus:ring-[#ff3b10]/20 focus:border-[#ff3b10]/50 transition-all"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block font-bold mb-2 ml-1 text-[#ffdfe0]">Email</label>
                            <input
                                type="email"
                                className="w-full bg-[#0b0f14] border border-white/10 rounded-2xl p-4 text-[#e9eef6] outline-none focus:ring-4 focus:ring-[#ff3b10]/20 focus:border-[#ff3b10]/50 transition-all"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block font-bold mb-2 ml-1 text-[#ffdfe0]">Password</label>
                            <input
                                type="password"
                                className="w-full bg-[#0b0f14] border border-white/10 rounded-2xl p-4 text-[#e9eef6] outline-none focus:ring-4 focus:ring-[#ff3b10]/20 focus:border-[#ff3b10]/50 transition-all"
                                placeholder={isLogin ? "••••••••" : "Min 6 characters"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block font-bold mb-2 ml-1 text-[#ffdfe0]">Confirm Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-[#0b0f14] border border-white/10 rounded-2xl p-4 text-[#e9eef6] outline-none focus:ring-4 focus:ring-[#ff3b10]/20 focus:border-[#ff3b10]/50 transition-all"
                                    placeholder="Re-enter password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-[#ff3b10] text-white py-4 mt-2 rounded-[26px] font-black text-xl shadow-[0_16px_40px_rgba(255,59,16,0.45)] active:translate-y-px transition-all"
                        >
                            {isLogin ? 'Login' : 'Create Account'}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-[#b6bac5] text-sm">
                    Need help? <a href="/" className="text-[#ffd5cc] no-underline hover:underline">Back to Home</a>
                </div>
            </div>
        </div>
    );
};

export default SureShotAuth;