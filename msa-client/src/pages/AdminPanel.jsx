import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserCheck, ShieldCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 🟢 Domain Detect karne wala helper (Matches Auth, Portal, and Game)
const getDomainConfig = () => {
    const host = window.location.hostname;
    
    if (host.includes('bigsmallhack.sbs')) {
        return { variant: 'msa2', label: 'MSA2 (Ashu)' };
    }
    if (host.includes('patternhack.sbs')) {
        return { variant: 'msa3', label: 'MSA3 (Golu)' };
    }
    return { variant: 'test', label: 'Test Environment' };
};

const AdminPanel = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    
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
        if (!email) return alert("Please enter an email");
        setLoading(true);
        setStatus(null);

        try {
            // 🟢 Backend API Call: Variant dynamic jayega
            const res = await axios.post('/api/mas/admin/activate-vip', {
                email,
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
                <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-slate-500 font-bold text-sm">
                    <ArrowLeft size={18} /> Back
                </button>

                <div className="bg-white rounded-[28px] p-8 shadow-xl border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                            <ShieldCheck size={24} />
                        </div>
                        <h1 className="text-xl font-black text-slate-800">ADMIN CONTROL</h1>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl mb-6">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Current Domain</p>
                        <p className="text-sm font-bold text-indigo-600">{domainLabel}</p>
                    </div>

                    <p className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">Manual VIP Activation</p>

                    <div className="space-y-6">
                        {/* Variant Selector: Ab ye domain ke hisaab se pehle se selected hai */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 ml-1 uppercase">Target Variant</label>
                            <select 
                                value={variant}
                                onChange={(e) => setVariant(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 py-4 px-6 rounded-2xl font-bold outline-none focus:border-indigo-500 transition-all cursor-pointer"
                            >
                                <option value="msa1">MSA1 (Personal)</option>
                                <option value="msa2">MSA2 (Ashu)</option>
                                <option value="msa3">MSA3 (Golu)</option>
                            </select>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 ml-1 uppercase">User Email Address</label>
                            <input
                                type="email"
                                placeholder="customer@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 py-4 px-6 rounded-2xl font-bold outline-none focus:border-indigo-500 transition-all shadow-inner"
                                required
                            />
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className={`p-4 rounded-xl text-xs font-bold text-center animate-pulse ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                {status.msg}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleManualActivate}
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg shadow-slate-200 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><UserCheck size={20} /> ACTIVATE VIP</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;