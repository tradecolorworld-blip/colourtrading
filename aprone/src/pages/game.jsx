import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, Send, Headset } from 'lucide-react';

const getDomainConfig = () => {
    const host = window.location.hostname;
    const configs = {
        'modmenuhack.sbs': {
            variant: 'apr1',
            storageKey: 'APR1_user',
            whatsapp: '919875736055',
            telegram: 'modapksh',
            youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4'
        },
        'modmenuhack.site': {
            variant: 'apr2',
            storageKey: 'APR2_user',
            whatsapp: '919001410711',
            telegram: 'modapksales',
            youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4'
        },
        'modmenuhack.buzz': {
            variant: 'apr3',
            storageKey: 'APR3_user',
            whatsapp: '917891202468',
            telegram: 'hackerbabaji1',
            youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4'
        }
    };
    return configs[host] || {
        variant: 'apr1',
        storageKey: 'APR1_user',
        whatsapp: '919875736055',
        telegram: 'modapksh',
        youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4'
    };
};
const GameScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 🟢 Dynamic Data from Portal
    // gameData will contain { name, link, logo }
    const gameData = location.state;

    const { telegram, whatsapp } = getDomainConfig();

    const ballData = [
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

    // States
    const [isChecking, setIsChecking] = useState(false);
    const [timer, setTimer] = useState({ period: '---', sec: '00' });
    const [prediction, setPrediction] = useState(null);

    const generateResult = () => {
        const num = Math.floor(Math.random() * 10);
        return {
            n: num,
            size: num >= 5 ? 'BIG' : 'SMALL',
            color: [1, 3, 7, 9].includes(num) ? 'GREEN' : (num === 0 || num === 5 ? 'VIOLET' : 'RED')

        };
    };

    // 1. Generate NEW result immediately on mount
    useEffect(() => {
        setPrediction(generateResult());
    }, []);

    // Safety Redirect: If someone tries to access this route directly without clicking a game
    useEffect(() => {
        if (!gameData) {
            navigate('/portal');
        }
    }, [gameData, navigate]);



    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const totalSeconds = now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds();
            const remaining = 60 - (totalSeconds % 60);

            setTimer({
                sec: remaining.toString().padStart(2, '0'),
                period: `${now.toISOString().slice(0, 10).replace(/-/g, '')}1000${10001 + Math.floor(totalSeconds / 60)}`
            });

            if (remaining === 59) {
                setIsChecking(true);
                setTimeout(() => {
                    const newPrediction = generateResult();
                    setPrediction(newPrediction); // Uses the helper
                    console.log("New Prediction:", newPrediction); // Debug log
                    setIsChecking(false);
                }, 2500);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!gameData) return null;

    return (
        <div className="h-[100dvh] w-full flex flex-col bg-black overflow-hidden font-['Poppins']">

            <button
                onClick={() => navigate('/portal')}
                className="absolute top-3 left-3 z-[110] bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full text-white shadow-xl active:scale-90 transition-transform"
            >
                <ArrowLeft size={20} strokeWidth={3} />
            </button>

            {/* 1. TOP HACK PANEL (Fixed) */}
            <div className="w-full h-45 bg-[#0d0e1b] p-3 ">
                {/* Header Row */}
                <div className="flex justify-between items-center mb-2 ml-25">
                    <div className="flex gap-2">
                        <div className="bg-[#8b2e2e] text-white px-3 py-1 rounded-md text-[10px] font-black italic shadow-sm uppercase">
                            {gameData.name} HACK
                        </div>

                    </div>
                    <div className="flex items-center gap-1.5 text-[#4ade80] text-[10px] font-black tracking-widest">
                        <div className="w-2 h-2 bg-[#4ade80] rounded-full animate-pulse shadow-[0_0_8px_#4ade80]" /> LIVE
                    </div>
                </div>

                {/* Sub-Info */}
                <div className="flex items-center justify-between mb-2 ml-25">
                    <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-black text-[11px] uppercase tracking-wider">WINGO 1 MIN</span>
                        <span className="text-gray-500 text-[10px]">( Default )</span>
                    </div>
                    <div className="text-white font-mono text-[11px]">
                        00:{timer.sec}
                    </div>
                </div>

                <div className="text-white/70 text-[10px] font-bold mb-3 flex items-center gap-2">
                    <span className="text-indigo-400">ROUND ID:</span> {timer.period}
                </div>

                {/* PREDICTION BOX */}
                <div className="h-[68px] w-full bg-gradient-to-r from-[#000000] via-[#1a47cc] to-[#5d2691] rounded-xl flex items-center overflow-hidden border border-white/20 shadow-inner">
                    {isChecking ? (
                        <div className="w-full flex items-center justify-center gap-3 text-white font-black italic text-sm tracking-widest">
                            <Loader2 className="animate-spin" size={20} /> ANALYZING TRENDS...
                        </div>
                    ) : (
                        <div className="flex w-full divide-x divide-white/10 h-full">
                            {/* Ball Section */}
                            <div className="flex-1 flex justify-center items-center bg-black/20">
                                <motion.img
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    src={ballData.find(b => b?.n === prediction?.n)?.img}
                                    alt="ball"
                                    className="h-11 w-11 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                                />
                            </div>
                            {/* Size Section */}
                            <div className="flex-[1.5] flex justify-center items-center font-black text-2xl text-white italic tracking-tighter drop-shadow-md">
                                {prediction?.size}
                            </div>
                            {/* Color Section */}
                            <div className={`flex-[1.5] flex justify-center items-center font-black text-2xl italic tracking-tighter drop-shadow-md ${prediction?.color === 'GREEN' ? 'text-[#4ade80]' : prediction?.color === 'RED' ? 'text-[#ff4d4d]' : 'text-[#a855f7]'}`}>
                                {prediction?.color}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. GAME WEBVIEW (Dynamic Link) */}
            <div className="flex-1 w-full ">
                <iframe
                    src={gameData?.link}
                    title="Game Frame"
                    className="w-full h-full border-none pointer-events-auto"
                    style={{ height: '100%', width: '100%' }}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                />


            </div>
        </div>
    );
};

export default GameScreen;