import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserCheck, ShieldCheck, Loader2, Smartphone, CheckCircle, XCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

// 🟢 Domain Detect Helper (Updated to match sure1, sure2, sure3 variants)
const getDomainConfig = () => {
    const host = window.location.hostname;
    if (host.includes('sureshotpro.sbs')) return { variant: 'sure1', label: 'SURE1 (Main)' };
    if (host.includes('sureshothack.pro')) return { variant: 'sure2', label: 'SURE2 (Ashu)' };
    if (host.includes('sureshotypro.xyz')) return { variant: 'sure3', label: 'SURE3 (Golu)' };
    return { variant: 'sure1', label: 'Local/Test Environment' };
};

const AdminPanel = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');

    const { variant: autoVariant, label: domainLabel } = getDomainConfig();
    const [variant, setVariant] = useState(autoVariant);

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    // Sync variant if domain changes
    useEffect(() => {
        setVariant(autoVariant);
    }, [autoVariant]);

    const handleManualActivate = async () => {
        if (!phone) return alert("Please enter a phone number");
        setLoading(true);
        setStatus(null);

        try {
            // 🟢 Backend API Call: Updated endpoint
            const res = await axios.post('http://localhost:5000/api/sureshotnew/admin/activate-vip', {
                phone,
                variant
            });
            setStatus({ type: 'success', msg: res.data.message });
            setPhone(''); // 🟢 BUG FIXED: Changed from setEmail('') to setPhone('')
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0D0620] via-[#1A0535] to-[#2D0A5C] text-[#F5F0FF] font-['Poppins'] p-4 relative overflow-x-hidden selection:bg-[#F59E0B] selection:text-[#0D0620]">
            
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
                <div className="absolute top-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-[#7C3AED]/20 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#F59E0B]/10 rounded-full blur-[80px] animate-pulse" />
            </div>

            {/* Top Gold Divider Line */}
            <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent z-50 opacity-80" />

            <div className="relative z-10 max-w-md mx-auto pt-6 pb-12">
                
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-[#FBBF24] font-bold text-sm hover:text-[#F59E0B] transition-colors drop-shadow-md">
                    <ArrowLeft size={18} /> BACK TO DASHBOARD
                </button>

                {/* Main Admin Card */}
                <div className="bg-[#1E0A3C]/80 border border-[#F59E0B]/30 backdrop-blur-xl rounded-[32px] p-8 shadow-[0_8px_32px_rgba(124,58,237,0.35)] relative overflow-hidden">
                    
                    {/* Top Accent Tag (VIP Gold) */}
                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-[#F59E0B] to-[#D97706] text-[#0D0620] px-5 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                        Admin Only
                    </div>

                    <div className="relative z-10 mt-2">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] border border-[#A855F7]/50 p-3.5 rounded-2xl text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                <ShieldCheck size={28} className="text-[#FBBF24]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-white leading-tight tracking-tight uppercase">Admin Control</h1>
                                <p className="text-[10px] font-bold text-[#8B7CB8] uppercase tracking-[0.2em]">Manual VIP Override</p>
                            </div>
                        </div>

                        {/* Active Domain Indicator */}
                        <div className="bg-[#0D0620]/60 border border-[#7C3AED]/40 p-5 rounded-2xl mb-8 flex items-center justify-between shadow-inner">
                            <div>
                                <p className="text-[9px] font-black text-[#8B7CB8] uppercase tracking-widest mb-1">Active Environment</p>
                                <p className="text-sm font-black text-[#FBBF24] uppercase tracking-wider">{domainLabel}</p>
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#10b981]/10 border border-[#10b981]/30">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_#10b981]" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Variant Selector */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#C4B5FD] ml-1 uppercase tracking-wider">Target Project Variant</label>
                                <div className="relative">
                                    <select 
                                        value={variant}
                                        onChange={(e) => setVariant(e.target.value)}
                                        className="w-full bg-[#0D0620]/60 border border-[#7C3AED]/40 text-white py-4 px-6 rounded-2xl font-bold outline-none focus:border-[#F59E0B] focus:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all cursor-pointer appearance-none shadow-inner"
                                    >
                                        <option value="sure1" className="bg-[#1A0535]">SURE 1 (Main Project)</option>
                                        <option value="sure2" className="bg-[#1A0535]">SURE 2 (Ashu)</option>
                                        <option value="sure3" className="bg-[#1A0535]">SURE 3 (Golu)</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#FBBF24]">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            {/* Phone Input */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#C4B5FD] ml-1 uppercase tracking-wider">User Phone Number</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#F59E0B]">
                                        <Smartphone size={18} />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="Enter 10 digits"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        maxLength={10}
                                        className="w-full bg-[#0D0620]/60 border border-[#7C3AED]/40 text-white py-4 pl-14 pr-6 rounded-2xl font-bold outline-none focus:border-[#F59E0B] focus:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all shadow-inner placeholder-[#8B7CB8]/50"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Status Feedback */}
                            <AnimatePresence>
                                {status && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`p-4 rounded-2xl text-[12px] font-black flex items-center justify-center gap-2 uppercase tracking-wider border ${status.type === 'success' ? 'bg-[#10b981]/10 text-[#34d399] border-[#10b981]/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-[#ef4444]/10 text-[#f87171] border-[#ef4444]/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]'}`}
                                    >
                                        {status.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                        {status.msg}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Action Button */}
                            <motion.button
                                whileTap={{ scale: 0.96 }}
                                onClick={handleManualActivate}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] border border-[#F59E0B]/80 text-white py-4 rounded-2xl font-black text-[15px] shadow-[0_0_18px_rgba(168,85,247,0.4)] flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:border-[#F59E0B] disabled:opacity-70 mt-4 uppercase tracking-wide"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <><UserCheck size={20} className="text-[#FBBF24]" /> Grant VIP Access</>}
                            </motion.button>
                        </div>
                    </div>
                </div>
                
                <p className="mt-8 text-center text-[10px] font-bold text-[#8B7CB8] uppercase tracking-widest flex items-center justify-center gap-2">
                    <Lock size={12} /> Strictly Restricted to Developers
                </p>
            </div>
        </div>
    );
};

export default AdminPanel;