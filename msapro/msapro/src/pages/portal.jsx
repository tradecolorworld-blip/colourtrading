import React, { useState, useEffect } from 'react';
import { Star, Flame, Send, CheckCircle, Download, Headset, Gift, Rocket, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import logo1 from '../assets/logo1.png';
import logo2 from '../assets/logo2.png';
import logo3 from '../assets/logo3.png';
import logo4 from '../assets/logo4.png';
import logo5 from '../assets/logo5.png';
import logo6 from '../assets/logo6.png';
import logo7 from '../assets/logo7.png';
import logo8 from '../assets/logo8.png';
import logo9 from '../assets/logo9.png';
import logo12 from '../assets/logo12.webp';
import logo13 from '../assets/logo13.webp';
import logo14 from '../assets/logo14.png';
import logo15 from '../assets/logo15.png';
import logo16 from '../assets/logo16.png';
import logo17 from '../assets/logo17.png';

import { useNavigate } from 'react-router-dom';

// 🟢 NEW: Domain Configuration Helper (Must match App.jsx and Auth.jsx)
const getDomainConfig = () => {
    const host = window.location.hostname;
    if (host.includes('sureshotpro.sbs')) {
        return {
            variant: 'msa1',
            storageKey: 'MSA1PRO_user',
            whatsapp: '919116046055',
            telegram: 'modapksh',
            youtube: 'https://youtu.be/qQAtpOn-tFw',
            rajaLink: "https://rajagames91.xyz/#/register?invitationCode=155064101080"
        };
    }
    if (host.includes('sureshothack.pro')) {
        return {
            variant: 'msa2',
            storageKey: 'MSA2PRO_user',
            whatsapp: '918239817438',
            telegram: 'modapksales',
            youtube: 'https://youtu.be/qQAtpOn-tFw',
            rajaLink: "https://rajagames111.com/#/register?invitationCode=643349101079"
        };
    }
    if (host.includes('sureshotypro.xyz')) {
        return {
            variant: 'msa3',
            storageKey: 'MSA3PRO_user',
            whatsapp: '917357984291',
            telegram: 'hackerbabaji1',
            youtube: 'https://youtu.be/qQAtpOn-tFw',
            rajaLink: "https://rajagames100.com/#/register?invitationCode=815360101080"
        };
    }
    return { variant: 'test', storageKey: 'MSA_test_user', whatsapp: '919116046055', telegram: 'modapksh', youtube: '', rajaLink: 'https://rajagames91.xyz/#/register?invitationCode=155064101080' };
};

const GamePortal = () => {
    const [onlineUsers, setOnlineUsers] = useState(8245);
    const navigate = useNavigate();

    // Get current domain details
    const { variant, storageKey, whatsapp, telegram, rajaLink } = getDomainConfig();

    // --- LOGIC: RANDOM USER COUNTER ---
    useEffect(() => {
        const updateUsers = () => {
            // Logic: Math.floor(Math.random() * 2501) + 7500 (Matches your HTML)
            const randomUsers = Math.floor(Math.random() * 2501) + 7500;
            setOnlineUsers(randomUsers);
        };

        const interval = setInterval(updateUsers, 5000);
        return () => clearInterval(interval);
    }, []);

    // --- LOGIC: REDIRECT ---
    const redirectToGame = (gameName, gameLogo, gameLink) => {
        navigate('/game', {
            state: { name: gameName, logo: gameLogo, link: gameLink }
        });
    };

    const handleLogout = () => {
        // 🟢 FIXED: Now removes the dynamic key (MSA1_user, etc.)
        localStorage.removeItem(storageKey);
        // 🟢 FIXED: Navigates to correct clean route
        navigate('/auth');
    };


    // --- DATA: GAME LIST ---
    const games = [
        { name: "RajaLottery", logo: logo8, link: rajaLink, hot: true },
        { name: "91Club", logo: logo1, link: "https://www.ehIndia.com/#/register?invitationCode=87134963862", hot: true },
        { name: "55Club", logo: logo2, link: "https://55clubofficial.xyz/#/register?invitationCode=434633101080", hot: true },
        { name: "In999", logo: logo3, link: "https://www.ilxd28.com/#/register?invitationCode=167266601273", hot: true },
        { name: "DamanGames", logo: logo4, link: "https://damanvipgame.com/register?invitationCode=4879717468242", hot: true },
        { name: "BDG Game", logo: logo5, link: "https://bdg-ipl.vip//#/register?invitationCode=7868719070147", hot: true },

        { name: "Jalwa Game", logo: logo13, link: "https://jalwaclub3.com/#/register?invitationCode=84518166493", hot: true },
        { name: "Bharat Club", logo: logo15, link: "https://bhtclub3.com/#/register?invitationCode=562615493882", hot: true },
        { name: "51Game", logo: logo12, link: "https://www.51gameo.com/#/register?invitationCode=325163568721", hot: true },
        { name: "82Lottery", logo: logo16, link: "https://www.82winoo.com/#/register?invitationCode=666533745649", hot: true },
        { name: "66Lottery", logo: logo17, link: "https://www.66lottery.vip/#/pages/login/register?invitationCode=5218250409", hot: true },
        { name: "DiuWin", logo: logo14, link: " https://www.5diuwin.com/#/register?invitationCode=7626511684473", hot: true },
        
        { name: "Tiranga", logo: logo6, link: "https://tgdream.pro/#/register?invitationCode=8752724598773", hot: false },
        { name: "BDG Win", logo: logo7, link: " https://bdgwina.top//#/register?invitationCode=4138512408865", hot: false },
        { name: "OK Win", logo: logo9, link: "https://okwinslots4.com/#/register?invitationCode=755836029251", hot: false },
        { name: "RajaLuck", logo: logo8, link: "https://rajaluckvip.com/register?invitationCode=3060605020010", hot: false },
    ];

    return (
        <div className="min-h-screen bg-[#171222] text-[#1E293B] font-['Poppins'] p-[15px] relative overflow-x-hidden selection:bg-indigo-100">

            {/* 1. SAFE TAG (Floating Motion) */}
            <div className="fixed top-[15px] left-0 right-0 px-[15px] flex justify-between items-center z-[1000]">
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white font-bold text-[11px] px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-white/20"
                >
                    100% Safe
                </motion.div>

                <button
                    onClick={handleLogout}
                    className="bg-white border border-red-100 text-red-500 px-3 py-1.5 rounded-xl shadow-sm font-bold text-[11px] flex items-center gap-2 hover:bg-red-50 transition-all uppercase tracking-wider"
                >
                    <LogOut size={14} /> Logout
                </button>
            </div>

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[10%] left-[-5%] w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[10%] right-[-5%] w-64 h-64 bg-pink-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-[500px] mx-auto pt-10">

                {/* 2. TOP BAR */}
                <div className="flex justify-between items-center gap-3 mb-6">
                    {/* Online Users Box */}
                    <div className=" bg-white border border-[#E2E8F0] px-4 py-2.5 rounded-[15px] text-[13px] font-semibold text-[#475569] flex items-center gap-2 shadow-sm transition-all duration-300 hover:border-[#6366F1] hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] cursor-default">
                        <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse"></span>
                        Online Users: <span className="text-black font-bold">{onlineUsers.toLocaleString()}</span>
                    </div>

                    {/* Server Status Box */}
                    <div className=" bg-white border border-[#E2E8F0] px-4 py-2.5 rounded-[15px] text-[13px] font-semibold text-[#475569] flex items-center gap-2 shadow-sm transition-all duration-300 hover:border-[#6366F1] hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] cursor-default">
                        <CheckCircle size={14} className="text-[#6366F1]" />
                        Server: <span className="text-black font-bold">Active</span>
                    </div>
                </div>

                {/* 3. JOIN TELEGRAM BUTTON */}
                <button
                    onClick={() => window.open(`https://t.me/${telegram}`, '_blank')}
                    className="w-[90%] max-w-[300px] mx-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white py-3.5 rounded-xl font-bold shadow-md hover:-translate-y-1 active:scale-95 transition-all mb-6"
                >
                    <i className="fab fa-telegram text-xl"></i>
                    Join Telegram
                </button>

                {/* 4. NOTIFICATION BANNER (Marquee Motion) */}
                <div className="w-full bg-white border border-[#E2E8F0] h-[45px] rounded-xl overflow-hidden mb-6 flex items-center relative shadow-sm">
                    <motion.div
                        animate={{ x: ["60%", "-100%"] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute whitespace-nowrap text-[13px] font-medium flex items-center gap-3"
                    >
                        <Star size={16} className="text-[#6366F1] fill-[#6366F1]" />
                        <span className="text-black font-bold">BEST GAMES: 91CLUB • 55CLUB • IN999 • DAMAN GAMES • BDG Game</span>
                        <Star size={16} className="text-[#6366F1] fill-[#6366F1]" />
                        <span className="text-black font-bold">✅ Join Telegram Channel For Latest Updates!</span>
                    </motion.div>
                </div>

                {/* 5. GAME CARDS CONTAINER */}
                <div className="grid grid-cols-2 gap-4 px-2">
                    {games.map((game, index) => (
                        <motion.div
                            key={index}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => redirectToGame(game.name, game.logo, game.link)}
                            className="group relative bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col items-center gap-3 cursor-pointer transition-all hover:border-[#6366F1] hover:shadow-lg w-[95%] mx-auto"
                        >
                            {game.hot && (
                                <div className="absolute top-[-2px] right-[-2px] bg-[#818CF8] text-white text-[10px] font-bold pl-3 pr-4 py-1.5 rounded-bl-[15px] rounded-tr-[15px] flex items-center gap-1.5 shadow-sm">
                                    <i className="fas fa-fire-alt"></i>
                                    <span>HOT</span>
                                </div>
                            )}
                            <img src={game.logo} alt={game.name} className="w-[90px] h-[90px] rounded-2xl object-cover border-2 border-[#F1F5F9] group-hover:scale-110 group-hover:border-[#6366F1] transition-all duration-300 shadow-sm" />
                            <p className="font-bold text-[16px] text-[#1E293B]">{game.name}</p>
                        </motion.div>
                    ))}
                </div>

                {/* 6. BOTTOM SECTION */}
                <div className="mt-10 mb-8 flex flex-col items-center gap-4">
                    <p className="w-[95%] bg-white p-5 rounded-2xl border border-[#E2E8F0] text-[13px] text-[#475569] text-center font-medium shadow-sm leading-relaxed italic">
                        "If your favourite game is not added, then don't worry soon it will be available, for now, you can play other games."
                    </p>

                    <div className="w-full flex flex-col items-center gap-3">
                        <ActionButton
                            onClick={() => window.open(`https://t.me/${telegram}`, '_blank')}
                            icon="fas fa-download"
                            label="Download Old (Mod)"
                            color="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8]"
                        />
                        <ActionButton
                            onClick={() => window.open(`https://t.me/${telegram}`, '_blank')}
                            icon="fab fa-telegram"
                            label="Join Telegram"
                            color="bg-gradient-to-r from-[#6366F1] to-[#818CF8]"
                        />
                        <ActionButton
                            onClick={() => window.open(`https://wa.me/${whatsapp}`, '_blank')}
                            icon="fas fa-headset"
                            label="Customer Care"
                            color="bg-gradient-to-r from-[#6366F1] to-[#818CF8]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- REUSABLE BUTTON COMPONENT ---
const ActionButton = ({ icon, label, color, onClick }) => (
    <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`w-[90%] max-w-[320px] ${color} text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-3 transition-transform hover:-translate-y-1`}
    >
        <i className={icon + " text-lg"}></i>
        {label}
    </motion.button>
);

export default GamePortal;