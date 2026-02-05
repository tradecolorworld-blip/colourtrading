import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalVipUsers: 0, vipList: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to load admin stats");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="min-h-screen bg-[#0b0e14] text-white flex items-center justify-center">Loading Admin Panel...</div>;

    return (
        <div className="min-h-screen bg-[#0b0e14] text-[#e2e8f0] p-6 font-sans">
            <h1 className="text-3xl font-black mb-8 border-b border-white/10 pb-4 text-orange-500 flex justify-between items-center">
                MASTER ADMIN PANEL
                <span className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full">LIVE STATS</span>
            </h1>

            {/* Top Stat Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-[#151921] p-8 rounded-3xl border border-white/5 shadow-xl">
                    <p className="text-gray-400 font-bold uppercase text-sm mb-2">Total Platform Users</p>
                    <h2 className="text-5xl font-black text-white tracking-tighter">{stats.totalUsers}</h2>
                </div>
                <div className="bg-[#151921] p-8 rounded-3xl border border-orange-500/20 shadow-xl shadow-orange-500/5">
                    <p className="text-orange-400 font-bold uppercase text-sm mb-2">Total VIP Users</p>
                    <h2 className="text-5xl font-black text-white tracking-tighter">{stats.totalVipUsers}</h2>
                </div>
            </div>

            {/* VIP User List */}
            <div className="bg-[#151921] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Active VIP Subscribers</h3>
                    <p className="text-gray-400 text-xs">Sorted by: Latest Purchase</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 uppercase text-[10px] font-black border-b border-white/5 tracking-widest">
                                <th className="p-6">Purchase Date</th>
                                <th className="p-6">User (Phone/Email)</th>
                                <th className="p-6">Mod Type</th>
                                <th className="p-6 text-center">Price</th>
                                <th className="p-6 text-right">Expiry Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats.vipList.map((vip, index) => (
                                <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 text-sm font-bold text-orange-400">
                                        {new Date(vip.purchasedAt).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="p-6 font-bold text-white text-sm">{vip.identifier}</td>
                                    <td className="p-6">
                                        <span className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                            {vip.mod}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center font-black text-green-400">
                                        ₹{vip.price}
                                    </td>
                                    <td className="p-6 text-gray-400 text-sm text-right font-mono">
                                        {vip.expiry ? new Date(vip.expiry).toLocaleDateString('en-GB') : 'LIFETIME'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;