import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';

const Dashboard = () => {
    const [isVip, setIsVip] = useState(false); // Toggle this to test both states
    const [sequence, setSequence] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [showPayBox, setShowPayBox] = useState(false);
    const [result, setResult] = useState('')
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.isVip) {
            setIsVip(true);
        }
    }, []);

    useEffect(() => {
    // 1. Get User from LocalStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) setIsVip(userData.isVip);

    // 2. Check URL for Order ID (AllApi appends this on redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');

    if (orderId) {
        const verifyPayment = async () => {
            try {
                const res = await axios.post('/api/payment/status', { order_id: orderId });
                
                if (res.data.success) {
                    setIsVip(true);
                    // Update LocalStorage so VIP stays after refresh
                    localStorage.setItem('user', JSON.stringify({ ...userData, isVip: true }));
                    alert("💎 VIP Activated Successfully!");
                }
            } catch (err) {
                console.error("Verification failed", err);
            }
        };
        verifyPayment();
    }
}, []);


    const handleAnalyze = () => {
        // 1. Silent Check: Do nothing if empty
        if (!sequence.trim()) return;

        // 2. VIP Check
        if (!isVip) {
            setShowPayBox(true);
            return;
        }

        // 3. Logic to count "times" correctly
        // Regex matches all digits 0-9 in the sequence
        const digits = sequence.match(/\d/g) || [];
        const counts = Array(10).fill(0);
        digits.forEach(d => {
            if (d >= 0 && d <= 9) counts[d]++;
        });

        const maxCount = Math.max(...counts);
        const minCount = Math.min(...counts);

        // 4. Create accurate stats array
        const newStats = counts.map((count, num) => ({
            num,
            count,
            // Only mark as hot/cold if they actually appeared, or if it's the extreme
            status: count === maxCount && count > 0 ? 'hot' : (count === minCount ? 'cold' : 'hot')
        }));

        // 5. Generate a new random final guess
        const randomNum = Math.floor(Math.random() * 10);

        setResult(randomNum);
        setStats(newStats);
        setShowResults(true);
    };

    const handleUpgrade = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return alert("Please login again");

    try {
        const res = await axios.post('http://localhost:5000/api/payment/create', {
            phone: user.phone,
            amount: 199 // Example price
        });

        if (res.data.status === true) {
            // Redirect user to the secure payment page (UPI, QR, etc.)
            window.location.href = res.data.results.payment_url;
        } else {
            alert("Payment error: " + res.data.message);
        }
    } catch (err) {
        console.error("Payment failed", err);
    }
};

    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center pt-3 font-sans text-white">
            <div className="w-[95%] max-w-180 bg-[#020617] rounded-[18px] py-6 px-3 shadow-2xl border border-slate-900 text-center relative">

                <h2 className="text-2xl font-bold mb-2 mt-2">Number Pattern Hack</h2>
                <p className="text-[13px] text-slate-400 mb-2">
                    Enter digits 0–9 separated by comma or space. This tool shows frequency and gives a real pattern suggestion.
                </p>

                {/* Textarea Input */}
                <textarea
                    placeholder="Example: 0,2,6,5,5,0,5,8,0,3"
                    value={sequence}
                    onChange={(e) => setSequence(e.target.value)}
                    className="w-full h-26 bg-[#020617] border border-slate-800 rounded-xl p-2 px-3 text-white focus:outline-none focus:border-sky-500"
                />

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center mt-3">
                    <button
                        onClick={handleAnalyze}
                        className="bg-linear-to-r from-[#38bdf8] to-[#6366f1] px-5.5 text-[15px] font-semibold py-2 rounded-full  active:scale-95 transition-transform"
                    >
                        Analyze & Guess
                    </button>
                    <button
                        onClick={() => { setSequence(""); setShowResults(false); }}
                        className="bg-[#020617] border border-slate-700 px-8 py-2 rounded-full text-[15px] font-semibold text-slate-300"
                    >
                        Clear
                    </button>
                </div>

                {/* VIP Status Indicator (image_e4051e.png / image_e40141.png) */}
                <div className={`mt-2 font-bold flex items-center justify-center gap-2 ${isVip ? 'text-sky-400 animate-pulse' : 'text-red-500 animate-pulse'}`}>
                    {isVip ? '💎 You\'re A VIP User 💎' : '❌ You\'re Not VIP User ❌'}
                </div>

                {/* Results Section - Only shows if VIP and Analyzed */}
                {isVip && showResults && (
                    <div className="mt-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-lg font-bold mb-4">Digit Frequency</h3>
                        <div className="grid grid-cols-5 gap-2 mt-4">
                            {stats.map((item) => (
                                <div key={item.num} className="bg-[#020617] border border-slate-800 rounded-xl p-2.5 text-center">
                                    <b className="text-lg text-white">{item.num}</b><br />
                                    <span className="text-[11px] text-white">{item.count} times</span>
                                    {item.status && (
                                        <div className={`text-[10px] font-bold uppercase mt-1 ${item.status === 'hot' ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {item.status}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <div className="text-slate-400 text-xs tracking-widest uppercase">Final Guess</div>
                            <div className="text-6xl  mt-2">{result}</div>
                        </div>
                    </div>
                )}

                {/* Bottom Navigation */}
                <div className="mt-2">
                    <button className="border border-sky-500 text-sky-400 py-2 px-5 rounded-full font-bold hover:bg-sky-500/10 transition-colors">
                        Sign Up Jalwa Game
                    </button>
                    <div className="flex justify-center gap-6 mt-6">
                        <SocialIcon src="https://colourtradinghack.com/icons/whatsapp.png" />
                        <SocialIcon src="https://colourtradinghack.com/icons/youtube.png" />
                        <SocialIcon src="https://colourtradinghack.com/icons/telegram.png" />
                    </div>
                </div>
            </div>

            {/* PAYMENT POPUP (Matches image_e404a5.png) */}
            {showPayBox && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#020617] w-[90%] max-w-85 rounded-2xl p-5  text-center">
                        <h3 className="text-lg font-bold mb-6">PAY ₹950 TO START</h3>

                        <button className="bg-linear-to-r from-[#38bdf8] to-[#6366f1] text-white font-bold py-2 px-5.5 rounded-full " onClick={handleUpgrade}>
                            Pay On QR Code
                        </button>

                        <div className="my-4 space-y-2 text-center inline-block w-full">
                            <p className="text-xs font-medium leading-[12.2px]">✅ Advanced Pattern Mode</p>
                            <p className="text-xs font-medium leading-[12.2px]">✅ 14 Days VIP Access</p>
                            <p className="text-xs font-medium leading-[12.2px]">✅ Big-Small Analyzer</p>
                            <p className="text-xs font-medium leading-[12.2px]">✅ 2-Level Insights</p>
                        </div>

                        <button
                            onClick={() => setShowPayBox(false)}
                            className=" bg-white text-black font-bold py-2 px-5.5 rounded-full"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const SocialIcon = ({ src }) => (
    <img src={src} alt="social" className="w-10 h-10 cursor-pointer hover:scale-110 transition-transform" />
);

export default Dashboard;