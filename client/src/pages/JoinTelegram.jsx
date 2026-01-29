import React from 'react';
import ss from './../assets/ss.png'

const JoinTelegram = () => {
    // 🟢 Tracking Function for Analytics
    const handleTelegramClick = () => {
        if (window.fbq) {
            window.fbq('track', 'Lead', {
                content_name: 'Telegram Join',
                content_category: 'Mod Apk'
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#0e172a] text-white flex flex-col items-center p-4 font-sans">
            <div className="w-full max-w-[400px] bg-[#020617]/60 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center shadow-2xl overflow-hidden">

                {/* Profile Logo */}
                <div className="w-24 h-24 rounded-full border-4 border-[#38bdf8] p-1 mb-6 shadow-lg shadow-[#38bdf8]/20">
                    <img
                        src="https://colourtradinghack.com/icons/logo.png"
                        alt="Logo"
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>

                <h1 className="text-3xl font-bold mb-2 text-center">Mod Apk Seller</h1>
                <p className="text-[#94a3b8] text-sm text-center mb-10 leading-relaxed">
                    👇 मोड ऐप लेने के लिए अभी टेलीग्राम जॉइन करें 👇
                </p>

                {/* 🟢 FIXED RIPPLE + PULSE BUTTON */}
                {/* 🟢 SHORTENED RIPPLE BUTTON */}
                <div className="relative w-full mb-10 flex justify-center items-center">
                    {/* 🟢 Now uses our custom 'short' animation */}
                    <div className="absolute inset-0 rounded-full bg-red-500/30 animate-short-ripple"></div>

                    <a
                        href="https://t.me/modapksh"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleTelegramClick}
                        className="relative w-full block bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white font-extrabold py-4 rounded-full text-lg shadow-xl shadow-red-600/40 active:scale-95 transition-transform text-center animate-pulse z-10"
                    >
                        JOIN TELEGRAM NOW ↗
                    </a>
                </div>

                {/* Available Mod Section */}
                <div className="w-full border-t border-white/10 pt-8 text-left">
                    <p className="text-[#94a3b8] text-xs uppercase tracking-widest font-semibold mb-2">
                        Available Mod Apk
                    </p>
                    <p className="text-[#10b981] text-xl font-bold mb-4">
                        Jalwa
                    </p>

                    {/* 🟢 Container adjusted for dynamic height */}
                    <div className="w-full min-h-[200px] rounded-2xl border border-white/10 bg-black/40 flex justify-center items-center overflow-visible">
                        <img
                            src={ss}
                            alt="Jalwa Mod Hack"
                            // 🟢 'w-full h-auto' keeps original proportions
                            // 🟢 'object-contain' ensures the whole image fits without cropping
                            className="w-full h-auto min-h-[200px] object-contain brightness-90 rounded-2xl shadow-lg"
                        />
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <h2 className="text-[#10b981] text-3xl font-black mb-2 uppercase italic tracking-tighter">100% WORKING</h2>
                    <p className="text-[#64748b] text-[11px] px-4 leading-relaxed">
                        All hacks are paid & working. No guarantees are implied; use responsibly.
                    </p>
                </div>

                {/* <div className="mt-8 text-[10px] text-[#475569]">
            © 2026 dtbosshub.com. All rights reserved.
        </div> */}
            </div>
        </div>
    );
};

export default JoinTelegram;