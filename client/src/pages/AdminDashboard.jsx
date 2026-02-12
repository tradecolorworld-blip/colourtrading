import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/admin/stats');
                setStats(res.data);
            } catch (err) { console.error(err); } 
            finally { setLoading(false); }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="min-h-screen bg-[#0b0e14] text-white flex items-center justify-center">Loading Data...</div>;

    const { analytics } = stats;

    return (
        <div className="min-h-screen bg-[#0b0e14] text-[#e2e8f0] p-4 md:p-8 font-sans">
            <h1 className="text-3xl font-black mb-8 border-b border-white/10 pb-4 text-orange-500 flex justify-between">
                MASTER ADMIN PANEL <span className="text-sm text-gray-500 font-normal italic">v2.0 Performance</span>
            </h1>

            {/* 🟢 NEW: ANALYTICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <StatCard title="Today" data={analytics.today} color="border-orange-500" />
                <StatCard title="Yesterday" data={analytics.yesterday} color="border-blue-500" />
                <StatCard title="This Week" data={analytics.week} color="border-green-500" />
            </div>

            {/* VIP User List */}
            <div className="bg-[#151921] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between">
                    <h3 className="text-xl font-bold">Recent VIP Purchases</h3>
                    <p className="text-gray-400 text-xs uppercase font-black">Total Earnings: ₹{analytics.week.earnings + analytics.today.earnings}</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 uppercase text-[10px] font-black border-b border-white/5 tracking-widest">
                                <th className="p-6">Buy Date & Time</th>
                                <th className="p-6">User</th>
                                <th className="p-6">Mod</th>
                                <th className="p-6 text-center">Price</th>
                                <th className="p-6 text-right">Expiry</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats.vipList.map((vip, index) => (
                                <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 text-xs font-bold text-orange-400">
                                        {/* 🟢 Date & Time Added */}
                                        {new Date(vip.purchasedAt).toLocaleDateString('en-GB')} <br/>
                                        <span className="text-[10px] text-gray-500 font-normal">
                                            {new Date(vip.purchasedAt).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </td>
                                    <td className="p-6 font-bold text-white text-sm">{vip.identifier}</td>
                                    <td className="p-6 text-[10px] font-black uppercase text-orange-500">{vip.mod}</td>
                                    <td className="p-6 text-center font-black text-green-400">₹{vip.price}</td>
                                    <td className="p-6 text-gray-500 text-xs text-right">{new Date(vip.expiry).toLocaleDateString('en-GB')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, data, color }) => (
    <div className={`bg-[#151921] p-5 rounded-2xl border-l-4 ${color} shadow-xl`}>
        <h4 className="text-gray-400 font-black text-xs uppercase mb-4 tracking-widest">{title} Overview</h4>
        <div className="space-y-3">
            <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">New Users</span>
                <span className="text-lg font-black text-white">{data.users}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">VIP Sales</span>
                <span className="text-lg font-black text-orange-500">{data.vips}</span>
            </div>
            <div className="flex justify-between pt-1">
                <span className="text-xs font-bold text-gray-500 uppercase">Earning</span>
                <span className="text-xl font-black text-green-400">₹{data.earnings}</span>
            </div>
        </div>
    </div>
);

export default AdminDashboard;