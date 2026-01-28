import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showError, setShowError] = useState(false); // Red error
    const [showSuccess, setShowSuccess] = useState(false); // Green success
    const [activeTooltip, setActiveTooltip] = useState(null); // 'phone' or 'password'
    const [formData, setFormData] = useState({ phone: '', password: '' });

    // 1. Update the onChange to clear tooltips immediately
    const handlePhoneChange = (e) => {
        const val = e.target.value.replace(/\D/g, ""); // Only numbers
        setFormData({ ...formData, phone: val });
        if (activeTooltip === 'phone') setActiveTooltip(null); // Hide if typing
    };

    const handlePasswordChange = (e) => {
        setFormData({ ...formData, password: e.target.value });
        if (activeTooltip === 'password') setActiveTooltip(null); // Hide if typing
    };

    // 2. Refined Submit Logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowError(false); // Reset error box
        setShowSuccess(false);

        if (!formData.phone || formData.phone.length < 10) {
            setActiveTooltip('phone');
            // Hide automatically after 3 seconds if user does nothing
            setTimeout(() => setActiveTooltip(null), 3000);
            return;
        }

        if (!formData.password) {
            setActiveTooltip('password');
            setTimeout(() => setActiveTooltip(null), 3000);
            return;
        }

        // Logic for Login/Signup remains same...

        try {
            if (!isLogin) {
                // API Call: Register
                console.log("register api call",formData)
                const res = await axios.post('http://localhost:5000/api/auth/register', formData);
                console.log(res)
                if (res.status === 201) {
                    setShowSuccess(true);
                    setTimeout(() => {
                        setShowSuccess(false);
                        setIsLogin(true);
                        setFormData({ phone: '', password: '' });
                    }, 3000);
                }
            } else {
                // API Call: Login
                console.log("login api call",formData)
                const res = await axios.post('http://localhost:5000/api/auth/login', formData);
                console.log(res)

                // Save user data (including isVip status) for the Dashboard
                localStorage.setItem('user', JSON.stringify(res.data));

                // Redirect to Dashboard
                navigate('/dashboard');
            }
        } catch (err) {
            // Logic for Login Error Flow (image_e5567f.png)
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
        }
    };



    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0e172a] p-4 font-sans">
            <div className="w-[90%] max-w-85 bg-[#020617] rounded-[18px] p-5.5 flex flex-col items-center shadow-2xl relative">

                {/* Success Banner (image_e5d2fb.png) */}
                {showSuccess && (
                    <div className="w-full bg-[#2d4a3b] text-[#a7f3d0] text-[13px] p-3 rounded-[10px] mb-4 text-center border border-[#3e5a4a] animate-in fade-in slide-in-from-top-2">
                        Account created successfully. Please login with registered mobile number & password.
                    </div>
                )}

                {/* Profile/Logo */}
                <div className="w-20 rounded-full mb-2.5">
                    <img
                        src="https://colourtradinghack.com/icons/logo.png"
                        alt="Logo"
                        className="w-full h-full object-cover rounded-full "
                    />
                </div>

                <h2 className="text-2xl font-bold text-white mb-[0.83rem] mt-3">Number Pattern Hack</h2>

                <form className="w-full" onSubmit={handleSubmit}>
                    {/* Mobile Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Mobile Number"
                            value={formData.phone}
                            maxLength={10}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={`w-full bg-[#020617] border mt-3 border-slate-800 rounded-full py-2 px-6 text-slate-300 focus:outline-none transition-colors ${activeTooltip === 'phone' ? 'border-[#38bdf8] ring-1 ring-[#38bdf8]' : 'focus:border-[#0060cc]'}`}
                        />
                        {activeTooltip === 'phone' && <Tooltip msg="Please fill in this field." />}
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={`w-full bg-[#020617] mt-3 border border-slate-800 rounded-full py-2 px-6 text-slate-300 focus:outline-none transition-colors ${activeTooltip === 'password' ? 'border-[#38bdf8] ring-1 ring-[#38bdf8]' : 'focus:border-[#0060cc]'}`}
                        />
                        {activeTooltip === 'password' && <Tooltip msg="Please fill in this field." />}
                    </div>

                    <button className="w-full bg-linear-to-r from-[#38bdf8] to-[#6366f1] text-white font-bold py-2 rounded-full mt-3 active:scale-95 transition-transform">
                        {isLogin ? 'Login' : 'Create Account'}
                    </button>
                </form>

                {/* Error Banner (image_e5567f.png) */}
                {showError && (
                    <div className="w-full bg-[#7f1d1d] text-white text-[15px] py-2.5 rounded-[10px] mt-3 text-center animate-in zoom-in duration-200">
                        Invalid login details
                    </div>
                )}

                <p
                    onClick={() => { setIsLogin(!isLogin); setShowError(false); setShowSuccess(false); }}
                    className="text-[#38bdf8] text-sm mb-3 mt-3 cursor-pointer hover:underline"
                >
                    {isLogin ? 'Create account' : 'Already have an account? Login'}
                </p>
            </div>
        </div>
    );
};

// Reusable Tooltip matching image_e5d2ba.png
const Tooltip = ({ msg }) => (
    <div className="absolute left-1/2 -translate-x-1/2 top-[105%] z-20 flex flex-col items-center animate-in zoom-in duration-150">
        <div className="w-3 h-3 bg-white rotate-45 -mb-2 border-l border-t border-[#808080]"></div>
        <div className="bg-white text-black text-[13.5px] py-1.5 px-3 rounded shadow-xl flex items-center gap-2 border border-[#808080] min-w-max">
            <span className="bg-[#ff8c03] text-white rounded-sm px-2 font-bold">!</span>
            {msg}
        </div>
    </div>
);

export default Signup;