import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NumberHackDashboard = () => {
    const [isVip, setIsVip] = useState(true);
    const [currentTime, setCurrentTime] = useState("");
    const [periodNumber, setPeriodNumber] = useState("");
    const [timerType, setTimerType] = useState("1 Min");
    const [showPayModal, setShowPayModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // --- DROPDOWN STATE ---
    const [selectedGame, setSelectedGame] = useState("Jalwa");
    const [showDropdown, setShowDropdown] = useState(false);
    const [result, setResult] = useState(null);

    // Full game list from screenshots
    const GAMES = [
        "Jalwa", "Tashan", "BDG", "91Club", "DiuWin", "Tiranga",
        "Tc Lottery", "Raja Luck", "Big Mumbai", "Goa Game",
        "KWG", "OkWin", "Sikkim", "Lottery7", "82Lottery",
        "66Lottery", "55Club", "51Game", "IN999", "Bharat Club"
    ];

    const BALLS = [
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

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', {
                hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit'
            }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleStartClick = () => {
        if (!isVip) {
            setShowPayModal(true);
        } else if (periodNumber.length === 4) {
            const randomBall = BALLS[Math.floor(Math.random() * BALLS.length)];
            setResult(randomBall);
        } else {
            alert("Enter 4 digits");
        }
    };

    // 🟢 1. Initial Check: Is user VIP?
    useEffect(() => {
        const checkInitialVip = async () => {
            const user = JSON.parse(localStorage.getItem('NumberHack_user'));
            if (!user || !user.email) return;

            try {
                const res = await axios.post('/api/numberhack/check-vip', { email: user.email });
                if (res.data.isVip) {
                    setIsVip(true);
                }
            } catch (err) {
                console.error("NumberHack VIP check failed", err);
            }
        };
        checkInitialVip();
    }, []);

    // 🟢 2. Payment Tracking: Check Status after redirect
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('NumberHack_user'));
        const pendingOrderId = localStorage.getItem('numberhack_pending_order_id');

        if (pendingOrderId && !isVip && user) {
            const verifyPayment = async () => {
                try {
                    const res = await axios.post('/api/numberhack/payment/status', {
                        order_id: pendingOrderId,
                        email: user.email
                    });

                    if (res.data.status === "Success") {
                        setIsVip(true);
                        localStorage.setItem('NumberHack_user', JSON.stringify(res.data.user));
                        localStorage.removeItem('numberhack_pending_order_id');
                        alert("💎 NumberHack Premium Activated!");
                    }
                } catch (err) {
                    console.error("Verification failed", err);
                }
            };
            verifyPayment();
        }
    }, [isVip]);

    // 🟢 3. Create Order Logic (₹499)
    const handleUpgrade = async () => {
        const user = JSON.parse(localStorage.getItem('NumberHack_user'));
        if (!user) return alert("Please login again");

        setLoading(true);
        try {
            const res = await axios.post('/api/numberhack/payment/create', {
                email: user.email
            });

            if (res.data.status === true) {
                localStorage.setItem('numberhack_pending_order_id', res.data.results.order_id);
                window.location.href = res.data.results.payment_url;
            } else {
                alert("Payment error: " + res.data.message);
                setLoading(false);
            }
        } catch (err) {
            console.error("Payment creation failed", err);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans overflow-x-hidden"
            style={{ background: 'linear-gradient(to bottom, #e85d34 0%, #fdbb2d 100%)' }}>

            {/* Header */}
            <header className="flex justify-between items-center p-4 border-b border-black/10">
                <h1 className="text-2xl font-black italic tracking-tighter text-[#1a1a1a]">NUMBER HACK</h1>
                <div className="bg-black px-4 py-1.5 rounded-2xl shadow-md flex flex-col items-center leading-none">
                    <span className="text-[10px] font-black italic">Logout</span>
                    <span className="text-lg">➔</span>
                </div>
            </header>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
                <div className="flex items-center gap-2">
                    <span className="bg-[#4caf50] text-white text-[10px] px-3 py-1 rounded-full font-bold">Online</span>
                    <span className="font-bold text-[#1a1a1a]">{currentTime}</span>
                </div>
                <div className="font-bold text-sm flex items-center gap-1">
                    <span className="drop-shadow-md text-[#1a1a1a] uppercase">YOU'RE VIP USER 💎</span>
                </div>
            </div>

            <main className="flex-1 flex flex-col items-center px-6 pt-8 pb-32">

                {/* Scrollable Dropdown Selector */}
                <div className="relative w-full max-w-xs mb-6">
                    <div
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="bg-white rounded-full p-1.5 flex items-center shadow-lg cursor-pointer"
                    >
                        <div className="bg-[#1a1c2c] w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
                            {selectedGame.charAt(0)}
                        </div>
                        <div className="flex-1 px-4 font-bold text-gray-700">{selectedGame}</div>
                        <span className="pr-4 text-orange-500">▼</span>
                    </div>

                    {showDropdown && (
                        <div className="absolute top-[110%] left-0 right-0 bg-[#e85d34] rounded-xl shadow-2xl z-[100] border border-white/20 overflow-hidden max-h-[300px] overflow-y-auto">
                            {GAMES.map(game => (
                                <div key={game} onClick={() => { setSelectedGame(game); setShowDropdown(false); }}
                                    className="p-3 font-bold text-white text-center hover:bg-black/10 cursor-pointer border-b border-white/10 last:border-0">
                                    {game}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Timer Selectors */}
                <div className="flex gap-4 mb-8">
                    {["30 Sec", "1 Min", "5 Min"].map(type => (
                        <button key={type} onClick={() => setTimerType(type)}
                            className={`px-5 py-2 rounded-full font-bold shadow-md transition-all ${timerType === type ? 'bg-[#f0f06a] text-black' : 'bg-white text-gray-500'
                                }`}>
                            {type}
                        </button>
                    ))}
                </div>

                {/* Period Input */}
                <div className="w-full max-w-xs text-center border-t border-black/10 pt-6">
                    <h2 className="text-xl font-black italic text-[#1a1a1a] mb-4 uppercase">Enter Period Number</h2>
                    <input
                        type="text"
                        placeholder="1053"
                        className="w-full bg-[#f0f06a] text-black placeholder:text-gray-500 text-center py-3 rounded-xl font-bold shadow-inner outline-none mb-6 text-lg border-none"
                        value={periodNumber}
                        onChange={(e) => setPeriodNumber(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    />

                    {/* 🟢 INTEGRATED BANNER */}
                    {result && (
                        <div className="relative w-full h-[100px] mb-6 flex items-center justify-between px-10 overflow-hidden animate-in fade-in duration-500">
                            {/* Banner Background */}
                            <img
                                src="https://i.ibb.co/zhhWCFfD/banner.png"
                                className="absolute inset-0 w-full h-full object-fill z-0"
                                alt="banner"
                            />

                            {/* Left Side: Ball inside */}
                            <div className="relative z-10">
                                <img src={result.img} className="w-16 h-16 drop-shadow-lg" alt="ball" />
                            </div>

                            {/* Center Perforation simulated by border */}
                            <div className="absolute left-1/2 -translate-x-1/2 h-2/3 border-l border-white/20 border-dashed z-0"></div>

                            {/* Right Side: Prediction Text */}
                            <div className="relative z-10 flex flex-col items-center justify-center -mr-2.5">
                                <div className="text-[18px] font-black italic tracking-tighter leading-none">
                                    <span className="text-black/80">{result.n >= 5 ? 'BIG ' : 'SMALL '}</span>
                                    <span style={{ color: result.color === 'Green' ? '#00ff00' : '#ffffff' }}>
                                        {result.color.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleStartClick}
                        className="w-full bg-[#e85d34] text-white py-3 rounded-lg font-black text-xl shadow-[0_4px_0_#a83d1d] active:shadow-none active:translate-y-1 transition-all"
                    >
                        START
                    </button>
                </div>

                {/* Footer Section */}
                <div className="mt-8 text-center border-t border-black/10 w-full pt-6">
                    <h3 className="font-black italic text-[#1a1a1a] text-sm uppercase">New User? Sign Up in Jalwa</h3>
                    <p className="text-purple-800 font-black italic underline mt-1 cursor-pointer">SIGN UP HERE</p>

                </div>
            </main>

            {/* Bottom Nav Dock */}
            <div className="fixed bottom-0 left-0 right-0 grid grid-cols-3 gap-2 p-2 bg-transparent z-50">
                <div className="bg-[#5cb85c] text-white py-3 rounded-md font-black italic text-xs shadow-md border-b-4 border-black/20 text-center">WHATSAPP</div>
                <div className="bg-[#5bc0de] text-white py-3 rounded-md font-black italic text-xs shadow-md border-b-4 border-black/20 text-center">TELEGRAM</div>
                <div className="bg-[#d9534f] text-white py-3 rounded-md font-black italic text-xs shadow-md border-b-4 border-black/20 text-center">YOUTUBE</div>
            </div>

            {/* 🟢 Payment Modal */}
            {showPayModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-[340px] p-6 rounded-2xl text-center border border-white/10">
                        <h3 className="font-bold text-xl mb-2 text-black">Unlock Premium Hack</h3>
                        <div className="flex flex-col items-center mb-6">
                            <span className="text-gray-400 line-through text-lg font-bold">₹899</span>
                            <p className="text-[#e85d34] font-black text-4xl mt-1">₹499</p>
                        </div>

                        <button
                            className="bg-[#e85d34] text-white w-full py-3.5 rounded-xl font-black mb-3 text-lg disabled:opacity-50"
                            onClick={handleUpgrade}
                            disabled={loading}
                        >
                            {loading ? "Initializing..." : "Pay with UPI"}
                        </button>

                        <button className="text-gray-400 text-sm font-bold" onClick={() => setShowPayModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NumberHackDashboard;