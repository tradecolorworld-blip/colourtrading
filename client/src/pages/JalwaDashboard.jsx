import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const JalwaDashboard = () => {
    const [isVip, setIsVip] = useState(false);
    const [lines, setLines] = useState(["Waiting For Command"]);
    const [result, setResult] = useState(null);
    const [cooldown, setCooldown] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const simRef = useRef(null);
    const [loading, setLoading] = useState(false); // 🟢 Added loading state for payment

    // Auto-scroll terminal logic
    useEffect(() => {
        if (simRef.current) {
            simRef.current.scrollTop = simRef.current.scrollHeight;
        }
    }, [lines, result]);


    // 🟢 1. Initial Check: Is user VIP? (Called on Dashboard Mount)
    useEffect(() => {
        const checkInitialVip = async () => {
            const jalwaUser = JSON.parse(localStorage.getItem('Jalwa_user'));
            if (!jalwaUser || !jalwaUser.email) return;

            try {
                const res = await axios.post('/api/jalwa/check-vip', { email: jalwaUser.email });
                if (res.data.isVip) {
                    setIsVip(true);
                }
            } catch (err) {
                console.error("Jalwa VIP check failed", err);
            }
        };
        checkInitialVip();
    }, []);

    // 🟢 2. Payment Tracking: Check Status after redirect
    useEffect(() => {
        const jalwaUser = JSON.parse(localStorage.getItem('Jalwa_user'));
        const pendingOrderId = localStorage.getItem('jalwa_pending_order_id');

        if (pendingOrderId && !isVip && jalwaUser) {
            const verifyPayment = async () => {
                try {
                    const res = await axios.post('/api/jalwa/payment/status', {
                        order_id: pendingOrderId,
                        email: jalwaUser.email
                    });

                    if (res.data.status === "Success") {
                        setIsVip(true);
                        // Update session with new VIP data from backend
                        localStorage.setItem('Jalwa_user', JSON.stringify(res.data.user));
                        localStorage.removeItem('jalwa_pending_order_id');
                        alert("💎 Jalwa Premium Activated for 28 Days!");
                    }
                } catch (err) {
                    console.error("Jalwa verification failed", err);
                }
            };
            verifyPayment();
        }
    }, [isVip]);

    // 🟢 3. Create Order Logic (₹899)
    const handleUpgrade = async () => {
        const jalwaUser = JSON.parse(localStorage.getItem('Jalwa_user'));
        if (!jalwaUser) return alert("Please login again");

        setLoading(true);
        try {
            const res = await axios.post('/api/jalwa/payment/create', {
                email: jalwaUser.email
            });

            if (res.data.status === true) {
                localStorage.setItem('jalwa_pending_order_id', res.data.results.order_id);
                // Redirect user to payment gateway
                window.location.href = res.data.results.payment_url;
            } else {
                alert("Payment error: " + res.data.message);
                setLoading(false);
            }
        } catch (err) {
            console.error("Jalwa payment creation failed", err);
            setLoading(false);
        }
    };

    // Timer logic for the 15s cooldown
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (cooldown === 0 && lines.length > 1) {
            setLines(["Waiting For Command"]);
            setResult(null);
        }
    }, [cooldown]);

    const startSimulation = () => {
        if (!isVip) {
            setShowModal(true);
            return;
        }

        setLines([]);
        setResult(null);
        const sequence = [
            "starting...",
            "user_create successfully",
            "connecting to- WinGo_30S",
            "permission_granted",
            "injecting_script- task_success",
            "waiting_for_results",
            "results_found"
        ];

        sequence.forEach((line, index) => {
            setTimeout(() => {
                setLines(prev => [...prev, line]);
                if (index === sequence.length - 1) {
                    const failChance = Math.random() < 0.3;
                    if (failChance) {
                        setResult({ text: "Server Down Please Try Again", color: "#f44336" });
                    } else {
                        const num = Math.floor(Math.random() * 10);
                        setResult({ text: `(${num})`, color: "#fff" });
                    }
                    setCooldown(15);
                }
            }, (index + 1) * 800);
        });
    };

    return (
        /* Black background as seen in image_03d11d.png */
        <div className="min-h-screen bg-black font-inter text-white overflow-x-hidden relative">

            {/* Minimalist Topbar */}
            <header className="flex justify-between items-center px-5 py-3 bg-[#050505] border-b border-white/5">
                <div className="text-[22px] font-extrabold tracking-tight">
                    <span className="text-[#35a8e0]">Jalwa</span>.Game
                </div>
                <button
                    onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }}
                    className="bg-[#c83535] text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg flex items-center gap-1.5"
                >
                    Logout ⟲
                </button>
            </header>

            <main className="flex flex-col items-center justify-center pt-12 px-4">

                {/* Red CTA Link */}
                <a
                    href="https://jalwagame1.link/#/register?invitationCode=4456842257850"
                    target="_blank" rel="noreferrer"
                    className="bg-[#c83535] text-white px-8 py-3 rounded-full font-black text-sm tracking-wide mb-8 shadow-xl active:scale-95 transition-transform"
                >
                    Jalwa Game Sign Up
                </a>

                {/* The Neon Green Simulator Box */}
                <div
                    ref={simRef}
                    className="w-full max-w-[420px] bg-black border-[3px] border-[#39ff14] rounded-[18px] p-5 h-[240px] overflow-y-auto text-left font-mono shadow-[0_0_20px_rgba(57,255,20,0.4)]"
                >
                    {lines.map((line, i) => (
                        <div key={i} className="text-[#39ff14] text-[15px] font-bold mb-2 tracking-tight">
                            {line}
                        </div>
                    ))}
                    {result && (
                        <div
                            className="text-4xl font-black text-center mt-4 bg-white/5 py-2 rounded-xl"
                            style={{ color: result.color }}
                        >
                            {result.text}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <button
                    onClick={startSimulation}
                    disabled={cooldown > 0}
                    className="bg-[#c83535] text-white px-10 py-3.5 mt-8 rounded-full font-black text-xl tracking-tight shadow-2xl active:scale-95 transition-all disabled:opacity-50"
                >
                    {cooldown > 0 ? `Wait ${cooldown}s` : 'START NOW'}
                </button>

                {/* VIP Status Badge */}
                <div className="bg-[#f05435] text-white font-black text-sm py-2 px-5 mt-4 rounded-lg tracking-widest uppercase">
                    {isVip ? "YOU'RE VIP USER" : "YOU'RE NOT VIP"}
                </div>

                {/* Pill-shaped Social Links */}
                <div className="flex gap-3 mt-10 mb-20">
                    <SocialBtn color="#4cd964" label="WHATSAPP" link="https://wa.me/919116046055" />
                    <SocialBtn color="#ff3b30" label="YOUTUBE" link="https://youtube.com" />
                    <SocialBtn color="#007aff" label="TELEGRAM" link="https://t.me/betbhai9king" />
                </div>
            </main>

            {/* Payment Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-4 backdrop-blur-md">
                    <div className="bg-[#111] w-full max-w-[340px] p-6 rounded-2xl text-center border border-white/10">
                        <h3 className="font-bold text-xl mb-2 text-white">Purchase Premium Access</h3>
                        <div className="flex flex-col items-center mb-6">
                            {/* 🔴 Cut/Strikethrough Old Price */}
                            <span className="text-gray-500 line-through text-xl font-bold">₹899</span>

                            {/* 🟢 New Discounted Price */}
                            <p className="text-[#39ff14] font-black text-4xl mt-1">₹499</p>
                        </div>
                        <button className="bg-[#c83535] text-white w-full py-3.5 rounded-xl font-black mb-3 text-lg"
                            onClick={handleUpgrade}
                            disabled={loading}
                        >
                            {loading ? "Initializing..." : "Pay with UPI"}
                        </button>
                        <button className="text-white/40 text-sm font-bold" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const SocialBtn = ({ color, label, link }) => (
    <a
        href={link}
        target="_blank" rel="noreferrer"
        className="px-5 py-2.5 rounded-full text-white font-black text-[12px] shadow-lg transition-transform hover:scale-105"
        style={{ backgroundColor: color }}
    >
        {label}
    </a>
);

export default JalwaDashboard;
