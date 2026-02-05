import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WinGoHackDashboard = () => {
    const [isVip, setIsVip] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState("JALWA GAME");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [planType, setPlanType] = useState("PRO"); // PRO or SUPER_PRO

    // 🟢 Load user and check VIP status on mount
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('WinGo_user'));
        if (storedUser) {
            setUser(storedUser);
            checkVipStatus(storedUser.email);
        } else {
            setLoading(false);
        }
    }, []);

    const checkVipStatus = async (email) => {
        try {
            const res = await axios.post('/api/wingo/check-vip', { email });
            setIsVip(res.data.isVip);
        } catch (err) {
            console.error("VIP Check Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // 🟢 Payment Flow: Create Order
    const handlePayment = async () => {
        try {
            const res = await axios.post('/api/wingo/payment/create', {
                email: user.email,
                planType: planType // "PRO" or "SUPER_PRO"
            });

            if (res.data.status && res.data.results.payment_url) {
                // Store order details to check status after redirect
                localStorage.setItem('wingo_current_order', JSON.stringify({
                    order_id: res.data.results.order_id,
                    planType: planType
                }));
                // Redirect to gateway
                window.location.href = res.data.results.payment_url;
            }
        } catch (err) {
            alert("Payment failed to initialize.");
        }
    };

    // 🟢 Verify Payment if returning from Gateway
    useEffect(() => {
        const verifyPayment = async () => {
            const pendingOrder = JSON.parse(localStorage.getItem('wingo_current_order'));
            if (pendingOrder && user) {
                try {
                    const res = await axios.post('/api/wingo/payment/status', {
                        order_id: pendingOrder.order_id,
                        email: user.email,
                        planType: pendingOrder.planType
                    });

                    if (res.data.status === "Success") {
                        alert(`Success! ${pendingOrder.planType} Activated.`);
                        setIsVip(true);
                        localStorage.removeItem('wingo_current_order');
                    }
                } catch (err) {
                    console.error("Verification failed");
                }
            }
        };
        if (user) verifyPayment();
    }, [user]);

    // --- APP STATES ---
    const [isShuffling, setIsShuffling] = useState(true);
    const [result, setResult] = useState(null);
    const [cooldown, setCooldown] = useState(0);
    const [shuffleBalls, setShuffleBalls] = useState([4, 4, 4]);

    const BALL_ASSETS = {
        0: 'https://i.ibb.co/WpKk6XP5/boll0.png',
        1: 'https://i.ibb.co/pjdKPpGk/boll1.png',
        2: 'https://i.ibb.co/GvTn7MHj/boll2.png',
        3: 'https://i.ibb.co/3GvfjY9/boll3.png',
        4: 'https://i.ibb.co/fztTk9Xk/boll4.png',
        5: 'https://i.ibb.co/yBGNC94B/boll5.png',
        6: 'https://i.ibb.co/YFPyCcfv/boll6.png',
        7: 'https://i.ibb.co/rGfbzCr7/boll7.png',
        8: 'https://i.ibb.co/24gv544/boll8.png',
        9: 'https://i.ibb.co/BH2QBCdm/boll9.png'
    };

    // Continuous 3-Ball Animation
    useEffect(() => {
        let interval;
        if (isShuffling) {
            interval = setInterval(() => {
                setShuffleBalls([
                    Math.floor(Math.random() * 10),
                    Math.floor(Math.random() * 10),
                    Math.floor(Math.random() * 10)
                ]);
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isShuffling]);

    // Reverse Countdown Logic
    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
        } else if (cooldown === 0 && !isShuffling) {
            setResult(null);
            setIsShuffling(true);
        }
        return () => clearInterval(timer);
    }, [cooldown, isShuffling]);

    const handleStart = () => {
        if (!isVip) {
            setShowPayModal(true);
            return;
        }
        if (cooldown > 0) return;
        setIsShuffling(false);
        const randomNum = Math.floor(Math.random() * 10);
        setResult({
            n: randomNum,
            img: BALL_ASSETS[randomNum],
            size: randomNum >= 5 ? 'BIG' : 'SMALL',
            color: [0, 2, 4, 6, 8].includes(randomNum) ? 'RED' : 'GREEN'
        });
        setCooldown(15);
    };

    return (
        <div className="min-h-screen flex flex-col items-center pt-6 px-4 font-sans select-none overflow-x-hidden"
            style={{ background: 'linear-gradient(180deg, #869ff1 0%, #3906e8 50%, #b6d0fe 100%)' }}>
            
            {/* 🟢 TOP BANNER */}
            <div className="w-full max-w-[360px] mb-4">
                <img
                    src="https://i.ibb.co/bMvGfgFg/wingo-bannr.png"
                    className="w-full h-auto rounded-[35px] shadow-2xl"
                    alt="Win Go Hack Banner"
                />
            </div>

            <h2 className="text-[#a0a5ff] font-bold text-[13px] mb-3 uppercase tracking-wider">SELECT THE GAME</h2>

            {/* ORANGE DROPDOWN */}
            <div className="relative w-full max-w-[320px] mb-4">
                <div onClick={() => setShowDropdown(!showDropdown)}
                    className="bg-[#f15a24] rounded-lg py-3 px-4 flex items-center justify-between cursor-pointer shadow-lg active:scale-95 transition-transform">
                    <div className="flex items-center gap-3 text-white font-black text-[15px] italic">
                        <div className="bg-[#1e1a8e] w-8 h-8 rounded-lg flex items-center justify-center">
                            <img src="https://i.ibb.co/pjdKPpGk/boll1.png" className="w-6" alt="ico" />
                        </div>
                        {selectedGame}
                    </div>
                    <span className="text-white text-xs">▼</span>
                </div>
                {showDropdown && (
                    <div className="absolute top-[105%] left-0 right-0 bg-[#f15a24] rounded-lg shadow-2xl z-[200] max-h-[300px] overflow-y-auto">
                        {["JALWA GAME", "BHARAT CLUB", "91CLUB", "TIRANGA", "BDG GAME"].map(game => (
                            <div key={game} onClick={() => { setSelectedGame(game); setShowDropdown(false); }}
                                className="p-4 border-b border-white/10 font-black text-white text-[13px] italic uppercase hover:bg-black/10">
                                {game}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <p className="text-white text-[14px] font-bold mb-6">
                Register New Game Account : <span className="text-[#ff9e48] underline underline-offset-4 decoration-2 cursor-pointer">Sign Up Now</span>
            </p>

            {/* 🟢 WinGo 1 Minute Status Line */}
            <div className="flex items-center gap-2 mb-4 text-[#a0a5ff] font-bold text-[13px]">
                <div className="w-4 h-4 rounded-full border-2 border-[#19d472] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#19d472] rounded-full animate-pulse"></div>
                </div>
                <span>WinGo 1 Minute</span>
                <span className="opacity-50 tracking-tighter">20250802*******</span>
            </div>

            {/* BALL DISPLAY CONTAINER */}
            <div className="bg-[#f5f8ff] p-[3px] rounded-[28px] shadow-2xl mb-8">
                <div className="bg-white rounded-[26px] flex flex-col items-center justify-center min-w-[190px] min-h-[65px]">
                    {isShuffling ? (
                        <div className="flex gap-4">
                            {shuffleBalls.map((num, i) => (
                                <div key={i} className="w-[50px] h-[50px] rounded-full border-[1.5px] border-gray-100 shadow-md flex items-center justify-center bg-white overflow-hidden">
                                    <img src={BALL_ASSETS[num]} className="w-full h-full object-contain" alt="shuffle" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center animate-in zoom-in duration-300">
                            <img src={result?.img} className="w-[50px] h-[50px] drop-shadow-2xl mb-2" alt="result" />
                            <div className="flex gap-2 font-black italic text-[17px] tracking-tight">
                                <span className="text-[#4238ed]">{result?.size}</span>
                                <span className="text-gray-300">|</span>
                                <span style={{ color: result?.color === 'GREEN' ? '#19d472' : '#f15a24' }}>{result?.color}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <p className="text-[#ff9e48] font-black italic text-[15px] mb-6 uppercase tracking-tighter text-center">
                CLICK ON "START" BUTTON TO RUN HACK
            </p>

            {/* START BUTTON & VIP STATUS */}
            <div className="flex flex-col items-center gap-6 w-full max-w-[300px]">
                <div className="relative flex items-center justify-center w-full">
                    <span className="absolute left-0 text-xl opacity-60">🔓</span>
                    <button onClick={handleStart} disabled={cooldown > 0}
                        className="bg-[#1e1a8e] border-[3.5px] border-white px-14 py-2.5 rounded-[15px] font-black text-white text-[24px] italic tracking-tighter shadow-[0_6px_0_white] active:shadow-none active:translate-y-1 transition-all">
                        {cooldown > 0 ? (
                            <div className="bg-[#111111] px-8 py-0.5 rounded-lg border border-white/20 text-white min-w-[80px]">{cooldown}</div>
                        ) : 'START'}
                    </button>
                    <span className="absolute right-0 text-xl opacity-60">🔓</span>
                </div>

                <div className="bg-gradient-to-r from-[#9b51e0] via-[#2d9cdb] to-[#1e1a8e] p-[2px] rounded-full w-full shadow-lg">
                    <div className="bg-white/10 backdrop-blur-md py-1.5 rounded-full flex justify-center items-center">
                        <span className="text-white font-black italic uppercase text-[12px] tracking-tight flex items-center gap-2">
                            {isVip ? "YOU'RE A SUPER VIP USER" : "YOU ARE NOT VIP USER"} <span className="text-cyan-300">💎</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* 🟢 SUBSCRIPTION MODAL */}
            {showPayModal && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-5 z-[500] backdrop-blur-[2px]">
                    <div className="bg-[#ccff00] w-full max-w-[340px] rounded-[22px] p-5 shadow-2xl relative">
                        <h3 className="text-[#1e1a8e] font-black italic text-[17px] text-center uppercase mb-3">Subscribe To Start Hack</h3>
                        
                        {/* Plan Selection Buttons */}
                        <div className="flex justify-center gap-6 mb-4">
                            <button onClick={() => setPlanType("PRO")} className="flex items-center gap-2 text-[#1e1a8e] font-black text-[10px]">
                                <div className={`w-4 h-4 rounded-full border-2 border-[#1e1a8e] flex items-center justify-center ${planType === 'PRO' ? 'bg-[#1e1a8e]' : ''}`}>
                                    {planType === 'PRO' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </div> PRO VERSION
                            </button>
                            <button onClick={() => setPlanType("SUPER_PRO")} className="flex items-center gap-2 text-[#1e1a8e] font-black text-[10px]">
                                <div className={`w-4 h-4 rounded-full border-2 border-[#1e1a8e] flex items-center justify-center ${planType === 'SUPER_PRO' ? 'bg-[#1e1a8e]' : ''}`}>
                                    {planType === 'SUPER_PRO' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </div> SUPER PRO VERSION
                            </button>
                        </div>

                        {/* Plan Card */}
                        <div className="bg-gradient-to-b from-[#49e1f5] to-[#9b51e0] rounded-[18px] p-4 text-white border-[2.5px] border-[#1e1a8e] shadow-lg">
                            <h4 className="font-black italic uppercase border-b-[1.5px] border-white/40 pb-1 mb-3 text-[13px] tracking-tight text-center">
                                {planType === "PRO" ? "PRO VERSION PLAN" : "SUPER PRO VERSION PLAN"}
                            </h4>
                            
                            <div className="space-y-1 text-[11px] font-black mb-5 text-center">
                                <p>RATE - <span className="text-red-500 line-through mr-1">₹{planType === "PRO" ? "899" : "1499"}</span> ₹{planType === "PRO" ? "599" : "999"}</p>
                                <p>VALIDITY - {planType === "PRO" ? "21 DAYS" : "28 DAYS"}</p>
                            </div>
                            
                            {/* Single Payment Button */}
                            <button onClick={handlePayment} className="w-full bg-[#1e1a8e] border-2 border-white py-2.5 rounded-lg font-black text-[14px] uppercase shadow-md mb-4 active:scale-95 transition-transform">
                                PAY NOW
                            </button>

                            <div className="">
                                <p className="font-black text-[10px] mb-2 uppercase border-b border-white/20 inline-block text-center">Features -</p>
                                <div className="space-y-1 text-[10px] font-black italic text-center">
                                    <p>✨ UNLIMITED USE</p>
                                    <p>✨ {planType === "PRO" ? "6/10 ACCURACY" : "FULL ACCURACY"}</p>
                                    <p>✨ {planType === "PRO" ? "LIMITED SURESHOT" : "NUMBER SURESHOT"}</p>
                                    {planType === "SUPER_PRO" && <p>✨ BIG - SMALL SURESHOT</p>}
                                </div>
                            </div>
                        </div>
                        
                        <button onClick={() => setShowPayModal(false)} className="w-full mt-4 text-[#1e1a8e] font-black text-[11px] uppercase underline underline-offset-2 opacity-70">Close</button>
                    </div>
                </div>
            )}

            {/* Footer Buttons */}
            <div className="fixed bottom-6 flex gap-5 z-50">
                <a href="https://wa.me/919116046055" target="_blank" rel="noreferrer" >
                    <img src="https://i.ibb.co/W4T5WthP/whatsapp.png" className="w-10 h-10" alt="whatsapp" />
                </a>
                <a href="https://t.me/modapksh" target="_blank" rel="noreferrer" >
                    <img src="https://i.ibb.co/gxJTLq0/telegram.png" className="w-10 h-10" alt="telegram" />
                </a>
                <a href="https://www.youtube.com/watch?v=-HdcugtTRN4" target="_blank" rel="noreferrer">
                    <img src="https://i.ibb.co/QqxWJXm/youtube.png" className="w-10 h-10 " alt="youtube" />
                </a>
            </div>
        </div>
    );
};

export default WinGoHackDashboard;