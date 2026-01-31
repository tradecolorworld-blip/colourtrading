import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JalwaDarkSignup = () => {
    // State to handle tab switching (default 'login')
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('login');
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form data state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (activeTab === 'signup') {
                // 🟢 JALWA SIGNUP API CALL
                const res = await axios.post('/api/jalwa/signup', formData);

                if (res.status === 201 && res.data.user) {
                    setSuccess("Account created! Logging you in...");

                    // 🟢 AUTO-LOGIN: Save to JALWA_USER and redirect immediately
                    localStorage.setItem('Jalwa_user', JSON.stringify(res.data.user));

                    setTimeout(() => {
                        navigate('/jalwa/dashboard');
                    }, 1500);
                }
            } else {
                // 🟢 JALWA LOGIN API CALL (Remains the same)
                const res = await axios.post('/api/jalwa/login', formData);
                if (res.data.user) {
                    localStorage.setItem('Jalwa_user', JSON.stringify(res.data.user));
                    navigate('/jalwa/dashboard');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-5 font-inter text-[#eef6f7]"
            style={{
                background: `radial-gradient(1000px 500px at 50% 10%, rgba(242,91,58,0.06), transparent 8%), 
                              linear-gradient(180deg,#0b0f14 0%,#071014 45%,#031018 100%)`
            }}>

            <main className="w-full max-w-[900px] flex justify-center">
                <div className="w-full max-w-[760px] rounded-[28px] p-8 grid gap-[18px] backdrop-blur-[6px] border border-white/5"
                    style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.2))' }}>

                    {/* Header */}
                    <div className="text-center pt-2">
                        <img
                            src="https://jalwahack.com/assets/logo.png"
                            alt="logo"
                            className="w-[84px] h-[84px] rounded-[18px] object-cover mx-auto shadow-[0_8px_30px_rgba(242,91,58,0.16)] border border-white/5"
                        />
                        <h1 className="text-[48px] mt-3.5 mb-0 font-extrabold tracking-tight">
                            Jalwa<span className="text-[#f25b3a]">_Hack</span>
                        </h1>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-[18px] justify-center mt-2">
                        <button
                            onClick={() => setActiveTab('login')}
                            className={`px-11 py-2 rounded-[40px] font-bold cursor-pointer border border-white/5 transition-all duration-300 ${activeTab === 'login'
                                ? 'text-[#041014] bg-gradient-to-r from-[#f25b3a] to-[#ff8a5f] -translate-y-[2px]'
                                : 'bg-white/5 text-[#9aa3aa]'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setActiveTab('signup')}
                            className={`px-11 py-2 rounded-[40px] font-bold cursor-pointer border border-white/5 transition-all duration-300 ${activeTab === 'signup'
                                ? 'text-[#041014] bg-gradient-to-r from-[#f25b3a] to-[#ff8a5f] -translate-y-[2px]'
                                : 'bg-white/5 text-[#9aa3aa]'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form Section */}
                    <div className="flex justify-center pt-1.5">
                        <form onSubmit={handleSubmit} className="w-full max-w-[520px] flex flex-col gap-2.5 p-[18px] rounded-[16px] border border-white/5"
                            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005))' }}>

                            <label className="text-sm font-medium text-white/70">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                required
                                className="w-full p-3.5 rounded-[12px] border border-white/5 bg-black/35 text-white outline-none focus:border-[#f25b3a]/50 transition-colors"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />

                            <label className="text-sm font-medium text-white/70">Password</label>
                            <input
                                type="password"
                                placeholder={activeTab === 'login' ? "••••••••" : "Minimum 6 characters"}
                                required
                                className="w-full p-3.5 rounded-[12px] border border-white/5 bg-black/35 text-white outline-none focus:border-[#f25b3a]/50 transition-colors"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />

                            <button type="submit" className="w-full p-3.5 mt-2.5 rounded-[32px] border-none font-extrabold text-[#031218] bg-gradient-to-r from-[#f25b3a] to-[#ff8a5f] hover:brightness-110 active:scale-[0.98] transition-all">
                                {loading ? 'Processing...' : (activeTab === 'login' ? 'Login' : 'Sign Up')}
                            </button>
                        </form>
                    </div>

                    {/* Footer Section */}
                    <div className="text-center mt-2">
                        <p className="text-[#9aa3aa] text-sm">
                            Need help? <a href="/dashboard" className="text-inherit hover:text-white transition-colors">Back to Home</a>
                        </p>
                        <p className="mt-2.5">
                            <a
                                href="https://jalwagame1.link/#/register?invitationCode=4456842257850"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-4 py-2 text-xs font-bold rounded-lg border border-white/5 text-[#eef6f7] hover:bg-white/5 transition-all"
                            >
                                Jalwa Game Sign Up
                            </a>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JalwaDarkSignup;