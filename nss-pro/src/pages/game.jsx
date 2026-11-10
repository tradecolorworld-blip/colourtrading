import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// 🟢 Single Domain API Helpers
const STORAGE_KEY = 'nsspro_user';
const API_BASE_URL = 'http://localhost:5000'; // Match with your Backend

// Basic Ball Images
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

const GameScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [usdtTxn, setUsdtTxn] = useState('');
    const [usdtFile, setUsdtFile] = useState(null);
    const [usdtLoading, setUsdtLoading] = useState(false);

    // Context from Portal
    const gameData = location.state || {
        name: "VeerGame",
        img: "https://i.ibb.co/zTgb6xMS/veer-game-logo.jpg",
        link: "https://www.veergame15.com/#/register?invitationCode=59151336779"
    };

    // User Data from Storage
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY));

    // Panel States
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVipModalOpen, setIsVipModalOpen] = useState(false);
    const [payTab, setPayTab] = useState('inr');

    // Auth & Logic States
    const [isVip, setIsVip] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);

    // Timer & Game States
    const [time, setTime] = useState(60);
    const [roundId, setRoundId] = useState('202611080001');
    const [isChecking, setIsChecking] = useState(false);

    // Prediction Data
    const [predictedResult, setPredictedResult] = useState(ballData[0]);

    // Drag constraints reference for Framer Motion
    const constraintsRef = useRef(null);

    // 🟢 1. Load user and check VIP status on mount
    useEffect(() => {
        if (!user || !user.email) {
            navigate('/auth');
            return;
        }

        const checkVip = async () => {
            try {
                const res = await axios.post(`/api/nsspro/check-vip`, {
                    email: user.email
                });
                setIsVip(res.data.isVip);
            } catch (err) {
                console.error("VIP Check Error");
            }
        };
        checkVip();
    }, [user, navigate]);

    // 🟢 2. Verify Payment if returning from Gateway
    useEffect(() => {
        if (isVip) return;

        const verifyPayment = async () => {
            const pendingOrder = JSON.parse(localStorage.getItem('nsspro_current_order'));
            if (pendingOrder && user) {
                try {
                    const res = await axios.post(`/api/nsspro/payment/status`, {
                        order_id: pendingOrder.order_id,
                        email: user.email
                    });

                    if (res.data.status === "Success") {
                        alert(`Success! VIP Activated.`);
                        setIsVip(true);
                        localStorage.removeItem('nsspro_current_order');
                    }
                } catch (err) {
                    console.error("Verification failed");
                }
            }
        };
        verifyPayment();
    }, [user, isVip]);

    // 🟢 3. Payment Flow: Create Order
    // 🟢 3. Payment Flow: Create Order
    const handlePayment = async () => {
        setPaymentLoading(true);
        try {
            const res = await axios.post(`/api/nsspro/payment/create`, { email: user.email });

            // 🟢 CORRECTED: res.data.results.payment_url
            if (res.data && res.data.results && res.data.results.payment_url) {
                localStorage.setItem('nsspro_current_order', JSON.stringify({
                    order_id: res.data.results.order_id
                }));
                window.location.href = res.data.results.payment_url;
            } else {
                alert("Payment initiation failed. Invalid response from server.");
            }
        } catch (err) {
            alert("Payment failed to initialize.");
        } finally {
            setPaymentLoading(false);
        }
    };

    // 🟢 MANUAL USDT SUBMIT FUNCTION
    const submitUsdt = async () => {
        if (!usdtTxn.trim()) {
            alert("❌ Please enter transaction ID / Hash.");
            return;
        }
        if (!usdtFile) {
            alert("❌ Please upload the payment screenshot.");
            return;
        }

        setUsdtLoading(true);

        // File upload ke liye FormData zaroori hai
        const fd = new FormData();
        fd.append('email', user.email);
        fd.append('txn_id', usdtTxn);
        fd.append('screenshot', usdtFile); // Yahan file attach ho rahi hai

        try {
            const res = await axios.post(`/api/nsspro/payment/usdt-submit`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                alert("✅ " + res.data.message);
                setIsVipModalOpen(false); // Success ke baad modal band
                setUsdtTxn('');           // Inputs clear kar do
                setUsdtFile(null);
            }
        } catch (err) {
            alert(err.response?.data?.message || "❌ Submission failed.");
            console.error(err);
        } finally {
            setUsdtLoading(false);
        }
    };

    // Timer & Result Logic
    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const utcSec = now.getUTCSeconds();
            const utcMin = now.getUTCMinutes();
            const utcHrs = now.getUTCHours();
            const totalSeconds = utcHrs * 3600 + utcMin * 60 + utcSec;

            let cycle = 60; // 1 Min
            const remaining = cycle - (totalSeconds % cycle);
            const displayRemaining = Math.max(0, remaining - 1);

            setTime(displayRemaining);
            setRoundId(`${now.toISOString().slice(0, 10).replace(/-/g, '')}1000${10001 + Math.floor(totalSeconds / cycle)}`);

            if (remaining === cycle) {
                setIsChecking(true);
                setTimeout(() => {
                    setPredictedResult(ballData[Math.floor(Math.random() * 10)]);
                    setIsChecking(false);
                }, 2000);
            }
        };
        const t = setInterval(updateTimer, 1000);
        return () => clearInterval(t);
    }, []);

    // Format for display
    const mins = Math.floor(time / 60).toString().padStart(2, '0');
    const secs = (time % 60).toString().padStart(2, '0');
    const progressPercent = ((60 - time) / 60) * 100;

    return (
        <div className="fixed inset-0 w-full h-full bg-black overflow-hidden font-['Inter',sans-serif]" ref={constraintsRef}>

            {/* Full Screen Game Iframe */}
            <iframe
                src={gameData.link || "https://www.veergame15.com/#/register?invitationCode=59151336779"}
                className="w-full h-full border-none z-[1]"
                title={gameData.name}
            />

            {/* Floating Prediction Bubble (Draggable) */}
            <motion.div
                className="fixed z-[9999] touch-none select-none"
                initial={{ bottom: 120, right: 16 }}
                drag
                dragConstraints={constraintsRef}
                dragElastic={0.1}
                dragMomentum={false}
                style={{ zIndex: isExpanded ? 10000 : 9999 }}
            >

                {/* COLLAPSED ORB */}
                <AnimatePresence>
                    {!isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            onClick={() => setIsExpanded(true)}
                            className="relative w-[64px] h-[64px] rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center bg-gradient-to-br from-[#7B35D9] to-[#5B15A9] shadow-[0_4px_24px_rgba(123,53,217,0.6),0_0_0_2px_rgba(212,160,23,0.3)]"
                        >
                            <div className="absolute inset-[-4px] rounded-full animate-[spin_2s_linear_infinite]">
                                <svg viewBox="0 0 72 72" fill="none" className="w-full h-full">
                                    <circle cx="36" cy="36" r="32" stroke="#FF3B5C" strokeWidth="3" strokeDasharray="60 140" strokeLinecap="round" />
                                    <circle cx="36" cy="36" r="32" stroke="rgba(212,160,23,0.5)" strokeWidth="1.5" strokeDasharray="100 100" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className="absolute inset-[-8px] rounded-full bg-[radial-gradient(circle,rgba(123,53,217,0.4),transparent)] animate-[pulse_2s_ease-in-out_infinite] -z-10"></div>
                            <div className="relative z-10">
                                <img src={gameData.img} className="w-[36px] h-[36px] rounded-[10px] object-contain block bg-white" alt="Logo" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* EXPANDED PANEL */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-[250px] rounded-[20px] overflow-hidden relative shadow-[0_8px_40px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.1)]"
                            style={{ background: 'linear-gradient(175deg, #7B2BCE 0%, #9B3A8B 28%, #B55070 50%, #C87040 75%, #D4A017 100%)' }}
                        >
                            <div className="p-[8px_12px_6px] flex items-center justify-center">
                                <div className="flex items-center gap-[6px] bg-[rgba(0,0,0,0.35)] rounded-[30px] p-[4px_10px] border border-[rgba(255,255,255,0.15)]">
                                    <img src={gameData.img} className="w-[18px] h-[18px] rounded-[5px] object-contain bg-white" alt="Game" />
                                    <span className="font-['Rajdhani',sans-serif] text-[11.5px] font-bold text-white tracking-[0.3px]">{gameData.name}</span>
                                    <span className="text-[rgba(255,255,255,0.4)] text-[10.4px]">·</span>
                                    <span className="text-[10.5px] text-[rgba(255,255,255,0.7)]">1 Min</span>
                                </div>
                            </div>

                            <div className="bg-[rgba(0,0,0,0.4)] m-[0_10px] rounded-[13px] p-[10px] border border-[rgba(255,255,255,0.08)]">
                                <div className="flex items-center justify-between mb-[8px]">
                                    <div className="flex items-center gap-[5px]">
                                        <div className="w-[6px] h-[6px] rounded-full bg-[#00C851] shadow-[0_0_6px_#00C851] animate-[pulse_1.4s_ease-in-out_infinite]"></div>
                                        <span className="text-[10.4px] font-semibold text-[rgba(255,255,255,0.85)]">WinGo 1 Min</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[8px] text-[rgba(255,255,255,0.45)] uppercase tracking-[0.5px]">Round ID</div>
                                        <div className="text-[9px] font-bold text-[rgba(255,255,255,0.8)] font-mono">{roundId}</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-[5px] mb-[7px]">
                                    <div className="text-center">
                                        <div className="bg-[rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.1)] rounded-[7px] w-[42px] h-[36px] flex items-center justify-center font-['Rajdhani',sans-serif] text-[20.8px] font-bold text-[#F0C040]">{mins}</div>
                                        <div className="text-[7px] text-[rgba(255,255,255,0.4)] uppercase tracking-[0.8px] mt-[2px]">MIN</div>
                                    </div>
                                    <div className="text-[17.6px] font-bold text-[rgba(255,255,255,0.5)] mb-[10px]">:</div>
                                    <div className="text-center">
                                        <div className="bg-[rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.1)] rounded-[7px] w-[42px] h-[36px] flex items-center justify-center font-['Rajdhani',sans-serif] text-[20.8px] font-bold text-[#F0C040]">{secs}</div>
                                        <div className="text-[7px] text-[rgba(255,255,255,0.4)] uppercase tracking-[0.8px] mt-[2px]">SEC</div>
                                    </div>
                                </div>

                                <div className="h-[2px] bg-[rgba(255,255,255,0.15)] rounded-[2px] overflow-hidden mt-[2px]">
                                    <div className="h-full bg-gradient-to-r from-[#D4A017] to-[#F0C040] rounded-[2px] transition-[width] duration-1000 ease-linear" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                            </div>

                            <div className="text-center font-['Rajdhani',sans-serif] text-[13.1px] font-bold text-white tracking-[2px] p-[8px_0_5px] drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">PREDICTIONS</div>

                            <div className="bg-[rgba(0,0,0,0.45)] m-[0_10px] rounded-[13px] p-[12px_10px] border border-[rgba(255,255,255,0.08)] min-h-[110px] flex items-center justify-center">
                                {isVip ? (
                                    /* VIP LOGIC (Showing Numbers & Checking State) */
                                    <div className="w-full text-center">
                                        {isChecking ? (
                                            <span className="text-[14px] text-white animate-pulse">Calculating...</span>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="relative w-[78px] h-[78px] mx-auto mb-[5px] shrink-0">
                                                    <svg viewBox="0 0 100 100" fill="none" className="absolute inset-0 animate-[spin_1.8s_linear_infinite]">
                                                        <circle cx="50" cy="50" r="44" stroke="#00C851" strokeWidth="4" strokeDasharray="80 196" strokeLinecap="round" />
                                                    </svg>
                                                    <div className="absolute inset-[10px] rounded-full bg-[rgba(5,0,15,0.9)] border-[1.5px] border-[rgba(255,255,255,0.2)] flex items-center justify-center">
                                                        <span className="font-['Rajdhani',sans-serif] text-[35px] font-black text-[#00C851] leading-none">{predictedResult.n}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 w-full justify-center px-4">
                                                    <div className={`flex-1 py-1 rounded-[6px] font-black text-white text-[12px] ${predictedResult.n >= 5 ? 'bg-[#8B5CF6]' : 'bg-[#3B82F6]'}`}>
                                                        {predictedResult.n >= 5 ? 'BIG' : 'SMALL'}
                                                    </div>
                                                    <div className={`flex-1 py-1 rounded-[6px] font-black text-white text-[12px] ${predictedResult.color === 'Green' ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}>
                                                        {predictedResult.color.toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* NON-VIP LOGIC (Locked) */
                                    <div className="w-full text-center">
                                        <div className="relative w-[78px] h-[78px] mx-auto mb-[10px] shrink-0 opacity-35">
                                            <svg viewBox="0 0 100 100" fill="none" className="absolute inset-0 animate-[spin_1.8s_linear_infinite]">
                                                <circle cx="50" cy="50" r="44" stroke="#FF3B5C" strokeWidth="4" strokeDasharray="80 196" strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute inset-[10px] rounded-full bg-[rgba(5,0,15,0.9)] border-[1.5px] border-[rgba(255,255,255,0.2)] flex items-center justify-center">
                                                <span className="text-[25.6px]">🔒</span>
                                            </div>
                                        </div>
                                        <div className="font-['Rajdhani',sans-serif] text-[14px] font-bold text-[rgba(255,255,255,0.8)] leading-[1.4] mb-[10px]">Activate VIP to<br />see the predictions</div>
                                        <div className="flex gap-[8px] justify-center mt-[10px]">
                                            <button onClick={() => setIsVipModalOpen(true)} className="flex-1 p-[8px_5px] rounded-[9px] max-w-[95px] bg-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.15)] text-[17.6px]">🔒</button>
                                            <button onClick={() => setIsVipModalOpen(true)} className="flex-1 p-[8px_5px] rounded-[9px] max-w-[95px] bg-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.15)] text-[17.6px]">🔒</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button onClick={() => setIsExpanded(false)} className="block w-[calc(100%-20px)] m-[8px_10px] p-[9px] bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.12)] rounded-[10px] font-['Rajdhani',sans-serif] text-[12.5px] font-bold text-[rgba(255,255,255,0.7)] tracking-[1px] text-center hover:bg-[rgba(0,0,0,0.7)] hover:text-white transition-all">
                                HIDE &nbsp;👁️
                            </button>
                            <button onClick={() => navigate('/portal')} className="block text-center text-[10.8px] text-[rgba(255,255,255,0.35)] p-[0_12px_12px] hover:text-white transition-colors w-full">
                                ← Back to games
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* VIP MODAL OVERLAY */}
            {isVipModalOpen && (
                <div
                    className="fixed inset-0 z-[10000] bg-[rgba(0,0,0,0.7)] backdrop-blur-[10px] flex items-end justify-center animate-[fadeIn_0.2s_ease]"
                    onClick={(e) => { if (e.target === e.currentTarget) setIsVipModalOpen(false) }}
                >
                    <div className="w-full max-w-[480px] max-h-[92vh] overflow-y-auto rounded-t-[28px] pb-[24px] relative bg-gradient-to-b from-[#031A08] via-[#061408] to-[#0A1A04] border border-b-0 border-[rgba(0,200,81,0.2)] shadow-[0_-16px_60px_rgba(0,0,0,0.6)] animate-[slideUp_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
                        <div className="w-[40px] h-[4px] bg-[rgba(255,255,255,0.2)] rounded-[2px] mx-auto mt-[12px]"></div>
                        <div className="flex items-center justify-between p-[16px_20px_0]">
                            <div className="font-['Rajdhani',sans-serif] text-[19.2px] font-bold text-[#D4A017]">💎 VIP Access</div>
                            <button onClick={() => setIsVipModalOpen(false)} className="w-[32px] h-[32px] rounded-full bg-[rgba(255,255,255,0.08)] text-[#B0A8C8] text-[16px] flex items-center justify-center hover:bg-[rgba(255,59,92,0.2)] hover:text-[#FF3B5C]">✕</button>
                        </div>
                        <div className="px-[20px]">
                            <div className="flex bg-[rgba(0,0,0,0.4)] border border-[rgba(120,60,220,0.15)] rounded-[14px] p-[4px] m-[16px_0_20px] gap-[4px]">
                                <button onClick={() => setPayTab('inr')} className={`flex-1 py-[9px] rounded-[12px] text-[13.6px] font-semibold transition-all ${payTab === 'inr' ? 'text-[#00E563] border-b-2 border-[#00E563] bg-[rgba(0,200,81,0.08)]' : 'text-[#7060A0]'}`}>💳 INR</button>
                                <button onClick={() => setPayTab('usdt')} className={`flex-1 py-[9px] rounded-[12px] text-[13.6px] font-semibold transition-all ${payTab === 'usdt' ? 'text-[#00E563] border-b-2 border-[#00E563] bg-[rgba(0,200,81,0.08)]' : 'text-[#7060A0]'}`}>🔗 USDT</button>
                            </div>

                            {payTab === 'inr' && (
    <div className="animate-[fadeIn_0.2s_ease]">
        {/* Price Box */}
        <div className="text-center p-[24px] rounded-[16px] mb-[16px] bg-[rgba(26,17,40,0.6)] border border-[#3b2159]">
            <div className="text-[12px] text-[#816b9b] uppercase tracking-[1.5px] mb-[8px] font-semibold">VIP Membership</div>
            <div className="font-['Rajdhani',sans-serif] text-[40px] font-bold text-[#FCD34D] leading-none mb-[8px]">₹899</div>
            <div className="text-[14px] text-[#A78BFA]">17 days · All games</div>
        </div>

        {/* Features List */}
        <div className="mb-[24px]">
            {[
                'Real-time colour predictions', 
                'WinGo 1 Min coverage', 
                '91% accuracy AI model', 
                'Skip-round traffic alerts'
            ].map((text, i) => (
                <div key={i} className="flex items-center gap-[12px] p-[12px_0] text-[14px] text-[#D8B4FE] border-b border-[rgba(120,60,220,0.15)] last:border-0">
                    <div className="w-[20px] h-[20px] rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-[11px] shrink-0 font-bold shadow-[0_0_8px_rgba(124,58,237,0.5)]">
                        ✓
                    </div> 
                    <span>{text}</span>
                </div>
            ))}
        </div>

        {/* Pay Button */}
        <button
            onClick={handlePayment}
            disabled={paymentLoading}
            className="w-full p-[15px] bg-[#7C3AED] text-white rounded-[10px] font-bold text-[16px] tracking-[0.5px] shadow-[0_4px_20px_rgba(124,58,237,0.4)] hover:bg-[#6D28D9] disabled:opacity-50 transition-all flex justify-center items-center gap-2"
        >
            {paymentLoading ? (
                <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Initiating...</>
            ) : (
                "⚡ Pay Now with UPI"
            )}
        </button>
    </div>
)}

                            {/* USDT Pane */}
                            {payTab === 'usdt' && (
                                <div className="animate-[fadeIn_0.2s_ease]">
                                    
                                    {/* USDT Address Box */}
                                    <div className="bg-[rgba(0,0,0,0.4)] border border-[rgba(120,60,220,0.2)] rounded-[14px] p-[14px] mb-[14px] text-center">
                                        <div className="text-[11.2px] text-[#7060A0] mb-[6px] uppercase tracking-[0.5px]">USDT ADDRESS (TRC20)</div>
                                        <div 
                                            className="text-[12px] text-[#00D4FF] break-all cursor-pointer hover:text-white flex items-center justify-center gap-2" 
                                            onClick={() => {
                                                navigator.clipboard.writeText("0x5F2AA782a161D20818510960530ba3554bb7Fd86");
                                                alert("Address Copied!");
                                            }}
                                        >
                                            0x5F2AA782a161D20818510960530ba3554bb7Fd86 📋
                                        </div>
                                    </div>

                                    {/* QR Code */}
                                    <div className="bg-white p-2 rounded-xl max-w-[160px] mx-auto mb-4 border border-[rgba(120,60,220,0.2)]">
                                        {/* Dynamic QR API use ki hai as fallback agar local image na ho */}
                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0x5F2AA782a161D20818510960530ba3554bb7Fd86" className="w-full h-auto" alt="USDT QR" />
                                    </div>

                                    <p className="text-[12.8px] text-[#7060A0] mb-[12px] text-center">
                                        Send exactly <strong className="text-[#F0C040]">$10 USDT</strong> on TRC20 network, then submit TXN ID.
                                    </p>
                                    
                                    {/* Transaction Hash Input */}
                                    <input 
                                        type="text" 
                                        placeholder="Transaction ID / Hash" 
                                        value={usdtTxn}
                                        onChange={(e) => setUsdtTxn(e.target.value)}
                                        className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(120,60,220,0.2)] rounded-[8px] p-[12px_14px] text-[13.6px] text-white outline-none mb-[10px] focus:border-[rgba(123,53,217,0.5)] focus:shadow-[0_0_0_3px_rgba(123,53,217,0.12)]" 
                                    />
                                    
                                    {/* Screenshot File Input */}
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => setUsdtFile(e.target.files[0])}
                                        className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(120,60,220,0.2)] rounded-[8px] p-[10px_14px] text-[12px] text-white outline-none mb-[14px] cursor-pointer file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#00C851] file:text-white hover:file:bg-[#00E563]" 
                                    />
                                    
                                    {/* Submit Button */}
                                    <button 
                                        onClick={submitUsdt}
                                        disabled={usdtLoading}
                                        className="w-full p-[15px] bg-gradient-to-br from-[#00C851] to-[#006629] text-white rounded-[8px] font-['Rajdhani',sans-serif] text-[16px] font-bold tracking-[0.5px] shadow-[0_4px_20px_rgba(0,200,81,0.35)] hover:from-[#00E563] hover:to-[#008A35] flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                                    >
                                        {usdtLoading ? (
                                            <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Submitting...</>
                                        ) : (
                                            "📤 Submit for Review"
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(40px); opacity: 0.7; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
};

export default GameScreen;