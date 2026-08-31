import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, HelpCircle, Clock, Timer as TimerIcon,
    Hash, Eye, Send, Headset, LogOut, X, Loader2, Lock,
    CheckCircle, CreditCard, Gamepad2, Zap, UserPlus
} from 'lucide-react';
import axios from 'axios';

// 🟢 NEW: Domain Configuration Helper (Matches App, Auth, and Portal)
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
    if (host.includes('sureshotypro.xyz')) {
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

const GameScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const gameData = location.state;
    const [paymentLoading, setPaymentLoading] = useState(false);

    // Get current domain details
    const { variant, storageKey, whatsapp, telegram } = getDomainConfig();

    const [showHelp, setShowHelp] = useState(false);
    const [isVip, setIsVip] = useState(false);
    const [showVipPopup, setShowVipPopup] = useState(false);
    const [viewMode, setViewMode] = useState('hack'); // 'hack' or 'game'

    const user = JSON.parse(localStorage.getItem(storageKey));

    // --- BALL DATA ---
    const ballData = [
        { n: 0, img: 'https://i.ibb.co/WpKk6XP5/boll0.png', color: 'Red' },
        { n: 1, img: 'https://i.ibb.co/pjdKPpGk/boll1.png', color: 'Green' },
        { n: 2, img: 'https://i.ibb.co/GvTn7MHj/boll2.png', color: 'Red' },
        { n: 3, img: 'https://i.ibb.co/3GvfjY9/boll3.png', color: 'Green' },
        { n: 4, img: 'https://i.ibb.co/fztTk9Xk/boll4.png', color: 'Red' },
        { n: 5, img: 'https://i.ibb.co/yBGNC94B/boll5.png', color: 'Green' },
        { n: 6, img: 'https://i.ibb.co/YFPyCcfv/boll6.png', color: 'Red' },
        { n: 7, img: 'https://i.ibb.co/rGfbzCr7/boll7.png', color: 'Green' },
        { n: 8, img: 'https://i.ibb.co/24gv544/boll8.png', color: 'Red' },
        { n: 9, img: 'https://i.ibb.co/BH2QBCdm/boll9.png', color: 'Green' }
    ];

    const [onlineUsers, setOnlineUsers] = useState(12456);
    const [currentWingo, setCurrentWingo] = useState('wingo1m');
    const [displayMode, setDisplayMode] = useState('show-all');
    const [timer, setTimer] = useState({ min: '00', sec: '00', period: 'Calculating...' });
    const [isChecking, setIsChecking] = useState(false);

    // 1. Load user and check VIP status on mount
    // 1. Load user and check VIP status on mount
    useEffect(() => {
        if (!gameData) { navigate('/auth'); return; }

        const checkVip = async () => {
            if (user?.phone) {
                try {
                    const res = await axios.post('http://localhost:5000/api/sureshotnew/check-vip', { phone: user.phone, variant });
                    setIsVip(res.data.isVip);
                } catch (err) { 
                    console.error("VIP Check Error:", err.response?.data || err.message); // 🟢 Added detailed error logging
                    setIsVip(false); // 🟢 Ensure they are locked out if the API fails
                }
            } else {
                setIsVip(false);
            }
        };
        checkVip();
    }, [gameData, user, navigate, variant]);

    // 2. Verify Payment if returning from Gateway
    useEffect(() => {
        if (isVip) return;
        const verifyPayment = async () => {
            const pendingOrder = JSON.parse(localStorage.getItem('sure_current_order'));
            if (pendingOrder && user) {
                try {
                    const res = await axios.post('http://localhost:5000/api/sureshotnew/payment/status', {
                        order_id: pendingOrder.order_id,
                        phone: user.phone,
                        variant
                    });

                    if (res.data.status === "Success") {
                        alert(`Success! VIP Activated.`);
                        setIsVip(true);
                        localStorage.removeItem('sure_current_order');
                    }
                } catch (err) { console.error("Verification failed"); }
            }
        };
        if (user) verifyPayment();
    }, [user, variant, isVip]);

    // 3. Payment Flow
    const handlePayment = async () => {
        setPaymentLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/sureshotnew/payment/create', { phone: user.phone, variant });
            if (res.data.status && res.data.results.payment_url) {
                localStorage.setItem('sure_current_order', JSON.stringify({ order_id: res.data.results.order_id }));
                window.location.href = res.data.results.payment_url;
            }
        } catch (err) { alert("Payment failed to initialize."); }
        finally { setPaymentLoading(false); }
    };

    const handleLogout = () => {
        localStorage.removeItem(storageKey);
        navigate('/auth');
    };

    // Prediction states
    const [predictedResult, setPredictedResult] = useState(ballData[Math.floor(Math.random() * 10)]);
    const [isSureShot, setIsSureShot] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setOnlineUsers(Math.floor(Math.random() * (15000 - 9000 + 1)) + 9000);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const utcSec = now.getUTCSeconds();
            const utcMin = now.getUTCMinutes();
            const utcHrs = now.getUTCHours();
            const totalSeconds = utcHrs * 3600 + utcMin * 60 + utcSec;

            let cycle = 60;
            if (currentWingo === 'wingo30s') cycle = 30;
            if (currentWingo === 'wingo3m') cycle = 180;
            if (currentWingo === 'wingo5m') cycle = 300;

            const remaining = cycle - (totalSeconds % cycle);
            const displayRemaining = Math.max(0, remaining - 1);

            setTimer({
                min: Math.floor(displayRemaining / 60).toString().padStart(2, '0'),
                sec: (displayRemaining % 60).toString().padStart(2, '0'),
                period: `${now.toISOString().slice(0, 10).replace(/-/g, '')}1000${10001 + Math.floor(totalSeconds / cycle)}`
            });

            if (remaining === cycle) {
                setIsChecking(true);
                setTimeout(() => {
                    setPredictedResult(ballData[Math.floor(Math.random() * 10)]);
                    const luckyDraw = Math.floor(Math.random() * 4);
                    setIsSureShot(luckyDraw === 0);
                    setIsChecking(false);
                }, 2000);
            }
        };
        const t = setInterval(updateTimer, 1000);
        return () => clearInterval(t);
    }, [currentWingo]);

    if (!gameData) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0D0620] via-[#1A0535] to-[#2D0A5C] text-[#F5F0FF] font-['Poppins'] p-3 relative overflow-x-hidden pb-[100px]">
            
            {/* Background Decor */}
            <div 
                className="fixed inset-0 pointer-events-none z-0 opacity-40"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.08) 1px, transparent 1px), radial-gradient(circle, rgba(168,85,247,0.06) 1px, transparent 1px)',
                    backgroundSize: '60px 60px, 90px 90px',
                    backgroundPosition: '0 0, 30px 30px'
                }}
            />
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-[-10%] w-[45vw] h-[45vw] bg-[#7C3AED]/20 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#F59E0B]/10 rounded-full blur-[80px] animate-pulse" />
            </div>

            {/* HEADER */}
            <div className="relative z-20 flex justify-between items-center mb-4 max-w-[460px] mx-auto">
                <div className="flex gap-2">
                    <button onClick={() => navigate(-1)} className="bg-[#1E0A3C]/80 border border-[#F59E0B]/30 p-2.5 rounded-xl shadow-[0_4px_12px_rgba(245,158,11,0.15)] hover:border-[#F59E0B] transition-all backdrop-blur-md">
                        <ArrowLeft size={16} className="text-[#FBBF24]" />
                    </button>
                    <button onClick={handleLogout} className="bg-[#1E0A3C]/80 border border-red-500/40 text-red-400 px-3 py-2 rounded-xl shadow-sm font-bold text-[11px] flex items-center gap-2 hover:bg-red-500/20 transition-all uppercase backdrop-blur-md">
                        <LogOut size={14} /> Logout
                    </button>
                </div>
                <button
                    onClick={() => setShowHelp(true)}
                    className="flex items-center gap-2 bg-[#1E0A3C]/80 border border-[#7C3AED]/40 px-4 py-2.5 rounded-xl shadow-sm font-semibold text-sm hover:-translate-y-1 transition-all hover:border-[#A855F7] text-[#C4B5FD] backdrop-blur-md"
                >
                    <HelpCircle size={16} className="text-[#A855F7]" /> Help
                </button>
            </div>

            <div className="relative z-10 max-w-[460px] mx-auto">
                
                {/* DYNAMIC CONTENT AREA: HACK OR GAME */}
                {viewMode === 'hack' ? (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#1E0A3C]/80 border border-[#F59E0B]/30 backdrop-blur-xl rounded-[24px] p-5 shadow-[0_8px_32px_rgba(124,58,237,0.25)] flex flex-col gap-4 mt-2"
                    >
                        {/* Status Bar */}
                        <div className="flex justify-between items-center pb-3 border-b border-[#7C3AED]/30 text-sm font-semibold text-[#C4B5FD]">
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" /> Server Active</span>
                            <span className="bg-[#0D0620] border border-[#7C3AED]/30 px-3 py-1 rounded-full text-[12px] text-[#FBBF24]">Online: {onlineUsers.toLocaleString()}</span>
                        </div>

                        {/* Logo & Name */}
                        <div className="py-2 text-center relative">
                            <div className="absolute top-0 right-4 bg-gradient-to-bl from-[#ef4444] to-[#dc2626] text-white text-[9px] font-black px-2 py-1 rounded-bl-[12px] rounded-tr-[15px] flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.5)] z-10">
                                <i className="fas fa-fire animate-pulse"></i> HOT
                            </div>
                            <img src={gameData.logo} alt="Logo" className="w-24 h-24 mx-auto rounded-[18px] border-[3px] border-[#F59E0B]/80 shadow-[0_0_20px_rgba(245,158,11,0.3)] object-cover bg-white" />
                            <h1 className="text-xl font-black mt-3 text-white tracking-wide uppercase">{gameData.name} <span className="text-[#F59E0B]">PRO</span></h1>
                        </div>

                        {/* Wingo Mode Selector */}
                        <div className="bg-[#0D0620]/60 border border-[#7C3AED]/30 p-2 rounded-xl grid grid-cols-4 gap-2">
                            {['wingo30s', 'wingo1m', 'wingo3m', 'wingo5m'].map((mode) => (
                                <button key={mode} onClick={() => setCurrentWingo(mode)} className={`flex flex-col items-center justify-center py-2 px-1 rounded-[14px] transition-all border ${currentWingo === mode ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#0D0620] border-[#FBBF24] shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-[#1E0A3C] text-[#C4B5FD] border-[#7C3AED]/30 hover:bg-[#7C3AED]/20'}`}>
                                    {mode === 'wingo30s' ? <Clock size={18} /> : <TimerIcon size={18} />}
                                    <span className="text-[10px] font-black mt-1 text-center leading-tight uppercase tracking-wider">{mode === 'wingo30s' ? "WinGo\n30s" : `WinGo\n${mode.charAt(5)}M`}</span>
                                </button>
                            ))}
                        </div>

                        {/* Display Mode Toggle */}
                        <div className="flex gap-2 justify-center py-1">
                            <button onClick={() => setDisplayMode('number-only')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-[12px] uppercase tracking-wider font-black transition-all border ${displayMode === 'number-only' ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white border-[#A855F7] shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-[#0D0620]/60 text-[#8B7CB8] border-[#7C3AED]/30'}`}><Hash size={14} /> Number Only</button>
                            <button onClick={() => setDisplayMode('show-all')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-[12px] uppercase tracking-wider font-black transition-all border ${displayMode === 'show-all' ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white border-[#A855F7] shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-[#0D0620]/60 text-[#8B7CB8] border-[#7C3AED]/30'}`}><Eye size={14} /> Show All</button>
                        </div>

                        {/* PREDICTION AREA */}
                        <div className="bg-[#0D0620] border border-[#F59E0B]/40 rounded-[20px] p-5 flex flex-col items-center gap-1 shadow-[0_8px_30px_rgba(245,158,11,0.15)] relative overflow-hidden">
                            <div className="w-full flex justify-between text-[12px] font-bold text-[#A855F7] uppercase tracking-widest mb-2 border-b border-[#7C3AED]/20 pb-3">
                                <span>Period: {timer.period.slice(-4)}</span>
                                <span className="text-[#FBBF24]">Time: {timer.min}:{timer.sec}</span>
                            </div>

                            <div className="w-full mt-3 flex flex-col items-center justify-center gap-4 relative min-h-[140px]">
                                <div className="flex flex-col items-center gap-1">
                                    <span className={`text-[15px] font-black uppercase tracking-widest drop-shadow-md ${isSureShot ? 'text-[#10b981]' : 'text-[#F59E0B]'}`}>
                                        {isSureShot ? "🔥 100% SURE SHOT 🔥" : "👇 NEXT RESULT 👇"}
                                    </span>
                                    {isSureShot && isVip && (
                                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#10b981]/20 text-[#34d399] px-3 py-0.5 rounded text-[10px] font-black border border-[#10b981]/40 animate-pulse mt-1">
                                            ACCURACY: 100%
                                        </motion.div>
                                    )}
                                </div>

                                {/* Results Container */}
                                <div className="w-full flex justify-center relative">
                                    {isChecking ? (
                                        <div className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white px-6 py-4 rounded-2xl font-black text-sm flex items-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-[#C084FC]/50">
                                            <Loader2 size={18} className="animate-spin" /> CHECKING SERVER...
                                        </div>
                                    ) : (
                                        <div className="relative w-full flex justify-center">
                                            {/* VIP LOCK OVERLAY */}
                                            {!isVip && (
                                                <div className="absolute inset-[-10px] z-20 flex flex-col items-center justify-center bg-[#0D0620]/80 backdrop-blur-md rounded-2xl border border-[#F59E0B]/30">
                                                    <Lock className="text-[#F59E0B] mb-2" size={24} />
                                                    <button onClick={() => setShowVipPopup(true)} className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#0D0620] px-5 py-2 rounded-xl text-[11px] font-black shadow-[0_0_15px_rgba(245,158,11,0.5)] hover:scale-105 transition-transform uppercase tracking-wider">Unlock VIP Prediction</button>
                                                </div>
                                            )}

                                            {/* Actual Result Details */}
                                            <div className={`flex gap-4 justify-center items-end ${!isVip ? 'select-none pointer-events-none blur-[4px] opacity-40' : ''}`}>
                                                {displayMode === 'show-all' ? (
                                                    <div className="flex gap-4 items-end">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <span className="text-[10px] font-bold text-[#8B7CB8] uppercase tracking-wider">Number</span>
                                                            <div className="w-[60px] h-[60px] bg-[#1E0A3C] border border-[#7C3AED]/40 rounded-[16px] shadow-inner p-1.5 flex items-center justify-center relative overflow-hidden">
                                                                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                                                                {isVip ? <img src={predictedResult.img} className="w-full h-full object-contain drop-shadow-md relative z-10" alt="n" /> : <div className="w-8 h-8 bg-slate-700 rounded-full" />}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-center gap-2">
                                                            <span className="text-[10px] font-bold text-[#8B7CB8] uppercase tracking-wider">Size</span>
                                                            <div className={`w-[90px] py-[18px] rounded-[16px] text-white font-black text-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.3)] text-center border border-white/10 relative overflow-hidden ${!isVip ? 'bg-slate-700' : (predictedResult.n >= 5 ? 'bg-gradient-to-br from-[#F59E0B] to-[#D97706]' : 'bg-gradient-to-br from-[#7C3AED] to-[#4C1D95]')}`}>
                                                                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                                                <span className="relative z-10 drop-shadow-md">{isVip ? (predictedResult.n >= 5 ? 'BIG' : 'SMALL') : "???"}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-center gap-2">
                                                            <span className="text-[10px] font-bold text-[#8B7CB8] uppercase tracking-wider">Color</span>
                                                            <div className={`w-[90px] py-[18px] rounded-[16px] text-white font-black text-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.3)] text-center border border-white/10 relative overflow-hidden ${!isVip ? 'bg-slate-700' : (predictedResult.color === 'Green' ? 'bg-gradient-to-br from-[#10B981] to-[#059669]' : 'bg-gradient-to-br from-[#EF4444] to-[#DC2626]')}`}>
                                                                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                                                <span className="relative z-10 drop-shadow-md">{isVip ? predictedResult.color.toUpperCase() : "???"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <span className="text-[10px] font-bold text-[#8B7CB8] uppercase tracking-wider">Predicted Ball</span>
                                                        <div className="w-[85px] h-[85px] bg-[#1E0A3C] border-2 border-[#F59E0B]/50 rounded-[22px] shadow-[0_0_20px_rgba(245,158,11,0.2)] p-2 flex items-center justify-center relative overflow-hidden">
                                                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                                                            {isVip ? (
                                                                <motion.img initial={{ scale: 0.5 }} animate={{ scale: 1 }} src={predictedResult.img} className="w-full h-full object-contain drop-shadow-xl relative z-10" alt="single-ball" />
                                                            ) : (
                                                                <div className="w-12 h-12 bg-slate-700 rounded-full animate-pulse" />
                                                            )}
                                                        </div>
                                                        {isVip && <span className="text-xl font-black text-[#FBBF24] drop-shadow-md">NUMBER: {predictedResult.n}</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Extra Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <button onClick={() => window.open(`https://t.me/${telegram}`, '_blank')} className="bg-[#1E0A3C] border border-[#7C3AED]/40 text-[#C4B5FD] hover:bg-[#7C3AED]/20 py-3.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-colors uppercase tracking-wide"><Send size={16} className="text-[#A855F7]" /> Telegram</button>
                            <button onClick={() => window.open(`https://wa.me/${whatsapp}`, '_blank')} className="bg-[#1E0A3C] border border-[#7C3AED]/40 text-[#C4B5FD] hover:bg-[#7C3AED]/20 py-3.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-colors uppercase tracking-wide"><Headset size={16} className="text-[#A855F7]" /> Support</button>
                        </div>
                    </motion.div>
                ) : (
                    /* GAME WEBVIEW MODE */
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full h-[calc(100vh-200px)] bg-[#1E0A3C]/90 rounded-[28px] overflow-hidden border-2 border-[#F59E0B]/50 shadow-[0_0_30px_rgba(245,158,11,0.25)] relative mt-2 flex flex-col"
                    >
                        <div className="bg-[#0D0620] px-5 py-3 flex items-center justify-between border-b border-[#F59E0B]/30">
                            <span className="text-[#FBBF24] font-black text-sm uppercase flex items-center gap-2 tracking-widest">
                                <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_8px_#10b981]" /> 
                                Live Game View
                            </span>
                            <button onClick={() => window.open(gameData.link, '_blank')} className="text-[10px] bg-[#F59E0B]/20 text-[#F59E0B] px-3 py-1 rounded-md font-bold uppercase tracking-wider hover:bg-[#F59E0B]/30 transition-colors">
                                Open in Browser
                            </button>
                        </div>
                        <iframe 
                            src={gameData.link} 
                            title="Game Webview"
                            className="w-full flex-1 border-none bg-white" 
                            allowFullScreen
                        />
                    </motion.div>
                )}

            </div>

            {/* --- FIXED BOTTOM HACK/GAME TOGGLE --- */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] h-[65px] bg-[#0D0620]/90 backdrop-blur-xl border border-[#F59E0B]/40 rounded-[40px] p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(245,158,11,0.2)] flex z-[200]">
                <div className="relative w-full h-full flex items-center">
                    {/* Sliding Golden Pill */}
                    <motion.div
                        className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-[35px] shadow-[0_4px_15px_rgba(245,158,11,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)]"
                        animate={{ left: viewMode === 'hack' ? '0%' : '50%' }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                    
                    <button
                        className={`relative z-10 w-1/2 flex items-center justify-center gap-2 font-black text-[15px] uppercase tracking-wider transition-colors duration-300 ${viewMode === 'hack' ? 'text-[#0D0620] drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]' : 'text-[#8B7CB8] hover:text-[#C4B5FD]'}`}
                        onClick={() => setViewMode('hack')}
                    >
                        <Zap size={18} className={viewMode === 'hack' ? 'fill-[#0D0620]' : ''} /> HACK
                    </button>
                    
                    <button
                        className={`relative z-10 w-1/2 flex items-center justify-center gap-2 font-black text-[15px] uppercase tracking-wider transition-colors duration-300 ${viewMode === 'game' ? 'text-[#0D0620] drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]' : 'text-[#8B7CB8] hover:text-[#C4B5FD]'}`}
                        onClick={() => setViewMode('game')}
                    >
                        <Gamepad2 size={18} className={viewMode === 'game' ? 'fill-[#0D0620]' : ''} /> GAME
                    </button>
                </div>
            </div>

            {/* VIP PURCHASE POPUP */}
            <AnimatePresence>
                {showVipPopup && (
                    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-[#0D0620]/90 backdrop-blur-md" onClick={() => setShowVipPopup(false)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-[#1E0A3C] p-8 rounded-[32px] w-full max-w-[360px] text-center border-2 border-[#F59E0B] shadow-[0_0_40px_rgba(245,158,11,0.3)] relative">
                            <button onClick={() => setShowVipPopup(false)} className="absolute top-5 right-5 text-[#8B7CB8] hover:text-white transition-colors"><X size={24} /></button>
                            
                            <div className="w-20 h-20 bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-[#0D0620] rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                                <CreditCard size={36} className="fill-[#0D0620]/20" />
                            </div>
                            
                            <h2 className="text-2xl font-black mb-1 text-white tracking-tight uppercase">Unlock <span className="text-[#F59E0B]">VIP</span> Access</h2>
                            <p className="text-[#C4B5FD] text-[11px] font-bold tracking-widest uppercase mb-4">Premium Prediction Algorithm</p>
                            
                            <div className="flex items-center justify-center gap-3 mb-6 bg-[#0D0620] py-3 rounded-2xl border border-[#7C3AED]/30">
                                <span className="text-[#8B7CB8] line-through text-lg font-bold">₹999</span>
                                <span className="text-[#10b981] text-3xl font-black drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">₹850</span>
                            </div>
                            
                            <ul className="text-left text-[#C4B5FD] text-[13px] font-medium mb-8 space-y-3 px-2">
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#10b981]" /> 99.9% Prediction Accuracy</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#10b981]" /> Ad-Free Premium Interface</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#10b981]" /> 24/7 Priority Customer Support</li>
                            </ul>
                            
                            <div className="flex flex-col gap-3">
                                <button onClick={handlePayment} className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white py-4 rounded-2xl font-black text-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95 transition-all border border-[#34d399]/50 uppercase tracking-wide flex justify-center items-center">
                                    {paymentLoading ? <Loader2 className="animate-spin" size={24} /> : "Pay via UPI"}
                                </button>
                                <button onClick={() => setShowVipPopup(false)} className="w-full py-3 text-[12px] font-black text-[#8B7CB8] hover:text-white uppercase tracking-widest transition-colors">Cancel</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* HELP POPUP */}
            <AnimatePresence>
                {showHelp && (
                    <>
                        <div className="fixed inset-0 bg-[#0D0620]/90 backdrop-blur-sm z-[1000] cursor-pointer" onClick={() => setShowHelp(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
                            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                            exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
                            className="fixed top-1/2 left-1/2 bg-[#1E0A3C] border-2 border-[#7C3AED] rounded-[24px] p-6 shadow-[0_0_40px_rgba(124,58,237,0.3)] w-[90%] max-w-[400px] z-[1001] text-left"
                        >
                            <div className="flex justify-between items-center mb-5 pb-4 border-b border-[#7C3AED]/30">
                                <h3 className="text-white text-xl font-black flex items-center gap-2 uppercase tracking-wide">
                                    <HelpCircle className="text-[#F59E0B]" size={24} /> How to Use
                                </h3>
                                <button onClick={() => setShowHelp(false)} className="text-[#8B7CB8] hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <ul className="space-y-4 mb-6">
                                {[
                                    "Create a NEW account for best result!",
                                    "Click the 'Register' button to create new account",
                                    "Select your preferred Wingo mode (e.g., WinGo 1 Min)",
                                    "Use the bottom toggle to switch between HACK and actual GAME",
                                    "Maintain level funds and make sure your account is registered with mod link!"
                                ].map((text, i) => (
                                    <li key={i} className="flex items-start gap-3 text-[#C4B5FD] font-medium text-[13px] leading-relaxed">
                                        <div className="w-5 h-5 rounded-full bg-[#7C3AED]/20 border border-[#A855F7]/50 flex items-center justify-center text-[#FBBF24] font-bold text-[10px] shrink-0 mt-0.5">{i+1}</div>
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => setShowHelp(false)}
                                className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#0D0620] py-4 rounded-xl font-black text-sm shadow-[0_4px_15px_rgba(245,158,11,0.4)] active:scale-95 transition-all uppercase tracking-widest"
                            >
                                <i className="fas fa-check mr-2"></i> Got It
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GameScreen;