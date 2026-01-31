import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SureShotDashboard = () => {
    const [isVip, setIsVip] = useState(false);
    const [selectedGame, setSelectedGame] = useState("✔ Select The Game");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [result, setResult] = useState(null);
    const [cooldown, setCooldown] = useState(0);
    const [loading, setLoading] = useState(false); // 🟢 Added loading state for payment

    const GAMES = [
        'Jalwa Game', 'TashanWin', '91Club', 'Tc Lottery', 'BDG', 'DiuWin',
        'Daman', '82 Lottery', 'Sikkim', '55Club', 'Dream99', 'OKWin',
        'Tiranga Game', '51 Game', '66 Lottery', 'Bharat Club', 'IN999',
        'Lottery7', 'RajaLuck', 'KWG Game', 'Raja Games'
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

    // 🟢 1. Initial Check: Is user VIP?
    useEffect(() => {
        const checkInitialVip = async () => {
            const sureUser = JSON.parse(localStorage.getItem('Sure_user'));
            if (!sureUser || !sureUser.email) return;

            try {
                const res = await axios.post('/api/sureshot/check-vip', { email: sureUser.email });
                if (res.data.isVip) {
                    setIsVip(true);
                }
            } catch (err) {
                console.error("SureShot VIP check failed", err);
            }
        };
        checkInitialVip();
    }, []);

    // 🟢 2. Payment Tracking: Check Status after redirect
    useEffect(() => {
        const sureUser = JSON.parse(localStorage.getItem('Sure_user'));
        const pendingOrderId = localStorage.getItem('sure_pending_order_id');

        if (pendingOrderId && !isVip && sureUser) {
            const verifyPayment = async () => {
                try {
                    const res = await axios.post('/api/sureshot/payment/status', {
                        order_id: pendingOrderId,
                        email: sureUser.email
                    });

                    if (res.data.status === "Success") {
                        setIsVip(true);
                        localStorage.setItem('Sure_user', JSON.stringify(res.data.user));
                        localStorage.removeItem('sure_pending_order_id');
                        alert("💎 SureShot Premium Activated for 28 Days!");
                    }
                } catch (err) {
                    console.error("SureShot verification failed", err);
                }
            };
            verifyPayment();
        }
    }, [isVip]);

    // 🟢 3. Payment Tracking: Check Status after redirect
    const handleUpgrade = async () => {
        const sureUser = JSON.parse(localStorage.getItem('Sure_user'));
        if (!sureUser) return alert("Please login again");

        setLoading(true);
        try {
            const res = await axios.post('/api/sureshot/payment/create', {
                email: sureUser.email
            });

            if (res.data.status === true) {
                localStorage.setItem('sure_pending_order_id', res.data.results.order_id);
                window.location.href = res.data.results.payment_url;
            } else {
                alert("Payment error: " + res.data.message);
                setLoading(false);
            }
        } catch (err) {
            console.error("SureShot payment creation failed", err);
            setLoading(false);
        }
    };


    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleStart = () => {
        if (!isVip) {
            setShowPayModal(true);
            return;
        }
        if (selectedGame === "✔ Select The Game") {
            alert("Please select a game first!");
            return;
        }
        const randomBall = BALLS[Math.floor(Math.random() * BALLS.length)];
        setResult(randomBall);
        setCooldown(15);
    };

    return (
        <div className="min-h-screen text-[#fff7ee] flex items-center justify-center p-4 font-inter relative overflow-hidden"
            style={{
                background: `radial-gradient(1200px 380px at 50% 86%, rgba(23,230,255,.25), transparent 60%),
                             radial-gradient(900px 380px at 50% 12%, rgba(255,59,47,.35), transparent 55%),
                             radial-gradient(300px 120px at 50% 7.5%, rgba(255,115,99,.5), transparent 60%), #0b0b0e`
            }}>

            {/* Nav Section */}
            <nav className="fixed top-2 left-0 right-0 flex justify-between items-center px-4 py-2 z-50">
                <div className="flex items-center gap-2.5">
                    <img src="https://firebasestorage.googleapis.com/v0/b/colour-trading-hack-73283.appspot.com/o/sureshothack%20logo.png?alt=media&token=e8bfd014-4ab5-4bf3-ac14-96df789d284e"
                        alt="Logo" className="w-9 h-9 rounded-lg" />
                    <span className="font-bold text-sm tracking-wide">SureShot_Hack</span>
                </div>
                <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }}
                    className="bg-[#0B1220] border border-white/10 px-3.5 py-2 rounded-xl text-[#cfe7ff] text-sm font-medium">
                    Logout
                </button>
            </nav>

            {/* Main Frame */}
            <main className="mt-20 w-full max-w-[760px] rounded-xl border-2 border-white/10 p-6 text-center shadow-[0_0_28px_rgba(23,230,255,0.35),0_0_48px_rgba(255,59,47,0.35)] relative z-10"
                style={{
                    background: `radial-gradient(65% 120% at 95% 50%, rgba(22,205,255,.22), transparent 60%), 
                                      radial-gradient(70% 110% at 5% 50%, rgba(255,59,47,.22), transparent 60%), #0f2131` }}>

                {/* Game Dropdown */}
                <div className="relative inline-block mb-3">
                    <div onClick={() => setShowDropdown(!showDropdown)}
                        className="cursor-pointer flex items-center gap-2.5 bg-[#9cc7da] text-[#0d2a39] px-4.5 py-3 rounded-full font-extrabold text-sm">
                        {selectedGame}
                    </div>
                    {showDropdown && (
                        <div className="absolute top-[110%] left-1/2 -translate-x-1/2 bg-white text-black min-w-[220px] rounded-xl shadow-2xl max-h-[300px] overflow-y-auto z-[100]">
                            {GAMES.map(game => (
                                <div key={game} onClick={() => { setSelectedGame(game); setShowDropdown(false); }}
                                    className="p-2.5 hover:bg-gray-100 hover:text-[#d83434] cursor-pointer font-bold border-b border-gray-100 last:border-0">
                                    {game}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="font-cinzel font-bold text-[28px] my-3 tracking-wider">
                    {isVip ? '★ YOU’RE A VIP USER ★' : 'YOU’RE NOT VIP ★'}
                </div>

                <div className="font-cinzel font-bold text-2xl mb-4 tracking-tighter">CLICK TO START</div>

                <button onClick={handleStart} disabled={cooldown > 0}
                    className="bg-[#d83434] text-white px-6 py-3.5 rounded-2xl font-extrabold text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-50">
                    {cooldown > 0 ? `${cooldown}s` : 'START NOW'}
                </button>

                {/* Result Box */}
                {result && (
                    <div className="mt-6 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <img src={result.img} alt="Ball" className="w-[140px] h-[140px] drop-shadow-[0_0_12px_rgba(23,230,255,0.5)]" />
                        <div className="flex gap-2.5 justify-center mt-2.5">
                            <span className="bg-[#0e1726] border border-[#203044] text-[#cfe7ff] px-3 py-2 rounded-full font-extrabold">{result.n >= 5 ? 'Big' : 'Small'}</span>
                            <span className={`bg-[#0e1726] border px-3 py-2 rounded-full font-extrabold ${result.color === 'Green' ? 'text-[#e6fff3] border-[#2ad07b]/50' : 'text-[#ffecec] border-[#ff6464]/55'}`}>
                                {result.color}
                            </span>
                        </div>
                    </div>
                )}

                <div className="font-cinzel font-bold text-[26px] mt-4 mb-3">NEW USER?</div>
                <a href="https://jalwagame1.link/#/register?invitationCode=4456842257850" target="_blank" rel="noreferrer"
                    className="inline-block bg-[#9cc7da] text-[#0d2a39] px-4.5 py-3 rounded-full font-extrabold text-sm mb-4">
                    Sign Up Jalwa Game
                </a>

                {/* Socials */}
                <div className="flex justify-center gap-4 mt-4">
                    <SocialIcon src="https://i.ibb.co/F4d2P58X/whatsapp.png" link="https://wa.me/+919057617196" />
                    <SocialIcon src="https://i.ibb.co/gFBqK4Vm/telegram.png" link="https://t.me/modapksales" />
                    <SocialIcon src="https://i.ibb.co/fd1vGQwX/youtube.png" link="https://youtu.be/d_MvFufOMRQ" />
                </div>
            </main>

            {/* Subscribe Modal */}
            {showPayModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
                    <div className="bg-[#0f2131] p-6 rounded-2xl w-full max-w-[420px] text-center shadow-2xl border border-white/10">
                        <h2 className="font-cinzel font-bold text-[22px] mb-2 leading-tight">Subscribe To Unlock The Hack</h2>
                        <div className="flex flex-col items-center my-2">
                            {/* 🔴 Strikethrough Old Price */}
                            <span className="text-gray-400 line-through text-lg font-bold opacity-70">₹655</span>

                            {/* 🟢 New Discounted Price */}
                            <div className="text-[34px] font-extrabold text-[#ffdd55] leading-tight">₹450</div>
                        </div>
                        <div className="flex flex-col gap-3 mb-3 mt-4">
                            <button
                                className="w-full bg-[#9cc7da] text-[#0d2a39] py-3 rounded-xl font-bold disabled:opacity-50"
                                onClick={handleUpgrade}
                                disabled={loading}
                            >
                                {loading ? "Initializing..." : "Pay Via UPI"}
                            </button>
                            <button onClick={() => setShowPayModal(false)} className="w-full bg-[#d83434] text-white py-2 rounded-xl text-sm font-bold">Close</button>
                        </div>
                        <p className="text-[#9fb2c6] text-sm">28 Days Validity</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const SocialIcon = ({ src, link }) => (
    <a href={link} target="_blank" rel="noreferrer" className="w-[70px] h-[70px] rounded-full bg-[#0B1220] flex items-center justify-center transition-transform hover:scale-110">
        <img src={src} alt="social" className="w-[38px] h-[38px]" />
    </a>
);

export default SureShotDashboard;