import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const NeonDashboard = () => {
    const [isVip, setIsVip] = useState(false);
    const [roundId, setRoundId] = useState("");
    const [showResultModal, setShowResultModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [loading, setLoading] = useState(false); // 🟢 Added loading state for payment
    const [prediction, setPrediction] = useState({ number: 0, size: 'SMALL', color: 'RED' });

    const mapping = {
        0: ['SMALL', 'RED'], 1: ['SMALL', 'GREEN'], 2: ['SMALL', 'RED'], 3: ['SMALL', 'GREEN'], 4: ['SMALL', 'RED'],
        5: ['BIG', 'GREEN'], 6: ['BIG', 'RED'], 7: ['BIG', 'GREEN'], 8: ['BIG', 'RED'], 9: ['BIG', 'GREEN']
    };

    // 🟢 1. Initial Check: Is user VIP? (Called on Dashboard Mount)
    useEffect(() => {
        const checkInitialVip = async () => {
            const neonUser = JSON.parse(localStorage.getItem('neon_user'));
            if (!neonUser || !neonUser.email) return;

            try {
                const res = await axios.post('/api/neon/check-vip', { email: neonUser.email });
                if (res.data.isVip) {
                    setIsVip(true);
                }
            } catch (err) {
                console.error("Initial VIP check failed", err);
            }
        };
        checkInitialVip();
    }, []);

    // 🟢 2. Payment Tracking: Check Status after redirect
    useEffect(() => {
        const neonUser = JSON.parse(localStorage.getItem('neon_user'));
        const pendingOrderId = localStorage.getItem('neon_pending_order_id');

        if (pendingOrderId && !isVip && neonUser) {
            const verifyPayment = async () => {
                try {
                    const res = await axios.post('/api/neon/payment/status', {
                        order_id: pendingOrderId,
                        email: neonUser.email
                    });

                    if (res.data.status === "Success") {
                        setIsVip(true);
                        // Update session
                        localStorage.setItem('neon_user', JSON.stringify(res.data.user));
                        localStorage.removeItem('neon_pending_order_id');
                        alert("💎 Neon Premium Activated for 28 Days!");
                    }
                } catch (err) {
                    console.error("Verification failed", err);
                }
            };
            verifyPayment();
        }
    }, [isVip]);

    // 🟢 3. Create Order Logic (₹650)
    const handleUpgrade = async () => {
        const neonUser = JSON.parse(localStorage.getItem('neon_user'));
        if (!neonUser) return alert("Please login again");

        setLoading(true);
        try {
            const res = await axios.post('/api/neon/payment/create', {
                email: neonUser.email
            });

            if (res.data.status === true) {
                localStorage.setItem('neon_pending_order_id', res.data.results.order_id);
                // Redirect user to payment page
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


    const handleStart = () => {
        if (!isVip) {
            setShowPayModal(true);
            return;
        }

        if (roundId.length !== 17) {
            alert('Please enter complete 17 digit Round ID.');
            return;
        }

        // 🟢 Generate Prediction
        const r = Math.floor(Math.random() * 10);
        const pair = mapping[r];
        setPrediction({ number: r, size: pair[0], color: pair[1] });
        setShowResultModal(true);
    };

    return (
        <div className="min-h-screen bg-[#071212] text-[#35e07a] font-sans">
            {/* 🟢 Header / Logo Section */}
            <header className="flex flex-col items-center py-6 relative">
                <img src="https://colourtradingprediction.com/logo.png" alt="logo" className="w-27.5 h-27.5 object-contain" />
                <div className="absolute right-4 top-4">
                    <button
                        onClick={() => { localStorage.removeItem('neon_user'); window.location.href = '/neon/signup'; }}
                        className="text-[#35e07a] bg-transparent border-none text-sm cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* 🟢 VIP Status Banner */}
            <div className={`max-w-180 mx-auto py-2 px-4 rounded-lg text-center font-bold mb-4 ${isVip ? 'bg-[#225530]/10 border border-[#39d785]/10 text-[#bff7d8]' : 'bg-[#552222]/10 border border-[#ff6b6b]/10 text-[#ffbebe]'}`}>
                {isVip ? '🔓 Premium Active — Enjoy Predictions' : '🔒 Not Premium — Buy Premium to unlock predictions'}
            </div>

            <main className="max-w-180 mx-auto px-4 text-center">
                <h1 className="text-[34px] leading-tight tracking-[2px] font-bold mb-6">
                    COLOUR TRADING<br />PREDICTOR
                </h1>

                {/* 🟢 Round ID Input */}
                <div className="mb-2">
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="ROUND ID"
                        value={roundId}
                        onChange={(e) => setRoundId(e.target.value.replace(/\D/g, '').slice(0, 17))}
                        className="w-full bg-transparent border-2 border-[#35e07a] rounded-lg py-3 px-4 text-lg text-[#35e07a] placeholder:text-[#35e07a]/50 outline-none text-center"
                    />
                </div>
                <p className="text-xs tracking-widest mb-4 text-[#35e07a]/80">ENTER COMPLETE ROUND ID</p>

                {/* 🟢 Start Button */}
                <button
                    onClick={handleStart}
                    className="border-2 border-[#35e07a] bg-transparent text-[#35e07a] px-8 py-3 rounded-xl text-lg font-bold hover:bg-[#35e07a]/10 transition-colors"
                >
                    START
                </button>

                <div className="block mt-6">
                    {isVip ? (
                        /* 🟢 Shown when VIP is TRUE */
                        <div className="flex items-center justify-center gap-2 text-[#35e07a] font-bold drop-shadow-[0_0_8px_rgba(53,224,122,0.6)]">
                            💎 <span className="animate-pulse">You're Premium User</span> 💎
                        </div>
                    ) : (
                        /* 🔴 Shown when VIP is FALSE */
                        <span className="animate-[neonPulse_2s_infinite] inline-block py-2 px-4 border border-[#35e07a]/30 rounded-lg text-sm">
                            🔒 Buy Premium To Start 🔒
                        </span>
                    )}
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-6 mt-8">
                    <SocialBtn src="https://colourtradinghack.com/icons/whatsapp.png" link="https://wa.me/+91" />
                    <SocialBtn src="https://colourtradinghack.com/icons/youtube.png" link="https://www.youtube.com/watch?v=-HdcugtTRN4" />
                    <SocialBtn src="https://colourtradinghack.com/icons/telegram.png" link="https://t.me/modapksales" />
                </div>
            </main>

            {/* 🟢 PAYMENT MODAL */}
            {showPayModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-[#050c10] border-2 border-[#35e07a] rounded-2xl p-6 w-full max-w-105 text-center relative">
                        <button onClick={() => setShowPayModal(false)} className="absolute right-4 cursor-pointer top-2 text-2xl text-[#35e07a]">&times;</button>

                        <h3 className="text-2xl font-bold mb-2">Pay 650 For Premium</h3>
                        <p className="text-sm opacity-80 mb-6">Pay with any UPI app</p>

                        <button
                            className="animate-[qrPulse_1.8s_infinite] border-[3px] border-[#35e07a] text-[#35e07a] py-3 px-6 rounded-xl font-bold mb-6 disabled:opacity-50"
                            onClick={handleUpgrade}
                            disabled={loading}
                        >
                            {loading ? "Creating Order..." : "Pay on QR Code"}
                        </button>


                        <div className="space-y-2 text-left max-w-55 mx-auto mb-6">
                            <p>✅ Unlimited Earning</p>
                            <p>✅ Number SureShot</p>
                            <p>✅ Big-Small Prediction</p>
                            <p>✅ 28 Days Validity</p>
                        </div>

                        <button onClick={() => setShowPayModal(false)} className="text-[#ff4b4b] border-2 border-[#ff4b4b] py-2 px-6 rounded-lg font-bold">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* 🟢 RESULT MODAL */}
            {showResultModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#050c10] border-2 border-[#35e07a] rounded-2xl p-8 w-full max-w-105 text-center relative">
                        <button onClick={() => setShowResultModal(false)} className="absolute right-4 top-2 text-2xl text-[#35e07a]">&times;</button>

                        <div className="text-[100px] font-bold leading-none mb-4">{prediction.number}</div>
                        <div className="flex justify-center gap-6 text-xl font-bold tracking-widest">
                            <span>{prediction.size}</span>
                            <span style={{ color: prediction.color === 'GREEN' ? '#35e07a' : '#ff4b4b' }}>{prediction.color}</span>
                        </div>

                        <button onClick={() => setShowResultModal(false)} className="mt-8 border-2 border-[#35e07a] py-2 px-8 rounded-lg font-bold">
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* Global Animations */}
            <style jsx>{`
                @keyframes neonPulse {
                    0%, 100% { filter: drop-shadow(0 0 6px rgba(53,224,122,0.8)); transform: translateY(0); }
                    50% { filter: drop-shadow(0 0 16px rgba(53,224,122,0.9)); transform: translateY(-2px); }
                }
                @keyframes qrPulse {
                    0%, 100% { box-shadow: 0 0 8px rgba(53,224,122,0.1); transform: scale(1); }
                    50% { box-shadow: 0 0 28px rgba(53,224,122,0.3); transform: scale(1.03); }
                }
            `}</style>
        </div>
    );
};

const SocialBtn = ({ src, link }) => (
    <a href={link} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
        <img src={src} className="w-10 h-10 object-contain" alt="social" />
    </a>
);

export default NeonDashboard;