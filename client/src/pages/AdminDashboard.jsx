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
            <h1 className="text-3xl font-black mb-8 border-b border-white/10 pb-4 text-orange-500">
                MASTER ADMIN PANEL
            </h1>

            {/* Top Stat Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-[#151921] p-8 rounded-3xl border border-white/5 shadow-xl">
                    <p className="text-gray-400 font-bold uppercase text-sm mb-2">Total Platform Users</p>
                    <h2 className="text-5xl font-black text-white">{stats.totalUsers}</h2>
                </div>
                <div className="bg-[#151921] p-8 rounded-3xl border border-orange-500/20 shadow-xl shadow-orange-500/5">
                    <p className="text-orange-400 font-bold uppercase text-sm mb-2">Total VIP Users</p>
                    <h2 className="text-5xl font-black text-white">{stats.totalVipUsers}</h2>
                </div>
            </div>

            {/* VIP User List */}
            <div className="bg-[#151921] rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/5">
                    <h3 className="text-xl font-bold">Active VIP Subscribers</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 uppercase text-xs font-black border-b border-white/5">
                                <th className="p-6">User (Phone/Email)</th>
                                <th className="p-6">Mod Type</th>
                                <th className="p-6">Expiry Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats.vipList.map((vip, index) => (
                                <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 font-bold text-white">{vip.identifier}</td>
                                    <td className="p-6">
                                        <span className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-xs font-black uppercase">
                                            {vip.mod}
                                        </span>
                                    </td>
                                    <td className="p-6 text-gray-400 text-sm">
                                        {vip.expiry ? new Date(vip.expiry).toLocaleDateString() : 'Lifetime'}
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