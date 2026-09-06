import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserCheck, ShieldCheck, Loader2, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 🟢 Domain Detect karne wala helper (Matches Auth, Portal, and Game)
const getDomainConfig = () => {
    const host = window.location.hostname;
    if (host.includes('sureshothack.pro')) {
        return { variant: 'msa2', label: 'MSA2 (Ashu)' };
    }
    if (host.includes('sureshotxpro.sbs')) {
        return { variant: 'msa3', label: 'MSA3 (Golu)' };
    }
    return { variant: 'test', label: 'Test Environment' };
};

const AdminPanel = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState(''); // 📱 Changed from email to phone

    // 🟢 Dynamic Variant: Domain ke hisaab se apne aap set ho jayega
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
            // 🟢 Backend API Call: Variant dynamic jayega
            const res = await axios.post('/api/maspro/admin/activate-vip', {
                phone,
                variant
            });
            setStatus({ type: 'success', msg: res.data.message });
            setEmail('');
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 font-['Poppins']">
            <div className="max-w-md mx-auto">
                <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-indigo-600 transition-colors">
                    <ArrowLeft size={18} /> BACK TO DASHBOARD
                </button>

                <div className="bg-white rounded-[32px] p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-indigo-600 p-3.5 rounded-2xl text-white shadow-lg shadow-indigo-200">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">ADMIN CONTROL</h1>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Manual Override System</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl mb-8 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Domain</p>
                                <p className="text-sm font-black text-indigo-600 italic">{domainLabel}</p>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        </div>

                        <div className="space-y-6">
                            {/* Variant Selector */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 ml-1 uppercase tracking-wider">Select Project Variant</label>
                                <select 
                                    value={variant}
                                    onChange={(e) => setVariant(e.target.value)}
                                    className="w-full bg-white border-2 border-slate-100 py-4 px-6 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all cursor-pointer appearance-none shadow-sm"
                                >
                                    <option value="msa1">MAS PRO 1 (Personal)</option>
                                    <option value="msa2">MAS PRO 2 (Ashu)</option>
                                    <option value="msa3">MAS PRO 3 (Golu)</option>
                                </select>
                            </div>

                            {/* Phone Input */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 ml-1 uppercase tracking-wider">User Phone Number</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Smartphone size={18} />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="91xxxxxxxxxx"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-white border-2 border-slate-100 py-4 pl-14 pr-6 rounded-2xl font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Status Feedback */}
                            {status && (
                                <div className={`p-4 rounded-2xl text-[11px] font-black text-center uppercase tracking-wider border-2 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                    {status.msg}
                                </div>
                            )}

                            {/* Action Button */}
                            <button
                                onClick={handleManualActivate}
                                disabled={loading}
                                className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-4.5 rounded-2xl font-black shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <><UserCheck size={20} /> ACTIVATE VIP ACCESS</>}
                            </button>
                        </div>
                    </div>
                </div>
                
                <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Access strictly restricted to authorized developers.
                </p>
            </div>
        </div>
    );
};

export default AdminPanel;