import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 🟢 Single Domain Configuration Helper for API & Keys
const STORAGE_KEY = 'nsspro_user';
const API_BASE_URL = 'http://localhost:5000'; // Make sure to match your backend

// 🟢 Poore 37 Games ki list exact original site se

const DEFAULT_LINK = "https://yaarwin.top/#/register?invitationCode=37578480611";

const gamesList = [
    { id: 5, name: "DmFirst", img: "https://i.ibb.co/qF7HpjDB/shreewin-icon.png", hot: true, link: "https://dmfirst.com/#/register?invitationCode=22718461265" },
    { id: 6, name: "VeerGame", img: "https://i.ibb.co/zTgb6xMS/veer-game-logo.jpg", hot: true, link: "https://www.veergame15.com/#/register?invitationCode=59151336779" },
    { id: 8, name: "ShreeWin", img: "https://i.ibb.co/3yQbhGJ5/shreewin.png", hot: true, link: "https://shreewin111.com/#/register?invitationCode=748385113888" },
    { id: 9, name: "Jai Club", img: "https://i.ibb.co/rGD20qry/Whats-App-Image-2026-08-31-at-21-50-01.jpg", hot: true, link: "https://www.jaiclub33.com/#/register?invitationCode=512117414278" },
    { id: 10, name: "YaarWin", img: "https://i.ibb.co/67ZspJDD/yaarwin.jpg", hot: true, link: "https://yaarwin.top/#/register?invitationCode=37578480611" },
    { id: 11, name: "Raxi Win", img: "https://i.ibb.co/tw08xMxF/raxiwin.jpg", hot: true, link: "https://www.raxiwin.game/#/register?invitationCode=95435387611" },
    { id: 12, name: "91Club", img: "https://i.ibb.co/Mx59q8Sb/91club-New-Logo.png", hot: false, link: DEFAULT_LINK },
    { id: 13, name: "Tiranga", img: "https://i.ibb.co/WWDzmC57/Tiranga-New-Logo.png", hot: false, link: "https://tgdream5.com/#/register?invitationCode=8752724598773" },
    { id: 14, name: "82 Lottery", img: "https://i.ibb.co/7tQvJPsy/82-Lottery.png", hot: false, link: "https://www.dknvru82.com/#/register?invitationCode=666533745649" },
    { id: 7, name: "BDG Game", img: "https://i.ibb.co/67yJC2B0/big-daddy.jpg", hot: false, link: "https://bdgking.com//#/register?invitationCode=3423123305282" },
    { id: 15, name: "BDG WIN", img: "https://i.ibb.co/wNwvKw9G/BDG-WIN.jpg", hot: false, link: "https://bdgwin53.com/#/register?invitationCode=9623116892300" },
    { id: 16, name: "6 Club", img: "https://i.ibb.co/PZ48f28y/6-Club-Logo.png", hot: false, link: DEFAULT_LINK },
    { id: 17, name: "DiuWin", img: "https://i.ibb.co/rfc7mC2y/Diu-Win-Hack-New-Logo.png", hot: false, link: DEFAULT_LINK },
    { id: 18, name: "Bharat Club", img: "https://i.ibb.co/8L2DhSSy/BHT-logo.png", hot: false, link: "https://bhtclub4.com/#/register?invitationCode=562615493882" },
    { id: 19, name: "Raja Games", img: "https://i.ibb.co/WWzm6Qnr/raja-192.png", hot: false, link: "https://www.rajastake4.com/#/register?invitationCode=777125432189" },
    { id: 20, name: "Raja Luck", img: "https://i.ibb.co/Xf6cvxhG/Raja-Luck-Logo.png", hot: false, link: "https://rajaluckgamingg.com/#/register?invitationCode=163431616947" },
    { id: 21, name: "Sikkim", img: "https://i.ibb.co/Wv5PKLZK/SIKKIM-LOGO.webp", hot: false, link: "http://www.13sikkim.com/#/register?invitationCode=887366944167" },
    { id: 29, name: "Jalwa Game", img: "https://i.ibb.co/N6g9gSFC/jalwa-icon.png", hot: true, link: "https://jalwa27.vip/#/register?invitationCode=3213892257851" },
    { id: 30, name: "Dhani Win", img: "https://i.ibb.co/ZpTfTFBF/dhani-win.jpg", hot: false, link: "https://dhani11.com/register?inviteCode=HRG78TN&from=web" },
    { id: 31, name: "DmWin", img: "https://i.ibb.co/SX0tpMyP/dmwin.png", hot: false, link: DEFAULT_LINK },
    { id: 32, name: "Lottery7", img: "https://i.ibb.co/YF22JDpd/lottery7.png", hot: false, link: "https://www.j464lt.com/#/register?invitationCode=167266601273" },
    { id: 22, name: "55 Club", img: "https://i.ibb.co/7tGb31F5/55-club-logo.webp", hot: false, link: "https://www.aqrgik55.com/#/register?invitationCode=152182688038" },
    { id: 23, name: "IN999", img: "https://i.ibb.co/k2K9rWfC/IN999-GAME-LOGO.webp", hot: false, link: DEFAULT_LINK },
    { id: 24, name: "Daman", img: "https://i.ibb.co/zWpqDp4R/Daman-Game-Logo.png", hot: false, link: "https://www.damanclub.asia/#/register?invitationCode=4114617909130" },
    { id: 25, name: "OkWin", img: "https://i.ibb.co/CpqVKrFN/okwin-logo.png", hot: false, link: "https://www.okwinclub66.com/#/register?invitationCode=755836029251" },
    { id: 26, name: "66 Lottery", img: "https://i.ibb.co/d0d0vMzF/66-Lottery-Logo.png", hot: false, link: DEFAULT_LINK },
    { id: 27, name: "Goa Games", img: "https://i.ibb.co/LDkGQ7s3/goa-game.png", hot: false, link: "https://goagame.eu/#/register?invitationCode=3165619292576" },
    { id: 28, name: "Big Mumbai", img: "https://i.ibb.co/GQMSW0sJ/big-mumbai-logo.png", hot: false, link: DEFAULT_LINK },
    { id: 33, name: "KWG Game", img: "https://i.ibb.co/r26Bvrkz/kwg-logo.png", hot: false, link: DEFAULT_LINK },
    { id: 34, name: "51Game", img: "https://i.ibb.co/XrbTtxgf/51-GAME-LOGO.webp", hot: false, link: "https://www.xqtrpv51.com/#/register?invitationCode=325163568721" },
    { id: 35, name: "Maan Win", img: "https://i.ibb.co/MxB4Mwhg/maanwin.webp", hot: true, link: "https://maanwin37.com/register?inviteCode=Y4A9WFN&from=web" },
    { id: 36, name: "Pak Club", img: "https://i.ibb.co/TBX3qDkx/pakclub.webp", hot: false, link: "https://pakclub10.com/register?inviteCode=5CBYQXN&from=web" },
    { id: 37, name: "Pak Games", img: "https://i.ibb.co/TxrpQGh0/pakgames.jpg", hot: false, link: "https://www.pakgame.asia/#/register?invitationCode=339232238153" },
    { id: 38, name: "Basant Club", img: "https://i.ibb.co/Z6GFCT5S/basantclub.jpg", hot: false, link: "https://www.basantclub.bio/#/register?invitationCode=364841497138" },
    { id: 39, name: "9K Club", img: "https://i.ibb.co/Q7PVN1dB/9kclub.png", hot: true, link: DEFAULT_LINK },
    { id: 40, name: "Tashan Win", img: "https://i.ibb.co/tT6VN1N0/tashanwin.jpg", hot: false, link: DEFAULT_LINK },
    { id: 41, name: "Fantasy Game", img: "https://i.ibb.co/VYXWwH4T/Fantasy-Game.webp", hot: true, link: DEFAULT_LINK },
];

const getGameLink = (gameName) => gameLinks[gameName] || DEFAULT_FALLBACK_LINK;
const GamePortal = () => {
    const navigate = useNavigate();

    // State management
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVipModalOpen, setIsVipModalOpen] = useState(false);
    const [payTab, setPayTab] = useState('inr');
    const [isVip, setIsVip] = useState(false);
    const [loadingPayment, setLoadingPayment] = useState(false);

    const [usdtTxn, setUsdtTxn] = useState('');
    const [usdtFile, setUsdtFile] = useState(null);
    const [usdtLoading, setUsdtLoading] = useState(false);

    // Get Logged In User
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY));

    // --- LOGIC: VIP STATUS CHECK ON MOUNT ---
    useEffect(() => {
        const checkVipStatus = async () => {
            if (!user || !user.email) return;

            try {
                const res = await axios.post(`/api/nsspro/check-vip`, {
                    email: user.email
                });
                setIsVip(res.data.isVip);
            } catch (err) {
                console.error("Failed to check VIP status", err);
            }
        };

        checkVipStatus();

        // Polling interval if needed (optional)
        const intervalId = setInterval(checkVipStatus, 30000); // check every 30s
        return () => clearInterval(intervalId);
    }, []);


    // --- LOGIC: LOGOUT ---
    const handleLogout = () => {
        localStorage.removeItem(STORAGE_KEY);
        navigate('/auth');
    };

    // --- LOGIC: HANDLE GAME CLICK ---
    // --- LOGIC: HANDLE GAME CLICK ---
    const handleGameClick = (game) => {
        // Ab chahe VIP ho ya na ho, user seedha game screen par jayega.
        // VIP ka lock humne game screen ke andar already laga diya hai.
        navigate('/game', { state: game });
    };

    // --- LOGIC: INITIATE INR PAYMENT ---
    // --- LOGIC: INITIATE INR PAYMENT ---
    const initiatePayment = async () => {
        setLoadingPayment(true);
        try {
            const res = await axios.post(`/api/nsspro/payment/create`, {
                email: user.email
            });

            // 🟢 CORRECTED: res.data.results.payment_url
            if (res.data && res.data.results && res.data.results.payment_url) {
                // (Optional) Store order ID if you want to track it on this page too
                localStorage.setItem('nsspro_current_order', JSON.stringify({
                    order_id: res.data.results.order_id
                }));
                window.location.href = res.data.results.payment_url;
            } else {
                alert("Payment initiation failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to payment gateway.");
        } finally {
            setLoadingPayment(false);
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
    return (
        <div className="min-h-screen bg-[#020D06] text-[#F0F0F8] font-['Inter',sans-serif] relative overflow-x-hidden">

            {/* Ambient Green Radial Glow Background */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{
                background: `
                    radial-gradient(ellipse 70% 45% at 15% 5%, rgba(0,180,70,.10) 0%, transparent 65%),
                    radial-gradient(ellipse 55% 50% at 85% 85%, rgba(212,160,23,.07) 0%, transparent 65%),
                    radial-gradient(ellipse 40% 30% at 50% 50%, rgba(0,220,90,.04) 0%, transparent 65%)
                `
            }}></div>

            {/* HEADER */}
            {/* HEADER */}
            <header className="sticky top-0 z-[100] flex items-center justify-between px-[16px] h-[60px] bg-[rgba(2,10,4,0.95)] border-b border-[rgba(0,200,81,0.18)] backdrop-blur-[20px]">
                <div className="flex items-center gap-[10px] cursor-pointer" onClick={() => navigate('/portal')}>
                    <img src="https://number.colourhack.sbs/images/logo.png" className="w-[34px] h-[34px] rounded-[10px] object-contain" alt="Logo" />
                    <span className="font-['Rajdhani',sans-serif] font-bold text-[16px] bg-gradient-to-br from-[#00E563] to-[#D4A017] bg-clip-text text-transparent truncate max-w-[160px] tracking-[0.3px]">
                        Number SureShot Pro
                    </span>
                </div>
                
                <div className="relative flex items-center gap-[10px]">
                    
                    {/* 🟢 NEW: VIP Badge (Shows only if user is VIP) */}
                    {isVip && (
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-[rgba(212,160,23,0.15)] border border-[rgba(212,160,23,0.3)] rounded-full shadow-[0_0_10px_rgba(212,160,23,0.2)] animate-[fadeIn_0.3s_ease]">
                            <span className="text-[12px]">💎</span>
                            <span className="font-['Rajdhani',sans-serif] text-[12px] font-bold text-[#F0C040] tracking-[1px] uppercase">VIP</span>
                        </div>
                    )}

                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-[22px] text-[#00C851] w-[40px] h-[40px] flex items-center justify-center rounded-[8px] border border-[rgba(120,60,220,0.25)] bg-[rgba(120,60,220,0.08)]"
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <nav className="absolute top-[52px] right-0 bg-[rgba(3,14,6,0.97)] border border-[rgba(0,200,81,0.18)] rounded-[20px] p-[8px] z-[200] min-w-[200px] backdrop-blur-[20px] shadow-[0_16px_48px_rgba(0,0,0,0.5)] animate-[menuIn_0.2s_ease]">
                            <div className="flex items-center gap-[10px] p-[11px_14px] rounded-[8px] text-[14px] text-[#B0A8C8] pointer-events-none truncate">
                                👤 {user?.name || user?.email?.split('@')[0]}
                            </div>
                            
                            {!isVip && (
                                <button onClick={() => { setIsVipModalOpen(true); setIsMenuOpen(false); }} className="flex items-center gap-[10px] p-[11px_14px] rounded-[8px] text-[14px] text-[#B0A8C8] w-full text-left hover:bg-[rgba(0,200,81,0.08)] hover:text-white transition-all">
                                    <span className="w-[20px] flex justify-center">💎</span> Get VIP Access
                                </button>
                            )}

                            <div className="h-[1px] bg-[rgba(120,60,220,0.15)] my-[6px]"></div>
                            <button onClick={() => window.open('https://t.me/modapksh')} className="flex items-center gap-[10px] p-[11px_14px] rounded-[8px] text-[14px] text-[#B0A8C8] w-full text-left hover:bg-[rgba(0,200,81,0.08)] hover:text-white transition-all">
                                <span className="w-[20px] flex justify-center"><img src="https://number.colourhack.sbs/icons/telegram.svg" width="18" height="18" alt="TG" /></span> Telegram
                            </button>
                            <button onClick={() => window.open('https://wa.me/+919116046055')} className="flex items-center gap-[10px] p-[11px_14px] rounded-[8px] text-[14px] text-[#B0A8C8] w-full text-left hover:bg-[rgba(0,200,81,0.08)] hover:text-white transition-all">
                                <span className="w-[20px] flex justify-center"><img src="https://number.colourhack.sbs/icons/whatsapp.svg" width="18" height="18" alt="WA" /></span> WhatsApp
                            </button>
                            <div className="h-[1px] bg-[rgba(120,60,220,0.15)] my-[6px]"></div>
                            <button onClick={handleLogout} className="flex items-center gap-[10px] p-[11px_14px] rounded-[8px] text-[14px] text-[#B0A8C8] w-full text-left hover:bg-[rgba(0,200,81,0.08)] hover:text-white transition-all">
                                <span className="w-[20px] flex justify-center">🚪</span> Logout
                            </button>
                        </nav>
                    )}
                </div>
            </header>

            {/* MAIN CONTENT */}
            <div className="max-w-[480px] mx-auto p-[20px_16px_100px] relative z-10">

                {/* VIP Activate Bar - Show only if not VIP */}
                {!isVip && (
                    <div className="flex items-center gap-[14px] p-[16px_18px] rounded-[20px] mb-[20px] bg-[rgba(0,180,70,0.07)] border border-[rgba(0,200,81,0.25)] relative overflow-hidden backdrop-blur-[24px]">
                        <div className="text-[28px] shrink-0 z-10">💎</div>
                        <div className="flex-1 min-w-0 z-10">
                            <div className="font-['Rajdhani',sans-serif] text-[16px] font-bold text-[#D4A017]">Activate VIP First</div>
                            <div className="text-[12px] text-[#B0A8C8] mt-[2px]">Unlock predictions for all games</div>
                        </div>
                        <button
                            onClick={() => setIsVipModalOpen(true)}
                            className="bg-gradient-to-br from-[#00C851] to-[#006629] text-white p-[10px_18px] rounded-[8px] font-['Rajdhani',sans-serif] text-[14.4px] font-bold shrink-0 shadow-[0_4px_18px_rgba(0,200,81,0.35)] z-10 active:scale-95"
                        >
                            Activate VIP
                        </button>
                    </div>
                )}

                {/* Heading */}
                <div className="font-['Rajdhani',sans-serif] text-[24px] font-bold text-[#F0F0F8] mb-[20px] tracking-[0.3px]">
                    Choose a <span className="bg-gradient-to-br from-[#00E563] to-[#D4A017] bg-clip-text text-transparent">Game</span>
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-2 gap-[14px] mb-[24px]">
                    {gamesList.map((game, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleGameClick(game)}
                            className="relative flex flex-col items-center gap-[12px] p-[22px_16px] rounded-[20px] bg-[rgba(0,180,70,0.05)] border border-[rgba(0,220,90,0.13)] cursor-pointer transition-all duration-200 hover:-translate-y-[4px] hover:bg-[rgba(0,200,81,0.10)] hover:border-[rgba(0,220,90,0.35)] hover:shadow-[0_8px_32px_rgba(0,200,81,0.22)] overflow-hidden"
                        >
                            {game.hot && (
                                <div className="absolute top-[10px] right-[10px] bg-gradient-to-br from-[#D4A017] to-[#F0C040] text-black text-[9.6px] font-bold p-[3px_8px] rounded-[20px] tracking-[0.5px]">
                                    🔥 HOT
                                </div>
                            )}
                            <div className="w-[72px] h-[72px] rounded-[18px] overflow-hidden bg-gradient-to-br from-[#005A22] to-[rgba(123,53,217,0.4)] border border-[rgba(120,60,220,0.3)] flex items-center justify-center shadow-[0_4px_20px_rgba(0,200,81,0.2)]">
                                <img src={game.img} className="w-full h-full object-cover" alt={game.name} />
                            </div>
                            <div className="text-center">
                                <div className="font-['Rajdhani',sans-serif] text-[16px] font-bold text-[#F0F0F8] tracking-[0.3px]">{game.name}</div>
                                <div className="text-[11.2px] text-[rgba(0,220,90,0.6)]">WinGo · AI Predictions</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Social Links */}
                <div className="flex justify-center gap-[14px] mt-[20px]">
                    <a href="https://t.me/modapksh" target="_blank" rel="noreferrer" className="w-[46px] h-[46px] rounded-[14px] flex items-center justify-center border border-[rgba(120,60,220,0.25)] bg-[rgba(120,60,220,0.08)] hover:scale-110 hover:bg-[rgba(120,60,220,0.2)] transition-all">
                        <img src="https://number.colourhack.sbs/icons/telegram.svg" className="w-[22px] h-[22px]" alt="Telegram" />
                    </a>
                    <a href="https://wa.me/+919116046055" target="_blank" rel="noreferrer" className="w-[46px] h-[46px] rounded-[14px] flex items-center justify-center border border-[rgba(120,60,220,0.25)] bg-[rgba(120,60,220,0.08)] hover:scale-110 hover:bg-[rgba(120,60,220,0.2)] transition-all">
                        <img src="https://number.colourhack.sbs/icons/whatsapp.svg" className="w-[22px] h-[22px]" alt="WhatsApp" />
                    </a>
                </div>
            </div>

            {/* VIP MODAL OVERLAY */}
            {isVipModalOpen && (
                <div
                    className="fixed inset-0 z-[300] bg-[rgba(0,0,0,0.7)] backdrop-blur-[10px] flex items-end justify-center animate-[fadeIn_0.2s_ease]"
                    onClick={(e) => { if (e.target === e.currentTarget) setIsVipModalOpen(false) }}
                >
                    <div className="w-full max-w-[480px] max-h-[92vh] overflow-y-auto rounded-t-[28px] pb-[24px] relative bg-gradient-to-b from-[#031A08] via-[#061408] to-[#0A1A04] border border-b-0 border-[rgba(0,200,81,0.2)] shadow-[0_-16px_60px_rgba(0,0,0,0.6)] animate-[slideUp_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">

                        {/* Drag Handle */}
                        <div className="w-[40px] h-[4px] bg-[rgba(255,255,255,0.2)] rounded-[2px] mx-auto mt-[12px]"></div>

                        <div className="flex items-center justify-between p-[16px_20px_0]">
                            <div className="font-['Rajdhani',sans-serif] text-[19.2px] font-bold text-[#D4A017]">💎 VIP Access</div>
                            <button onClick={() => setIsVipModalOpen(false)} className="w-[32px] h-[32px] rounded-full bg-[rgba(255,255,255,0.08)] text-[#B0A8C8] text-[16px] flex items-center justify-center hover:bg-[rgba(255,59,92,0.2)] hover:text-[#FF3B5C]">✕</button>
                        </div>

                        <div className="px-[20px]">
                            {/* Pay Tabs */}
                            <div className="flex bg-[rgba(0,0,0,0.4)] border border-[rgba(120,60,220,0.15)] rounded-[14px] p-[4px] m-[16px_0_20px] gap-[4px]">
                                <button onClick={() => setPayTab('inr')} className={`flex-1 py-[9px] rounded-[12px] text-[13.6px] font-semibold transition-all ${payTab === 'inr' ? 'text-[#00E563] border-b-2 border-[#00E563] bg-[rgba(0,200,81,0.08)]' : 'text-[#7060A0]'}`}>💳 INR</button>
                                <button onClick={() => setPayTab('usdt')} className={`flex-1 py-[9px] rounded-[12px] text-[13.6px] font-semibold transition-all ${payTab === 'usdt' ? 'text-[#00E563] border-b-2 border-[#00E563] bg-[rgba(0,200,81,0.08)]' : 'text-[#7060A0]'}`}>🔗 USDT</button>
                            </div>

                            {/* INR Pane */}
                            {payTab === 'inr' && (
                                <div className="animate-[fadeIn_0.2s_ease]">
                                    <div className="text-center p-[20px] rounded-[20px] mb-[16px] bg-gradient-to-br from-[rgba(123,53,217,0.15)] to-[rgba(212,160,23,0.1)] border border-[rgba(123,53,217,0.3)]">
                                        <div className="text-[11.5px] text-[#7060A0] uppercase tracking-[0.8px] mb-[6px]">VIP Membership</div>
                                        <div className="font-['Rajdhani',sans-serif] text-[35.2px] font-bold text-[#F0C040]">₹899</div>
                                        <div className="text-[12.5px] text-[#B0A8C8] mt-[4px]">17 days · All games included</div>
                                    </div>
                                    <div className="mb-[20px]">
                                        {['Real-time colour predictions', 'WinGo 30s + 1 Min coverage', '87–91% accuracy AI model', 'Skip-round traffic alerts'].map((text, i) => (
                                            <div key={i} className="flex items-center gap-[10px] p-[8px_0] text-[13.4px] text-[#B0A8C8] border-b border-[rgba(120,60,220,0.08)]">
                                                <span className="text-[#00C851] font-bold">✓</span> {text}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={initiatePayment}
                                        disabled={loadingPayment}
                                        className="w-full p-[15px] bg-gradient-to-br from-[#00C851] to-[#006629] text-white rounded-[8px] font-['Rajdhani',sans-serif] text-[16px] font-bold tracking-[0.5px] shadow-[0_4px_20px_rgba(0,200,81,0.35)] hover:from-[#00E563] hover:to-[#008A35] disabled:opacity-50"
                                    >
                                        {loadingPayment ? "Initiating..." : "⚡ Pay Now with UPI"}
                                    </button>
                                </div>
                            )}

                            {/* USDT Pane */}
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
                @keyframes menuIn { from { opacity: 0; transform: translateY(-8px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(40px); opacity: 0.7; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
};

export default GamePortal;