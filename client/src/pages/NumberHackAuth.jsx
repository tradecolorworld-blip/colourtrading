
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NumberHackAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log(isLogin ? "Logging in..." : "Signing up...", formData);
    //     // Backend API connection will be added here later
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!isLogin) {
                // 🟢 SIGNUP API CALL with Auto-Login
                const res = await axios.post('/api/numberhack/signup', formData);

                if (res.status === 201 && res.data.user) {
                    // Save to NumberHack_user key and redirect immediately
                    localStorage.setItem('NumberHack_user', JSON.stringify(res.data.user));
                    navigate('/numberhack/dashboard');
                }
            } else {
                // 🟢 LOGIN API CALL
                const res = await axios.post('/api/numberhack/login', formData);

                if (res.data.user) {
                    // Save to NumberHack_user key
                    localStorage.setItem('NumberHack_user', JSON.stringify(res.data.user));
                    navigate('/numberhack/dashboard');
                }
            }
        } catch (err) {
            alert(err.response?.data?.message || "Authentication failed. Please check your details.");
            console.error("NumberHack Auth Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans overflow-x-hidden"
            style={{ background: 'linear-gradient(to bottom, #e85d34 0%, #fdbb2d 100%)' }}>

            {/* Header */}
            <header className="flex justify-center items-center p-6 border-b border-black/10">
                <h1 className="text-4xl font-black italic tracking-tighter text-[#1a1a1a]">NUMBER HACK</h1>
            </header>

            <main className="flex-1 flex flex-col items-center px-6 pt-12">

                {/* Auth Card Container */}
                <div className="w-full max-w-sm bg-white/20 backdrop-blur-sm rounded-[32px] p-8 border border-white/30 shadow-2xl">

                    <h2 className="text-2xl font-black italic text-[#1a1a1a] mb-8 text-center uppercase">
                        {isLogin ? 'Login to Hack' : 'Create Account'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-black italic text-[#1a1a1a] ml-4 uppercase">Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full bg-[#f0f06a] text-black placeholder:text-gray-500 py-4 px-6 rounded-2xl font-bold shadow-inner outline-none border-none text-lg"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-black italic text-[#1a1a1a] ml-4 uppercase">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-[#f0f06a] text-black placeholder:text-gray-500 py-4 px-6 rounded-2xl font-bold shadow-inner outline-none border-none text-lg"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#e85d34] text-white py-4 rounded-xl font-black text-xl shadow-[0_5px_0_#a83d1d] active:shadow-none active:translate-y-1 transition-all mt-4 disabled:opacity-50"
                        >
                            {loading ? 'PROCESSING...' : (isLogin ? 'LOGIN NOW' : 'SIGNUP NOW')}
                        </button>
                    </form>

                    {/* Toggle Auth Mode */}
                    <div className="mt-8 text-center">
                        <p className="text-[#1a1a1a] font-bold text-sm">
                            {isLogin ? "Don't have an account?" : "Already a member?"}
                        </p>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-purple-800 font-black italic underline mt-1 uppercase text-sm"
                        >
                            {isLogin ? 'Register Here' : 'Login Here'}
                        </button>
                    </div>
                </div>


            </main>

            {/* Bottom Nav Dock (Consistent with Dashboard) */}
            {/* Bottom Nav Dock with Active Links */}
            <div className="fixed bottom-10 left-0 right-0 grid grid-cols-3 gap-2 p-2 bg-transparent z-50">
                <a
                    href="https://wa.me/919116046055"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#5cb85c] text-white py-3 rounded-md font-black italic text-xs shadow-md border-b-4 border-black/20 text-center no-underline active:translate-y-0.5 transition-transform"
                >
                    WHATSAPP
                </a>
                <a
                    href="https://t.me/modapksh"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#5bc0de] text-white py-3 rounded-md font-black italic text-xs shadow-md border-b-4 border-black/20 text-center no-underline active:translate-y-0.5 transition-transform"
                >
                    TELEGRAM
                </a>
                <a
                    href="https://www.youtube.com/watch?v=-HdcugtTRN4"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#d9534f] text-white py-3 rounded-md font-black italic text-xs shadow-md border-b-4 border-black/20 text-center no-underline active:translate-y-0.5 transition-transform"
                >
                    YOUTUBE
                </a>
            </div>
        </div>
    );
};

export default NumberHackAuth;