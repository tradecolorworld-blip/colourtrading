import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, LogOut, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Logo Imports (Keep your existing paths)
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

// Domain Configuration Helper
const getDomainConfig = () => {
    const host = window.location.hostname;
    if (host.includes('sureshotpro.sbs')) {
        return {
            variant: 'sure1',
            storageKey: 'SURE1PRO_user',
            whatsapp: '919116046055',
            telegram: 'modapksh',
            youtube: 'https://youtu.be/qQAtpOn-tFw',
            rajaLink: "https://rajagames91.xyz/#/register?invitationCode=155064101080"
        };
    }
    if (host.includes('sureshothack.pro')) {
        return {
            variant: 'sure2',
            storageKey: 'SURE2PRO_user',
            whatsapp: '919001410711',
            telegram: 'modapksales',
            youtube: 'https://youtu.be/qQAtpOn-tFw',
            rajaLink: "https://rajagames111.com/#/register?invitationCode=643349101079"
        };
    }
    if (host.includes('sureshotypro.xyz')) {
        return {
            variant: 'sure3',
            storageKey: 'SURE3PRO_user',
            whatsapp: '917891202468',
            telegram: 'hackerbabaji1',
            youtube: 'https://youtu.be/qQAtpOn-tFw',
            rajaLink: "https://rajagames100.com/#/register?invitationCode=815360101080"
        };
    }
    return { variant: 'sure1', storageKey: 'SURE_test_user', whatsapp: '919116046055', telegram: 'modapksh', youtube: '', rajaLink: 'https://rajagames91.xyz/#/register?invitationCode=155064101080' };
};

const GamePortal = () => {
    const [onlineUsers, setOnlineUsers] = useState(8245);
    const navigate = useNavigate();

    const { storageKey, whatsapp, telegram, rajaLink, variant } = getDomainConfig();

    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    // Random User Counter
    useEffect(() => {
        const updateUsers = () => {
            const randomUsers = Math.floor(Math.random() * 2501) + 7500;
            setOnlineUsers(randomUsers);
        };
        const interval = setInterval(updateUsers, 5000);
        return () => clearInterval(interval);
    }, []);

    // 🟢 FETCH GAMES FROM API
    useEffect(() => {
        const fetchGames = async () => {
            try {
                // Using relative path so Nginx/Vite proxy handles it
                const res = await axios.get(`/api/sureshotnew/games/${variant}`);
                setGames(res.data);
            } catch (err) {
                console.error("Failed to load games:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [variant]);

    const redirectToGame = (gameName, gameLogo, gameLink) => {
        navigate('/game', {
            state: { name: gameName, logo: gameLogo, link: gameLink }
        });
    };

    const handleLogout = () => {
        localStorage.removeItem(storageKey);
        navigate('/auth');
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0D0620] via-[#1A0535] to-[#2D0A5C] text-[#F5F0FF] font-['Poppins'] p-4 relative overflow-x-hidden pb-12">

            {/* Background Decor - Particles & Glows */}
            <div
                className="fixed inset-0 pointer-events-none z-0 opacity-40"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.08) 1px, transparent 1px), radial-gradient(circle, rgba(168,85,247,0.06) 1px, transparent 1px)',
                    backgroundSize: '60px 60px, 90px 90px',
                    backgroundPosition: '0 0, 30px 30px'
                }}
            />
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-[#7C3AED]/20 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#F59E0B]/10 rounded-full blur-[80px] animate-pulse" />
            </div>
            {/* Top Gold Divider Line */}
            <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent z-50 opacity-80" />


            {/* 1. TOP HEADER ACTIONS */}
            <div className="relative z-20 flex justify-between items-center mb-6 pt-2 max-w-[500px] mx-auto">
                <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#D97706] text-[#0D0620] font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-[2px] shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center gap-1.5"
                >
                    <i className="fas fa-shield-alt"></i> 100% Safe
                </motion.div>

                <button
                    onClick={handleLogout}
                    className="bg-[#1E0A3C]/80 border border-[#ef4444]/40 text-[#ef4444] px-4 py-1.5 rounded-full shadow-[0_4px_12px_rgba(239,68,68,0.15)] font-bold text-[11px] flex items-center gap-2 hover:bg-[#ef4444]/10 transition-all uppercase tracking-wider backdrop-blur-md"
                >
                    <LogOut size={14} /> Logout
                </button>
            </div>

            <div className="relative z-10 max-w-[500px] mx-auto">

                {/* 2. STATS BAR */}
                <div className="flex justify-between items-center gap-3 mb-6">
                    <div className="flex-1 bg-[#1E0A3C]/80 border border-[#7C3AED]/30 px-3 py-3 rounded-2xl text-[12px] font-bold text-[#C4B5FD] flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(124,58,237,0.2)] backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_#10b981]"></span>
                        Online: <span className="text-[#FBBF24] font-black">{onlineUsers.toLocaleString()}</span>
                    </div>

                    <div className="flex-1 bg-[#1E0A3C]/80 border border-[#7C3AED]/30 px-3 py-3 rounded-2xl text-[12px] font-bold text-[#C4B5FD] flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(124,58,237,0.2)] backdrop-blur-md">
                        <CheckCircle size={14} className="text-[#10b981]" />
                        Server: <span className="text-[#10b981] font-black">Active</span>
                    </div>
                </div>

                {/* 3. JOIN TELEGRAM MAIN BUTTON */}
                <button
                    onClick={() => window.open(`https://t.me/${telegram}`, '_blank')}
                    className="w-[90%] max-w-[320px] mx-auto flex items-center justify-center gap-3 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] border border-[#A855F7]/50 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wide shadow-[0_8px_25px_rgba(168,85,247,0.35)] hover:-translate-y-1 active:scale-95 transition-all mb-6 relative overflow-hidden"
                >
                    {/* Glossy sweep effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
                    <i className="fab fa-telegram text-xl"></i>
                    Join Official Telegram
                </button>

                {/* 4. NOTIFICATION BANNER (Marquee) */}
                <div className="w-full bg-[#1E0A3C]/80 border border-[#F59E0B]/30 h-[48px] rounded-2xl overflow-hidden mb-8 flex items-center relative shadow-[0_4px_20px_rgba(245,158,11,0.15)] backdrop-blur-md">
                    {/* Left Gold Gradient Fade */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#1E0A3C] to-transparent z-10" />

                    <motion.div
                        animate={{ x: ["100%", "-150%"] }}
                        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                        className="absolute whitespace-nowrap text-[13px] font-bold flex items-center gap-3 text-[#F5F0FF]"
                    >
                        <Star size={14} className="text-[#F59E0B] fill-[#F59E0B] drop-shadow-[0_0_8px_#F59E0B]" />
                        <span>BEST GAMES: <span className="text-[#FBBF24]">91CLUB • 55CLUB • IN999 • BDG GAME</span></span>
                        <Star size={14} className="text-[#F59E0B] fill-[#F59E0B] drop-shadow-[0_0_8px_#F59E0B]" />
                        <span className="text-[#10b981]">✅ Join Telegram Channel For Latest Updates!</span>
                    </motion.div>
                </div>

                {/* Section Header */}
                <div className="flex items-center justify-center gap-4 mb-5">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#F59E0B]/50" />
                    <span className="text-[#F59E0B] font-black text-[11px] tracking-[3px] uppercase drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                        <i className="fas fa-fire mr-2"></i>Top Games
                    </span>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#F59E0B]/50" />
                </div>

                {/* 5. DYNAMIC GAME CARDS GRID */}
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="animate-spin text-[#F59E0B]" size={32} />
                    </div>
                ) : games.length === 0 ? (
                    <div className="text-center py-10 text-[#8B7CB8] font-bold text-sm uppercase tracking-wider">
                        No games available yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 px-1">
                        {games.map((game) => (
                            <motion.div
                                key={game._id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => redirectToGame(game.name, game.logo, game.link)}
                                className="group relative bg-[#1E0A3C]/60 backdrop-blur-sm p-4 rounded-[20px] border border-[#7C3AED]/30 shadow-[0_8px_24px_rgba(0,0,0,0.4)] flex flex-col items-center gap-3 cursor-pointer transition-all hover:border-[#F59E0B] hover:shadow-[0_8px_30px_rgba(245,158,11,0.25)] hover:-translate-y-1 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {game.hot && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-[#ef4444] to-[#dc2626] text-white text-[9px] font-black pl-3 pr-2 py-1 rounded-bl-[12px] flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.5)] border-l border-b border-white/20 z-10">
                                        <i className="fas fa-fire animate-pulse"></i> HOT
                                    </div>
                                )}

                                <div className="relative">
                                    <img src={game.logo} alt={game.name} className="w-[80px] h-[80px] rounded-xl object-cover border-2 border-[#7C3AED]/40 group-hover:border-[#F59E0B] transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.5)] z-10 relative bg-white" />
                                    <div className="absolute inset-0 rounded-xl bg-[#F59E0B] blur-[15px] opacity-0 group-hover:opacity-30 transition-opacity" />
                                </div>

                                <p className="font-black text-[14px] text-white tracking-wide group-hover:text-[#FBBF24] transition-colors z-10">{game.name}</p>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* 6. BOTTOM SECTION */}
                <div className="mt-10 flex flex-col items-center gap-5">
                    <div className="w-full bg-[#1E0A3C]/80 p-5 rounded-2xl border border-[#7C3AED]/30 shadow-[0_8px_32px_rgba(124,58,237,0.15)] backdrop-blur-md flex gap-3 items-start">
                        <i className="fas fa-info-circle text-[#F59E0B] mt-1 text-lg drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"></i>
                        <p className="text-[12px] text-[#C4B5FD] font-medium leading-relaxed">
                            If your favourite game is not added, don't worry—it will be available soon. For now, try our top performing modes above.
                        </p>
                    </div>

                    <div className="w-full flex flex-col items-center gap-3">
                        <ActionButton
                            onClick={() => window.open(`https://t.me/${telegram}`, '_blank')}
                            icon="fas fa-download"
                            label="Download Old (Mod)"
                            color="from-[#3B82F6] to-[#1D4ED8] border-[#3B82F6]/50 hover:shadow-[0_8px_25px_rgba(59,130,246,0.3)]"
                        />
                        <ActionButton
                            onClick={() => window.open(`https://wa.me/${whatsapp}`, '_blank')}
                            icon="fas fa-headset"
                            label="Customer Care"
                            color="from-[#10b981] to-[#059669] border-[#10b981]/50 hover:shadow-[0_8px_25px_rgba(16,185,129,0.3)]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- VIP REUSABLE BUTTON COMPONENT ---
const ActionButton = ({ icon, label, color, onClick }) => (
    <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        className={`w-[90%] max-w-[320px] bg-gradient-to-r ${color} border text-white py-4 rounded-xl font-black text-sm uppercase tracking-wide shadow-lg flex items-center justify-center gap-3 transition-all hover:-translate-y-1`}
    >
        <i className={icon + " text-lg"}></i>
        {label}
    </motion.button>
);

export default GamePortal;