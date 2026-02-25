import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, HelpCircle, Clock, Timer as TimerIcon,
    Hash, Eye, Info, UserPlus, Send, Headset,
    History, LogOut, X, Loader2, Lock,
    CheckCircle,
    CreditCard
} from 'lucide-react';
import axios from 'axios';

// 🟢 NEW: Domain Configuration Helper (Matches App, Auth, and Portal)
const getDomainConfig = () => {
    const host = window.location.hostname;
    if (host.includes('bigsmalltrading.sbs')) {
        return {
            variant: 'msa1',
            storageKey: 'MSA1_user',
            whatsapp: '919116046055',
            telegram: 'modapksh',
            youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4'
        };
    }
    if (host.includes('bigsmallhack.sbs')) {
        return {
            variant: 'msa2',
            storageKey: 'MSA2_user',
            whatsapp: '919057617196',
            telegram: 'modapksales',
            youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4'
        };
    }
    if (host.includes('patternhack.sbs')) {
        return {
            variant: 'msa3',
            storageKey: 'MSA3_user',
            whatsapp: '917357984291',
            telegram: 'hackerbabaji1',
            youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4'
        };
    }
    return { variant: 'test', storageKey: 'MSA_test_user', whatsapp: '919116046055', telegram: 'modapksh', youtube: '' };
};
const GameScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const gameData = location.state;

    // Get current domain details
    const { variant, storageKey, whatsapp, telegram } = getDomainConfig();

    const [showHelp, setShowHelp] = useState(false);
    const [isVip, setIsVip] = useState(false);
    const [showVipPopup, setShowVipPopup] = useState(false);

    // 🟢 Updated: Get user using the dynamic storageKey
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
    const [showPopup, setShowPopup] = useState(false);

    // 🟢 1. Load user and check VIP status on mount
    useEffect(() => {
        if (!gameData) { navigate('/auth'); return; }

        const checkVip = async () => {
            if (user?.email) {
                try {
                    const res = await axios.post('/api/mas/check-vip', {
                        email: user.email,
                        variant
                    });
                    setIsVip(res.data.isVip);
                } catch (err) { console.error("VIP Check Error"); }
            }
        };
        checkVip();
    }, [gameData, user, navigate, variant]);

    // 🟢 2. NEW: Verify Payment if returning from Gateway (Auto-check)
    useEffect(() => {
        const verifyPayment = async () => {
            const pendingOrder = JSON.parse(localStorage.getItem('mas_current_order'));
            if (pendingOrder && user) {
                try {
                    const res = await axios.post('/api/mas/payment/status', {
                        order_id: pendingOrder.order_id,
                        email: user.email,
                        variant
                    });

                    if (res.data.status === "Success") {
                        alert(`Success! VIP Activated.`);
                        setIsVip(true);
                        localStorage.removeItem('mas_current_order');
                    }
                } catch (err) {
                    console.error("Verification failed");
                }
            }
        };
        if (user) verifyPayment();
    }, [user, variant]);

    // 🟢 3. Payment Flow: Create Order
    const handlePayment = async () => {
        try {
            const res = await axios.post('/api/mas/payment/create', { email: user.email, variant });
            if (res.data.status && res.data.results.payment_url) {
                // Store order ID to check status after redirect back
                localStorage.setItem('mas_current_order', JSON.stringify({
                    order_id: res.data.results.order_id
                }));
                window.location.href = res.data.results.payment_url;
            }
        } catch (err) { alert("Payment failed to initialize."); }
    };

    const handleLogout = () => {
        localStorage.removeItem(storageKey);
        navigate('/auth');
    };

    // Real prediction states
    const [predictedResult, setPredictedResult] = useState(ballData[7]);
    const [predictedNums, setPredictedNums] = useState([1, 3, 7, 9]);

    // useEffect(() => {
    //     if (!gameData) { navigate('/'); } else { setShowPopup(true); }
    // }, [gameData, navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setOnlineUsers(Math.floor(Math.random() * (15000 - 9000 + 1)) + 9000);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // useEffect(() => {
    //     const updateTimer = () => {
    //         const now = new Date();
    //         const utcSec = now.getUTCSeconds();
    //         const utcMin = now.getUTCMinutes();
    //         const utcHrs = now.getUTCHours();
    //         const totalSeconds = utcHrs * 3600 + utcMin * 60 + utcSec;

    //         let cycle = 60; // Default 1m
    //         if (currentWingo === 'wingo30s') cycle = 30;
    //         if (currentWingo === 'wingo3m') cycle = 180;
    //         if (currentWingo === 'wingo5m') cycle = 300;

    //         const remaining = cycle - (totalSeconds % cycle);
    //         const displayRemaining = Math.max(0, remaining - 1);

    //         setTimer({
    //             min: Math.floor(displayRemaining / 60).toString().padStart(2, '0'),
    //             sec: (displayRemaining % 60).toString().padStart(2, '0'),
    //             period: `${now.toISOString().slice(0, 10).replace(/-/g, '')}1000${10001 + Math.floor(totalSeconds / cycle)}`
    //         });

    //         if (remaining === cycle) {
    //             setIsChecking(true);
    //             setTimeout(() => {
    //                 setPredictedResult(ballData[Math.floor(Math.random() * 10)]);
    //                 setPredictedNums([...Array(4)].map(() => Math.floor(Math.random() * 10)));
    //                 setIsChecking(false);
    //             }, 2000);
    //         }
    //     };
    //     const t = setInterval(updateTimer, 1000);
    //     return () => clearInterval(t);
    // }, [currentWingo]);

   useEffect(() => {
    const updateTimer = () => {
        // 🟢 ALWAYS USE NEW DATE() INSIDE TIMER
        const now = new Date();
        
        // VPS Fix: Ensure we strictly use UTC methods to match Online Compiler
        const utcSec = now.getUTCSeconds();
        const utcMin = now.getUTCMinutes();
        const utcHrs = now.getUTCHours();
        
        // Standard UTC calculations
        const totalMinutesToday = (utcHrs * 60) + utcMin;
        const totalSecondsToday = (totalMinutesToday * 60) + utcSec;
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');

        let cycle = 60; // Default 1m
        let periodID;
        let displayRemaining;

        if (gameData?.name === "RajaLottery") {
            // 🟢 RAJA LOTTERY: Strictly 1M Cycle with Calibrated Offset
            // Ye wahi logic hai jo aapne compiler mein 'Greate' bola tha
            cycle = 60; 
            const remaining = cycle - (utcSec % cycle);
            displayRemaining = Math.max(0, remaining - 1);
            
            // Formula: Minutes today - 626 (Matches 20260225100010017)
            const periodCounter = totalMinutesToday - 626; 
            periodID = `${dateStr}10005${String(periodCounter).padStart(5, '0')}`;
        } else {
            // 🔵 ALL OTHER GAMES: Using your ORIGINAL logic
            if (currentWingo === 'wingo30s') cycle = 30;
            else if (currentWingo === 'wingo3m') cycle = 180;
            else if (currentWingo === 'wingo5m') cycle = 300;
            else cycle = 60; // 1m default

            const remaining = cycle - (totalSecondsToday % cycle);
            displayRemaining = Math.max(0, remaining - 1);

            // Original formula sync
            const elapsedCycles = Math.floor(totalSecondsToday / cycle);
            periodID = `${dateStr}1000${10001 + elapsedCycles}`;
        }

        setTimer({
            min: Math.floor(displayRemaining / 60).toString().padStart(2, '0'),
            sec: (displayRemaining % 60).toString().padStart(2, '0'),
            period: periodID
        });

        // 🚀 Prediction Trigger (Strictly on 00:00)
        if (displayRemaining === 0 && utcSec % cycle === 0) {
            setIsChecking(true);
            setTimeout(() => {
                setPredictedResult(ballData[Math.floor(Math.random() * 10)]);
                setPredictedNums([...Array(4)].map(() => Math.floor(Math.random() * 10)));
                setIsChecking(false);
            }, 2000);
        }
        
    };
    
    const t = setInterval(updateTimer, 1000);
    return () => clearInterval(t);
}, [currentWingo, gameData?.name, ballData]);

    if (!gameData) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-['Poppins'] p-3 relative overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none z-0 opacity-50">
                <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
                <div className="absolute top-[30%] right-[10%] w-64 h-64 bg-pink-500/5 rounded-full blur-3xl" />
            </div>
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <button onClick={() => navigate(-1)} className="bg-white border border-[#E2E8F0] p-2.5 rounded-xl shadow-sm hover:border-indigo-500 transition-all"><ArrowLeft size={16} /></button>
                    <button onClick={handleLogout} className="bg-white border border-red-100 text-red-500 px-3 py-2 rounded-xl shadow-sm font-bold text-[11px] flex items-center gap-2 hover:bg-red-50 transition-all"><LogOut size={14} /> LOGOUT</button>
                </div>
                <button
                    onClick={() => setShowHelp(true)} // Yeh zaroori hai
                    className="flex items-center gap-2 bg-white border border-[#E2E8F0] px-4 py-2.5 rounded-xl shadow-sm font-semibold text-sm hover:translate-y-[-2px] transition-all hover:border-[#6366F1]"
                >
                    <HelpCircle size={16} /> Help
                </button>            </div>
            <div className="relative z-10 max-w-[420px] mx-auto">
                {/* <div className="flex justify-between items-center mb-4">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-white border border-[#E2E8F0] px-4 py-2.5 rounded-xl shadow-sm font-semibold text-sm hover:translate-y-[-2px] transition-all hover:border-[#6366F1]">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <button
                        onClick={() => setShowHelp(true)} // Yeh zaroori hai
                        className="flex items-center gap-2 bg-white border border-[#E2E8F0] px-4 py-2.5 rounded-xl shadow-sm font-semibold text-sm hover:translate-y-[-2px] transition-all hover:border-[#6366F1]"
                    >
                        <HelpCircle size={16} /> Help
                    </button>
                </div> */}

                <div className="bg-white border border-[#E2E8F0] rounded-[18px] p-5 shadow-lg text-center flex flex-col gap-4 mt-4">
                    <div className="flex justify-between items-center pb-3 border-b border-[#E2E8F0] text-sm font-semibold text-[#475569]">
                        <span></span>
                        <span className="bg-[#F1F5F9] px-3 py-1 rounded-full text-[12px]">Online: {onlineUsers.toLocaleString()}</span>
                    </div>

                    <div className="py-2">
                        <img src={gameData.logo} alt="Logo" className="w-32 h-32 mx-auto rounded-[15px] border-2 border-[#6366F1] shadow-md object-cover" />
                        <h1 className="text-xl font-bold mt-4">{gameData.name} (Hack)</h1>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-500/10 to-pink-500/10 h-10 border border-[#E2E8F0] rounded-xl flex items-center overflow-hidden">
                        <motion.div animate={{ x: ["100%", "-100%"] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="whitespace-nowrap flex items-center gap-2 text-[12px] font-medium">
                            ✅ For Best Results, Make a new account by clicking on <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-lg text-[11px] font-bold mx-1">Register</button> button.
                        </motion.div>
                    </div>

                    <div className="bg-[#F1F5F9] border border-[#E2E8F0] p-2 rounded-xl grid grid-cols-4 gap-2">
                        {['wingo30s', 'wingo1m', 'wingo3m', 'wingo5m'].map((mode) => (
                            <button key={mode} onClick={() => setCurrentWingo(mode)} className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all border ${currentWingo === mode ? 'bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white border-[#6366F1]' : 'bg-white text-[#475569] border-[#E2E8F0]'}`}>
                                {mode === 'wingo30s' ? <Clock size={20} /> : <TimerIcon size={20} />}
                                <span className="text-[10px] font-bold mt-1 text-center leading-tight">{mode === 'wingo30s' ? "WinGo\n30s" : `WinGo\n${mode.charAt(5)}Min`}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2 justify-center py-1">
                        <button onClick={() => setDisplayMode('number-only')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold transition-all shadow-sm ${displayMode === 'number-only' ? 'bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white' : 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]'}`}><Hash size={14} /> Number Only</button>
                        <button onClick={() => setDisplayMode('show-all')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold transition-all shadow-sm ${displayMode === 'show-all' ? 'bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white' : 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]'}`}><Eye size={14} /> Show All</button>
                    </div>

                    <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl p-4 flex flex-col items-start gap-1 shadow-sm font-semibold text-[15px]">
                        <p>Mode: WinGo({currentWingo === 'wingo30s' ? '30s' : currentWingo.charAt(5) + 'm'})</p>
                        <p>Period: {timer.period}</p>
                        <p>Remaining Time: {timer.min} : {timer.sec}</p>

                        <div className="bg-[#F1F5F9] rounded-xl p-4 w-full mt-2 flex flex-col items-center justify-center gap-3 border border-slate-200 relative overflow-hidden">
                            <span className="text-[14px] font-bold uppercase tracking-wider">👇 Result 👇</span>

                            <div className="min-h-[70px] flex items-center justify-center w-full relative">
                                {isChecking ? (
                                    <div className="bg-gradient-to-r from-[#64748B] to-[#475569] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Checking...</div>
                                ) : (
                                    <div className="relative w-full flex justify-center">
                                        {/* VIP LOCK OVERLAY */}
                                        {!isVip && (
                                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[15px] rounded-xl">
                                                <Lock className="text-indigo-600 mb-1" size={20} />
                                                <button onClick={() => setShowVipPopup(true)} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black shadow-lg hover:scale-105 transition-transform">GET VIP TO UNLOCK</button>                                            </div>
                                        )}

                                        {/* Result Content */}
                                        {/* Updated Result Content Block */}
                                        <div className={`flex gap-3 justify-center items-end ${!isVip ? 'select-none pointer-events-none blur-[2px]' : ''}`}>
                                            {displayMode === 'show-all' ? (
                                                <div className="flex gap-3 items-end">
                                                    {/* SAME BALL: Shown with labels and details */}
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Number</span>
                                                        <div className="w-14 h-14 bg-white border border-slate-100 rounded-xl shadow-md p-1.5 flex items-center justify-center">
                                                            {isVip ? <img src={predictedResult.img} className="w-full h-full object-contain" alt="n" /> : <div className="w-8 h-8 bg-slate-200 rounded-full" />}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Size</span>
                                                        <div className={`w-[85px] py-3 rounded-xl text-white font-black text-[14px] shadow-lg text-center ${!isVip ? 'bg-slate-300' : (predictedResult.n >= 5 ? 'bg-[#8B5CF6]' : 'bg-[#3B82F6]')}`}>
                                                            {isVip ? (predictedResult.n >= 5 ? 'BIG' : 'SMALL') : "???"}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Color</span>
                                                        <div className={`w-[85px] py-3 rounded-xl text-white font-black text-[14px] shadow-lg text-center ${!isVip ? 'bg-slate-300' : (predictedResult.color === 'Green' ? 'bg-[#10B981]' : 'bg-[#EF4444]')}`}>
                                                            {isVip ? predictedResult.color.toUpperCase() : "???"}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* NUMBER ONLY: Just shows the same single ball */
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Predicted Ball</span>
                                                    <div className="w-20 h-20 bg-white border border-slate-100 rounded-2xl shadow-lg p-2 flex items-center justify-center">
                                                        {isVip ? (
                                                            <motion.img
                                                                initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                                                                src={predictedResult.img}
                                                                className="w-full h-full object-contain"
                                                                alt="single-ball"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse" />
                                                        )}
                                                    </div>
                                                    {isVip && <span className="text-lg font-black text-indigo-600">NUMBER: {predictedResult.n}</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* VIP Status Indicator replaces "How it works?" */}
                            <div className="mt-3 flex items-center justify-center">
                                {isVip ? (
                                    <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100 shadow-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest italic">💎 VIP MEMBER</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 bg-slate-100 text-slate-500 px-3 py-1 rounded-full border border-slate-200">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-500">🚫 YOUR NOT A VIP USER</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-left text-[13px] font-medium space-y-2">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/5 to-pink-500/5 border border-[#E2E8F0]">Create a new <span className="text-indigo-600 font-bold">{gameData.name}</span> account. If you use an old account, mod will not work.</div>
                    </div>

                    <button onClick={() => window.open(gameData.link, '_blank')} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3.5 rounded-xl font-bold shadow-md hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 uppercase tracking-wide"><UserPlus size={18} /> Register Now</button>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => window.open(`https://t.me/${telegram}`, '_blank')} className="bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white py-3.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2"><Send size={16} /> Join Telegram</button>
                        <button onClick={() => window.open(`https://wa.me/${whatsapp}`, '_blank')} className="bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white py-3.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2"><Headset size={16} /> Customer Care</button>
                    </div>
                </div>

                {/* History Results */}
                {/* <div className="mt-5 bg-white border border-[#E2E8F0] rounded-[15px] shadow-sm overflow-hidden">
                    <div onClick={() => setShowHistory(!showHistory)} className="p-4 bg-[#F1F5F9] flex justify-between items-center cursor-pointer font-bold text-sm">
                        <span className="flex items-center gap-2"><History size={16} /> History Results</span>
                        <ChevronDown size={16} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} />
                    </div>
                    <AnimatePresence>
                        {showHistory && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-white px-4 py-4 italic text-slate-400 text-xs text-center">No history available for this session.</motion.div>
                        )}
                    </AnimatePresence>
                </div> */}
            </div>

            <AnimatePresence>
                {showVipPopup && (
                    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md" onClick={() => setShowVipPopup(false)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white p-8 rounded-[30px] w-full max-w-[360px] text-center border-2 border-indigo-500 shadow-2xl relative">
                            <button onClick={() => setShowVipPopup(false)} className="absolute top-4 right-4 text-slate-300"><X size={24} /></button>
                            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"><CreditCard size={32} /></div>
                            <h2 className="text-2xl font-black mb-2 text-slate-800 tracking-tight">PURCHASE PREMIUM</h2>
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <span className="text-slate-400 line-through text-lg font-bold">₹999</span>
                                <span className="text-emerald-500 text-3xl font-black">₹721</span>
                            </div>
                            <p className="text-xs text-slate-500 mb-8 font-medium px-4 leading-relaxed italic">Get 99% accuracy predictions, ad-free experience, and 24/7 priority support.</p>
                            <div className="flex flex-col gap-3">
                                <button onClick={handlePayment} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-200 active:scale-95 transition-all">PAY WITH UPI</button>
                                <button onClick={() => setShowVipPopup(false)} className="w-full py-2 text-[13px] font-bold text-slate-400">CANCEL</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showHelp && (
                    <>
                        {/* Overlay */}
                        <div
                            className="fixed inset-0 bg-black/85 z-[1000] cursor-pointer"
                            onClick={() => setShowHelp(false)}
                        />

                        {/* Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
                            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                            exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
                            className="fixed top-1/2 left-1/2 bg-white rounded-[18px] p-[25px] shadow-lg w-[90%] max-w-[400px] z-[1001] border border-[#6366F1] text-left"
                        >
                            <div className="flex justify-between items-center mb-[18px] pb-[12px] border-b border-[#E2E8F0]">
                                <h3 className="text-[#1E293B] text-[20px] font-bold flex items-center gap-2">
                                    <HelpCircle className="text-[#6366F1]" size={22} /> How to Use
                                </h3>
                                <button onClick={() => setShowHelp(false)} className="text-[#475569] text-[22px]">
                                    <X size={24} />
                                </button>
                            </div>

                            <ul className="space-y-3 mb-5">
                                {[
                                    "Create a NEW account for best result!",
                                    "Click the 'Register' button to create new account",
                                    "Now, select your preferred Wingo mode (e.g., WinGo 1 Min) in game",
                                    "Hack will show the results on the page!",
                                    "Just maintain level funds! and make sure your account is registered with mod link!"
                                ].map((text, i) => (
                                    <li key={i} className="flex items-start gap-3 text-[#1E293B] font-medium text-[14px] pb-2 border-b border-[#E2E8F0] last:border-0">
                                        <CheckCircle className="text-[#6366F1] mt-1 shrink-0" size={16} />
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => setShowHelp(false)}
                                className="w-full bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white py-[14px] rounded-xl font-bold shadow-md active:scale-95 transition-all"
                            >
                                <i className="fas fa-check mr-2"></i> Okay, I Understand
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GameScreen;