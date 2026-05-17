import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Lock, ArrowLeft, ArrowRight, Headset, Send, Youtube } from 'lucide-react';
import axios from 'axios';

/**
 * 🟢 Domain Configuration Helper
 * Ensures the app uses correct storage keys and links per domain.
 */
const getDomainConfig = () => {
    const host = window.location.hostname;
    const configs = {
        'modmenuhack.sbs': {
            variant: 'apr1',
            storageKey: 'APR1_user',
            whatsapp: '919875736055',
            telegram: 'modapksh',
            youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4'
        },
        'modmenuhack.site': {
            variant: 'apr2',
            storageKey: 'APR2_user',
            whatsapp: '918239817438',
            telegram: 'modapksales',
            youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4'
        },
        'modmenuhack.buzz': {
            variant: 'apr3',
            storageKey: 'APR3_user',
            whatsapp: '917891202468',
            telegram: 'hackerbabaji1',
            youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4'
        }
    };
    return configs[host] || { 
        variant: 'apr1', 
        storageKey: 'APR1_user', 
        whatsapp: '919875736055', 
        telegram: 'modapksh', 
        youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4' 
    };
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

        // Validation
        if (!/^[0-9]{10}$/.test(phone)) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }
        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const endpoint = isLogin ? '/api/apr/login' : '/api/apr/signup';
            const res = await axios.post(endpoint, { ...formData, variant });

            if (res.data.user) {
                localStorage.setItem(storageKey, JSON.stringify(res.data.user));
                navigate('/portal');
            }
        } catch (err) {
            // alert(err.response?.data?.message || "Authentication failed. Please try again.");
            // REMOVE the line below in production; kept for testing UI flow
            navigate('/portal'); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-['Poppins'] flex flex-col items-center pb-10">
            
            {/* 1. Header Bar */}
            <div className="w-full p-4 flex justify-between items-center mb-6">
                <button 
                    // onClick={() => navigate(-1)} 
                    className="p-2 bg-red-50 rounded-full text-red-800 active:scale-90 transition-transform"
                >
                    {/* <ArrowLeft size={22} strokeWidth={3} /> */}
                </button>
                <h1 className="text-[#1a47cc] font-black text-2xl text-center leading-tight">
                    COLOUR TRADING<br/>MOD MENU
                </h1>
                <div className="w-10 h-10"></div> {/* Layout Spacer */}
            </div>

            <div className="w-full max-w-[420px] px-6">
                
                {/* 2. Mode Indicator (The Red Button Style) */}
                <div className="flex justify-center mb-10">
                    <motion.div 
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-[#c2412e] text-white px-10 py-3.5 rounded-full font-black text-lg shadow-lg border-b-4 border-black/20 flex items-center gap-3"
                    >
                        {isLogin ? "USER LOGIN" : "CREATE ACCOUNT"}
                        {/* <div className="bg-yellow-400 text-black px-1.5 py-0.5 rounded text-[10px] font-black italic shadow-sm">
                            VIP
                        </div> */}
                    </motion.div>
                </div>

                {/* 3. Auth Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[#1a47cc] font-black text-xs ml-4 flex items-center gap-2 tracking-wider">
                            <Phone size={14} fill="#1a47cc" className="text-white" /> MOBILE NUMBER
                        </label>
                        <input
                            type="tel"
                            placeholder="Enter 10 digit number"
                            className="w-full bg-[#f0f7ff] border-2 border-[#5da2c4] py-4 px-6 rounded-full font-bold text-gray-800 outline-none focus:border-[#1a47cc] focus:bg-white transition-all shadow-inner"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            maxLength={10}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[#1a47cc] font-black text-xs ml-4 flex items-center gap-2 tracking-wider">
                            <Lock size={14} fill="#1a47cc" className="text-white" /> ACCOUNT PASSWORD
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-[#f0f7ff] border-2 border-[#5da2c4] py-4 px-6 rounded-full font-bold text-gray-800 outline-none focus:border-[#1a47cc] focus:bg-white transition-all shadow-inner"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1a47cc] text-white py-4 rounded-full font-black text-xl shadow-lg border-b-4 border-black/20 flex items-center justify-center gap-3 active:translate-y-1 transition-all"
                    >
                        {loading ? "AUTHENTICATING..." : (isLogin ? "LOGIN NOW" : "REGISTER NOW")}
                        <div className="bg-white text-[#1a47cc] rounded-full p-1 shadow-md">
                            <ArrowRight size={18} strokeWidth={4} />
                        </div>
                    </motion.button>
                </form>

                {/* 4. Switch Mode Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[#c2412e] font-black text-sm border-b-2 border-[#c2412e] pb-0.5 uppercase tracking-tighter hover:opacity-80 transition-opacity"
                    >
                        {isLogin ? "New here? Create an Account" : "Already a member? Login here"}
                    </button>
                </div>

                {/* 5. Hindi Security Disclaimer */}
                <div className="mt-10 bg-[#f8fafc] border-2 border-dashed border-[#5da2c4] rounded-2xl p-5 text-center shadow-sm">
                    <p className="text-gray-700 text-[11px] font-bold leading-relaxed">
                        यह मॉड मेनू पूरी तरह सुरक्षित है। अपनी गेम आईडी लॉगिन करें <br/>
                        और सटीक प्रेडिक्शन के साथ जीतना शुरू करें। <br/>
                        <span className="text-[#1a47cc]">किसी भी तकनीकी सहायता के लिए टेलीग्राम पर संपर्क करें।</span>
                    </p>
                </div>

                {/* 6. Social Support Buttons */}
                <div className="mt-10 flex justify-center gap-8">
                    <SocialCircle 
                        onClick={() => window.open(`https://wa.me/${whatsapp}`)} 
                        icon={<Headset size={28} />} 
                        color="bg-green-500" 
                    />
                    <SocialCircle 
                        onClick={() => window.open(`https://t.me/${telegram}`)} 
                        icon={<Send size={28} />} 
                        color="bg-blue-400" 
                    />
                    <SocialCircle 
                        onClick={() => window.open(youtube)} 
                        icon={<Youtube size={28} />} 
                        color="bg-red-600" 
                    />
                </div>
                
                {/* <p className="mt-10 text-center text-[10px] font-black text-gray-400 uppercase tracking-[4px]">
                    SECURED BY MODAPKSYSTEM
                </p> */}
            </div>
        </div>
    );
};

// Reusable Social Component
const SocialCircle = ({ icon, color, onClick }) => (
    <motion.button 
        whileTap={{ scale: 0.85 }} 
        onClick={onClick}
        className={`w-14 h-14 ${color} rounded-full flex items-center justify-center text-white shadow-xl border-b-4 border-black/20`}
    >
        {icon}
    </motion.button>
);

export default AuthScreen;