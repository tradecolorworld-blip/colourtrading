import React, { useState, useEffect } from 'react';
import { Star, Flame, Send, CheckCircle, Download, Headset, Gift, Rocket, LogOut, X, QrCode, Loader2, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
import jai from '../assets/jai.jpg';
import logo13 from '../assets/logo13.webp';
import logo14 from '../assets/logo14.png';
import logo15 from '../assets/logo15.png';
import logo16 from '../assets/logo16.png';
import logo17 from '../assets/logo17.png';
import logo18 from '../assets/logo18.png';
import logo19 from '../assets/logo19.png';
import logo20 from '../assets/logo20.png';
import logo21 from '../assets/logo21.png';
import logo22 from '../assets/logo22.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 🟢 NEW: Domain Configuration Helper (Must match App.jsx and Auth.jsx)
const getDomainConfig = () => {
    const host = window.location.hostname;
    if (host.includes('modmenuhack.sbs')) {
        return {
            variant: 'apr1',
            storageKey: 'APR1_user',
            whatsapp: '919875736055',
            telegram: 'modapksh',
            youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4',
            rajaLink: "https://rajagames91.xyz/#/register?invitationCode=155064101080"
        };
    }
    if (host.includes('modmenuhack.site')) {
        return {
            variant: 'apr2',
            storageKey: 'APR2_user',
            whatsapp: '919057617196',
            telegram: 'modapksales',
            youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4',
            rajaLink: "https://rajagames111.com/#/register?invitationCode=643349101079"
        };
    }
    if (host.includes('modmenuhack.buzz')) {
        return {
            variant: 'apr3',
            storageKey: 'APR3_user',
            whatsapp: '917891202468',
            telegram: 'hackerbabaji1',
            youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4',
            rajaLink: "https://rajagames100.com/#/register?invitationCode=815360101080"
        };
    }
    return {
        variant: 'apr1',
        storageKey: 'APR1_user',
        whatsapp: '919875736055',
        telegram: 'modapksh',
        youtube: 'https://www.youtube.com/watch?v=-HdcugtTRN4',
        rajaLink: "https://rajagames91.xyz/#/register?invitationCode=155064101080"
    };
};

const formattedDate = (isoString) => {
    if (!isoString) return "---";
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};



const GamePortal = () => {
    const navigate = useNavigate();
    const { variant, storageKey, whatsapp, telegram, rajaLink } = getDomainConfig();


    // --- STATE ---
    const [isVip, setIsVip] = useState(false);
    const [vipExpiry, setVipExpiry] = useState("");
    const [showPayModal, setShowPayModal] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(8245);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem(storageKey));

    // 🟢 1. Load user and check VIP status on mount
    useEffect(() => {
        if (!user) { navigate('/auth'); return; }

        const checkVip = async () => {
            if (user?.phone) {
                try {
                    const res = await axios.post('/api/apr/check-vip', {
                        phone: user.phone,
                        variant
                    });
                    setIsVip(res.data.isVip);
                    setVipExpiry(formattedDate(res?.data?.expiry));
                } catch (err) { console.error("VIP Check Error"); }
            }
        };
        checkVip();
    }, [user, navigate, variant]);

    // 🟢 2. NEW: Verify Payment if returning from Gateway (Auto-check)
    useEffect(() => {
        if (isVip) return
        const verifyPayment = async () => {
            const pendingOrder = JSON.parse(localStorage.getItem('apr_current_order'));
            if (pendingOrder && user) {
                try {
                    const res = await axios.post('/api/apr/payment/status', {
                        order_id: pendingOrder.order_id,
                        phone: user.phone,
                        variant
                    });

                    if (res.data.status === "Success") {
                        alert(`Success! VIP Activated.`);
                        setIsVip(true);
                        localStorage.removeItem('apr_current_order');
                    }
                } catch (err) {
                    console.error("Verification failed");
                }
            }
        };
        if (user) verifyPayment();
    }, [user, variant]);

    // 🟢 3. Payment Flow: Create Order
    const handlePayment = async () => {
        setPaymentLoading(true);
        try {
            const res = await axios.post('/api/apr/payment/create', { phone: user.phone, variant });
            if (res.data.status && res.data.results.payment_url) {
                // Store order ID to check status after redirect back
                localStorage.setItem('apr_current_order', JSON.stringify({
                    order_id: res.data.results.order_id
                }));
                window.location.href = res.data.results.payment_url;
            }
        } catch (err) { alert("Payment failed to initialize."); }
        finally {
            setPaymentLoading(false); // Stop loading if error occurs
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setOnlineUsers(Math.floor(Math.random() * 2501) + 7500);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleGameClick = (game) => {
        if (!isVip) {
            setShowPayModal(true);
        } else {
            navigate('/game', { state: { ...game } });
        }
    };


    const games = [
        { name: "JaiClub", logo: jai, link: "https://jaiclubs00.com/#/register?invitationCode=825885101141", hot: true },
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

        { name: "Big Mumbai", logo: logo18, link: "https://www.bigmumbaic.com/#/register?invitationCode=6467867363", hot: false },
        { name: "Goa Game", logo: logo19, link: "https://www.goaok.vip/#/register?invitationCode=675458825209", hot: false },
        { name: "KWG", logo: logo20, link: "https://www.kwgin1.com/#/register?invitationCode=25913Z5322", hot: false },
        { name: "Lottery 7", logo: logo21, link: "https://www.lottery7ddd.com/#/register?invitationCode=1475713204859", hot: false },
        { name: "Sikkim Game", logo: logo22, link: "https://sikkimgame.cash/register#/register?invitationCode=395152651469", hot: false },



    ];

    const handleLogout = () => {
        localStorage.removeItem(storageKey);
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-white font-['Poppins'] pb-20 pt-5">
            {/* Header with Back & Logout */}
            <div className="p-4 flex justify-between items-center">
                <button className="p-2 bg-red-900/10 rounded-full text-red-800"><ArrowLeft size={20} /></button>
                <h1 className="text-[#1a47cc] font-black text-2xl text-center leading-tight">
                    COLOUR TRADING<br />MOD MENU
                </h1>
                <button onClick={handleLogout} className="p-2 bg-red-900/10 rounded-full text-red-800"><LogOut size={20} /></button>
            </div>

            {/* VIP STATUS CARD */}
            <div className="flex flex-col items-center mb-6">
                {isVip ? (
                    <div className="">
                        <div className="bg-black border-4 border-yellow-600 rounded-xl p-3 flex items-center justify-center gap-3 shadow-lg">
                            <span className="text-yellow-500 font-black text-2xl italic">VIP</span>
                            <Star className="text-yellow-500 fill-yellow-500" size={24} />
                            <span className="text-yellow-500 font-bold tracking-widest">MEMBER</span>
                        </div>
                        <p className="text-center text-gray-600 font-mono mt-1 text-sm">TILL - {vipExpiry}</p>
                    </div>
                ) : (
                    <div className="w-[80%] flex flex-col items-center">
                        <button
                            onClick={() => setShowPayModal(true)}
                            className="w-full bg-[#c2412e] text-white py-3 rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-md"
                        >
                            ACCESS VIP MODE <div className="bg-yellow-200/20 p-1 rounded">VIP</div>
                        </button>
                        <p className="text-red-600 font-bold mt-2 text-sm">You're not VIP USER</p>
                    </div>
                )}
            </div>

            {/* GAME LIST */}
            <div className="px-10 space-y-5">
                {games.map((game, i) => (
                    <button
                        key={i}
                        onClick={() => handleGameClick(game)}
                        className="w-full bg-[#5da2c4] rounded-full p-1.5 flex items-center justify-between pr-6 shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <img src={game.logo} className="w-12 h-12 rounded-full" alt="" />
                            <span className="text-white font-black text-xl tracking-wider">{game.name}</span>
                        </div>
                        <div className="bg-yellow-500/80 p-1 rounded-md text-[10px] font-bold text-white flex items-center gap-1">
                            <Star size={10} fill="white" /> VIP
                        </div>
                    </button>
                ))}
            </div>

            {/* FOOTER INFO BOX */}
            <div className="mt-8 px-6">
                <div className="bg-white border-2 border-[#5da2c4] rounded-2xl p-4 text-center">
                    {isVip ? (
                        <div className="text-[#1a47cc] text-sm font-bold space-y-1">
                            <p>आपका VIP एक्सेस सफलतापूर्वक एक्टिव हो गया है।</p>
                            <p>अब आप सभी प्रीमियम टूल्स का उपयोग कर सकते हैं।</p>
                            <ul className="text-left inline-block mt-2">
                                <li>• Number Sureshot</li>
                                <li>• Big Small Sureshot</li>
                                <li>• 24x7 Live Support</li>
                            </ul>
                        </div>
                    ) : (
                        <div className="text-gray-800 text-[12px] font-bold leading-relaxed">
                            यह हैक सिर्फ VIP यूजर ही इस्तेमाल कर सकते है।<br />
                            इसलिए ACCESS VIP MODE पर क्लिक करके VIP यूजर बने।<br />
                            एक बार पेमेंट करने पर यूजर सभी हैक इस्तेमाल कर सकता है।<br />
                            पेमेंट करने का बाद यह हैक 17 दिनों तक चलेगा।
                        </div>
                    )}
                </div>
            </div>

            {/* SOCIAL FLOATING FOOTER */}
            <div className="mt-5 flex justify-center gap-6">
                <button onClick={() => window.open(`https://wa.me/${whatsapp}`)} className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg"><Headset size={30} /></button>
                <button onClick={() => window.open(`https://t.me/${telegram}`)} className="w-14 h-14 bg-blue-400 rounded-full flex items-center justify-center text-white shadow-lg"><Send size={30} /></button>
                <button className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg"><Youtube size={30} /></button>
            </div>

            {/* PAYMENT MODAL (POPUP) */}
            <AnimatePresence>
                {showPayModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-[#d7e9ff] w-full max-w-sm rounded-[30px] overflow-hidden relative border-2 border-red-500 shadow-2xl"
                        >
                            <button onClick={() => setShowPayModal(false)} className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1 z-10">
                                <X size={20} />
                            </button>

                            <div className="p-6 pt-10 text-center">
                                <h2 className="text-[#1a47cc] font-black text-xl mb-4">
                                    ACCESS VIP HACK IN <span className="text-green-600">₹710</span></h2>

                                <button
                                    className="w-full bg-[#a81c07] text-white py-4 rounded-full font-black text-xl flex items-center justify-center gap-3 shadow-lg mb-2 disabled:opacity-70"
                                    onClick={handlePayment}
                                    disabled={paymentLoading}
                                >
                                    {paymentLoading ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <>
                                            PAY ON QR
                                            <div className="bg-white text-blue-800 rounded-full p-1 shadow-sm">
                                                <ArrowRight size={16} strokeWidth={4} />
                                            </div>
                                        </>
                                    )}
                                </button>
                                <p className="text-red-500 font-bold text-xs mb-4 italic">INSTANT ACTIVATION</p>

                                <div className="border-t border-gray-400 pt-2 mb-4">
                                    <p className="text-gray-700 font-bold mb-2 underline">Features</p>
                                    <ul className="text-red-500 font-bold text-sm space-y-1">
                                        <li>• Number Sureshot</li>
                                        <li>• Big-Small Sureshot</li>
                                        <li>• Colour Sureshot</li>
                                        <li>• 2 Level Winning</li>
                                    </ul>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="bg-white p-4 rounded-xl shadow-inner mb-2">
                                        <QrCode size={120} className="text-blue-900" />
                                    </div>
                                    <p className="flex items-center gap-2 text-blue-900 font-black text-sm">
                                        🚫 No money - No Accuracy 🚫
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

const ArrowLeft = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>;
const ArrowRight = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;

export default GamePortal;