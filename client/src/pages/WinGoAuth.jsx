
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WinGoAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const endpoint = isLogin ? '/api/wingo/login' : '/api/wingo/signup';
            const res = await axios.post(endpoint, formData);

            if (res.data.user) {
                // Save to WinGo_user key to isolate the session
                localStorage.setItem('WinGo_user', JSON.stringify(res.data.user));
                navigate('/wingo/dashboard');
            }
        } catch (err) {
            alert(err.response?.data?.message || "Authentication failed.");
            console.error("WinGo Auth Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans overflow-x-hidden"
            style={{ background: 'linear-gradient(180deg, #869ff1 0%, #3906e8 50%, #b6d0fe 100%)' }}>

            {/* Banner Section */}
            <div className="flex justify-center pt-2 px-4">
                <img
                    src="https://i.ibb.co/bMvGfgFg/wingo-bannr.png"
                    className="w-full max-w-[320px] h-auto rounded-[35px] shadow-2xl"
                    alt="Win Go Hack Banner"
                />
            </div>

            <main className="flex-1 flex flex-col items-center px-6 pt-4 pb-32">

                {/* Auth Card with Theme Colors */}
                <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-[32px] p-8 border border-white/20 shadow-2xl">

                    <h2 className="text-2xl font-black italic text-white mb-8 text-center uppercase tracking-tighter">
                        {isLogin ? 'Login to WinGo' : 'Create WinGo Account'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-black italic text-white ml-4 uppercase">Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full bg-[#f5f8ff] text-[#1e1a8e] placeholder:text-gray-400 py-2 px-6 rounded-2xl font-bold shadow-inner outline-none border-none text-lg"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-black italic text-white ml-4 uppercase">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-[#f5f8ff] text-[#1e1a8e] placeholder:text-gray-400 py-2 px-6 rounded-2xl font-bold shadow-inner outline-none border-none text-lg"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        {/* Theme-matching Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1e1a8e] border-[3px] border-white text-white py-2 rounded-xl font-black text-xl italic shadow-[0_5px_0_white] active:shadow-none active:translate-y-1 transition-all mt-4 disabled:opacity-50"
                        >
                            {loading ? 'PROCESSING...' : (isLogin ? 'LOGIN NOW' : 'SIGNUP NOW')}
                        </button>
                    </form>

                    {/* Toggle Auth Mode */}
                    <div className="mt-8 text-center">
                        <p className="text-white font-bold text-sm">
                            {isLogin ? "Don't have an account?" : "Already a member?"}
                        </p>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[#ccff00] font-black italic underline mt-1 uppercase text-sm"
                        >
                            {isLogin ? 'Register Here' : 'Login Here'}
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer Buttons with Functional Links */}
            <div className="mb-6 flex justify-center gap-5 z-50">
                <a href="https://wa.me/919875736055" target="_blank" rel="noreferrer">
                    <img src="https://i.ibb.co/W4T5WthP/whatsapp.png" className="w-10 h-10" alt="whatsapp" />
                </a>
                <a href="https://t.me/modapksh" target="_blank" rel="noreferrer">
                    <img src="https://i.ibb.co/gxJTLq0/telegram.png" className="w-10 h-10" alt="telegram" />
                </a>
                <a href="https://www.youtube.com/watch?v=-HdcugtTRN4" target="_blank" rel="noreferrer">
                    <img src="https://i.ibb.co/QqxWJXm/youtube.png" className="w-10 h-10" alt="youtube" />
                </a>
            </div>
        </div>
    );
};

export default WinGoAuth;