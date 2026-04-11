import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- 1. New States (Add these with your other states) ---
    const [showQrModal, setShowQrModal] = useState(false);
    const [testAmount, setTestAmount] = useState('');
    const [qrLoading, setQrLoading] = useState(false);

    // --- Manual VIP State ---
    const [showVipModal, setShowVipModal] = useState(false);
    const [vipForm, setVipForm] = useState({
        identifier: '',
        mod: 'WinGo',
        planType: 'PRO'
    });
    const [actionLoading, setActionLoading] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error("Failed to load admin stats:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleManualActivate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const res = await axios.post('/api/admin/universal-activate-vip', vipForm);
            alert(res.data.message);
            setShowVipModal(false);
            setVipForm({ identifier: '', mod: 'WinGo', planType: 'PRO' });
            fetchStats(); // Refresh dashboard
        } catch (err) {
            alert(err.response?.data?.message || "Activation failed");
        } finally {
            setActionLoading(false);
        }
    };

    // --- 2. QR Test Function ---
    const handleCreateTestQR = async (e) => {
        e.preventDefault();
        setQrLoading(true);
        try {
            const res = await axios.post('/api/admin/payment/test-create', { amount: testAmount });
            if (res.data.status && res.data.results?.payment_url) {
                // Open the payment URL in a new tab to see if QR generates
                window.open(res.data.results.payment_url, '_blank');
                setShowQrModal(false);
                setTestAmount('');
            } else {
                alert("API Error: " + (res.data.message || "Could not generate QR"));
            }
        } catch (err) {
            alert("Gateway Error: " + (err.response?.data?.message || "Check server logs"));
        } finally {
            setQrLoading(false);
        }
    };

    if (loading && !stats) return (
        <div className="min-h-screen bg-[#0b0e14] text-white flex items-center justify-center font-black italic uppercase tracking-widest animate-pulse">
            Loading Live Data...
        </div>
    );

    const formatIST = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true, day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-[#0b0e14] text-[#e2e8f0] p-4 md:p-8 font-sans">
            {/* --- HEADER --- */}
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black italic text-orange-500 tracking-tighter">MASTER ADMIN</h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Global Earnings & User Control</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* 🟢 NEW ADD VIP BUTTON */}
                    <button
                        onClick={() => setShowVipModal(true)}
                        className="bg-green-600 hover:bg-green-500 text-white font-black italic px-6 py-3 rounded-2xl shadow-lg transition-all active:scale-95 text-sm uppercase mr-4"
                    >
                        + Add VIP
                    </button>
                    <button
                        onClick={() => setShowQrModal(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-black italic px-6 py-3 rounded-2xl shadow-lg transition-all active:scale-95 text-sm uppercase mr-2"
                    >
                        Test QR
                    </button>
                    <div className="bg-[#151921] px-6 py-3 rounded-2xl border border-white/5 shadow-lg">
                        <p className="text-[10px] font-black text-gray-500 uppercase">Total Users</p>
                        <p className="text-2xl font-black text-white">{stats?.totalUsers}</p>
                    </div>
                    <div className="bg-[#151921] px-6 py-3 rounded-2xl border border-orange-500/20 shadow-lg">
                        <p className="text-[10px] font-black text-orange-500 uppercase">Total VIP</p>
                        <p className="text-2xl font-black text-white">{stats?.totalVipUsers}</p>
                    </div>
                </div>
            </header>

            {/* --- PERFORMANCE GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard title="Today" data={stats?.analytics?.today} color="border-orange-500" />
                <StatCard title="Yesterday" data={stats?.analytics?.yesterday} color="border-blue-500" />
                <StatCard title="This Week" data={stats?.analytics?.week} color="border-green-500" />
            </div>

            {/* --- VIP DETAILED HISTORY --- */}
            <div className="bg-[#151921] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-black italic uppercase tracking-tight">VIP History (IST)</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 uppercase text-[10px] font-black border-b border-white/5 tracking-widest">
                                <th className="p-8">Buy Time (IST)</th>
                                <th className="p-8">User Identifier</th>
                                <th className="p-8 text-center">Mod Type</th>
                                <th className="p-8 text-center">Amount</th>
                                <th className="p-8 text-right">Plan Expiry</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats?.vipList?.map((vip, index) => {
                                const fullDateIST = formatIST(vip.purchasedAt);
                                return (
                                    <tr key={index} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="p-8">
                                            <p className="text-sm font-black text-orange-400">{fullDateIST.split(',')[0]}</p>
                                            <p className="text-[11px] font-bold text-gray-500 uppercase">{fullDateIST.split(',')[1]}</p>
                                        </td>
                                        <td className="p-8 font-black text-white text-sm">{vip.identifier}</td>
                                        <td className="p-8 text-center">
                                            <span className="bg-orange-500/10 text-orange-500 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase">
                                                {vip.mod}
                                            </span>
                                        </td>
                                        <td className="p-8 text-center font-black text-green-400 text-lg">₹{vip.price}</td>
                                        <td className="p-8 text-gray-500 text-xs text-right font-bold italic uppercase">
                                            {new Date(vip.expiry).toLocaleDateString('en-IN')}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 🟢 MANUAL VIP POPUP MODAL */}
            {showVipModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="bg-[#151921] border border-white/10 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                        <div className="bg-orange-500 p-6">
                            <h2 className="text-white font-black italic text-xl uppercase tracking-tighter text-center">Manual VIP Activation</h2>
                        </div>

                        <form onSubmit={handleManualActivate} className="p-8 space-y-6">
                            {/* Mod Dropdown */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Select Mod</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 font-bold outline-none focus:border-orange-500"
                                    value={vipForm.mod}
                                    onChange={(e) => setVipForm({ ...vipForm, mod: e.target.value })}
                                >
                                    {['Original', 'Neon', 'Jalwa', 'SureShot', 'NumberHack', 'WinGo', 'MSA1', 'MASPro1','APR1'].map(mod => (
                                        <option key={mod} value={mod} className="bg-[#151921]">{mod}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Identifier Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">User ID (Email or Phone)</label>
                                <input
                                    type="text"
                                    placeholder="Enter User Phone or Email"
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 font-bold outline-none focus:border-orange-500"
                                    value={vipForm.identifier}
                                    onChange={(e) => setVipForm({ ...vipForm, identifier: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Plan Option (Conditional for WinGo) */}
                            {vipForm.mod === 'WinGo' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Select Tier</label>
                                    <div className="flex gap-4">
                                        {['PRO', 'SUPER_PRO'].map(plan => (
                                            <button
                                                key={plan}
                                                type="button"
                                                onClick={() => setVipForm({ ...vipForm, planType: plan })}
                                                className={`flex-1 py-3 rounded-xl font-black text-[10px] border transition-all ${vipForm.planType === plan ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                                            >
                                                {plan.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowVipModal(false)}
                                    className="flex-1 bg-white/5 text-gray-400 font-bold py-4 rounded-2xl hover:bg-white/10"
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="flex-2 bg-orange-500 hover:bg-orange-400 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-orange-500/20 disabled:opacity-50"
                                >
                                    {actionLoading ? 'PROCESSING...' : 'MAKE VIP NOW'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showQrModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="bg-[#151921] border border-white/10 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl">
                        <div className="bg-blue-600 p-6 text-center">
                            <h2 className="text-white font-black italic text-xl uppercase tracking-tighter">Gateway Health Check</h2>
                            <p className="text-blue-200 text-[10px] font-bold uppercase mt-1">Test if 3rd party QR is working</p>
                        </div>

                        <form onSubmit={handleCreateTestQR} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Enter Amount (₹)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 1, 10, 500"
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 font-black text-xl outline-none focus:border-blue-500 text-center"
                                    value={testAmount}
                                    onChange={(e) => setTestAmount(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowQrModal(false)}
                                    className="flex-1 bg-white/5 text-gray-400 font-bold py-4 rounded-2xl hover:bg-white/10"
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="submit"
                                    disabled={qrLoading}
                                    className="flex-2 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-8 rounded-2xl shadow-lg disabled:opacity-50"
                                >
                                    {qrLoading ? 'CREATING...' : 'GENERATE QR'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ title, data, color }) => (
    <div className={`bg-[#151921] p-6 rounded-[28px] border-b-4 ${color} shadow-2xl`}>
        <div className="flex justify-between items-start mb-6 uppercase">
            <h4 className="text-gray-400 font-black text-[11px] tracking-[0.2em]">{title} Stats</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Users</p>
                <p className="text-xl font-black text-white">{data?.users || 0}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">VIP Sales</p>
                <p className="text-xl font-black text-orange-500">{data?.vips || 0}</p>
            </div>
        </div>
        <div className="mt-4 bg-green-500/10 p-5 rounded-2xl flex justify-between items-center">
            <p className="text-[10px] font-black text-green-500 uppercase tracking-tighter">Net Earning</p>
            <p className="text-2xl font-black text-green-400">₹{data?.earnings || 0}</p>
        </div>
    </div>
);

export default AdminDashboard;