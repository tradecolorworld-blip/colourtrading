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

    if (loading) return <div className="min-h-screen bg-[#0b0e14] text-white flex items-center justify-center font-black italic uppercase tracking-widest animate-pulse">Loading Live Data...</div>;

    const formatIST = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="min-h-screen bg-[#0b0e14] text-[#e2e8f0] p-4 md:p-8 font-sans">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black italic text-orange-500 tracking-tighter">MASTER ADMIN</h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Global Earnings & User Control</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-[#151921] px-6 py-3 rounded-2xl border border-white/5 shadow-lg">
                        <p className="text-[10px] font-black text-gray-500 uppercase">Total Users</p>
                        <p className="text-2xl font-black text-white">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-[#151921] px-6 py-3 rounded-2xl border border-orange-500/20 shadow-lg">
                        <p className="text-[10px] font-black text-orange-500 uppercase">Total VIP</p>
                        <p className="text-2xl font-black text-white">{stats.totalVipUsers}</p>
                    </div>
                </div>
            </header>

            {/* Performance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard title="Today" data={stats.analytics.today} color="border-orange-500" />
                <StatCard title="Yesterday" data={stats.analytics.yesterday} color="border-blue-500" />
                <StatCard title="This Week" data={stats.analytics.week} color="border-green-500" />
            </div>

            {/* Detailed VIP List */}
            <div className="bg-[#151921] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-black italic uppercase tracking-tight">VIP History</h3>
                    <div className="text-[10px] bg-green-500/20 text-green-400 px-4 py-1.5 rounded-full font-black uppercase">Sorted by Latest</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 uppercase text-[10px] font-black border-b border-white/5 tracking-widest">
                                <th className="p-8">Buy Time (IST)</th>
                                <th className="p-8">User ID</th>
                                <th className="p-8 text-center">Mod</th>
                                <th className="p-8 text-center">Amount</th>
                                <th className="p-8 text-right">Plan Expiry</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats.vipList.map((vip, index) => (
                                <tr key={index} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="p-8">
                                        <p className="text-sm font-black text-orange-400">{new Date(vip.purchasedAt).toLocaleDateString('en-IN')}</p>
                                        <p className="text-[11px] font-bold text-gray-500 uppercase">{formatIST(vip.purchasedAt)}</p>
                                    </td>
                                    <td className="p-8 font-black text-white text-sm">{vip.identifier}</td>
                                    <td className="p-8 text-center">
                                        <span className="bg-orange-500/10 text-orange-500 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                            {vip.mod}
                                        </span>
                                    </td>
                                    <td className="p-8 text-center font-black text-green-400 text-lg">₹{vip.price}</td>
                                    <td className="p-8 text-gray-500 text-xs text-right font-bold italic uppercase tracking-tighter">
                                        {new Date(vip.expiry).toLocaleDateString('en-IN')}
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

const StatCard = ({ title, data, color }) => (
    <div className={`bg-[#151921] p-6 rounded-[28px] border-b-4 ${color} shadow-2xl hover:translate-y-[-5px] transition-transform duration-300`}>
        <div className="flex justify-between items-start mb-6">
            <h4 className="text-gray-400 font-black text-[11px] uppercase tracking-[0.2em]">{title} Stats</h4>
            <div className={`w-2 h-2 rounded-full animate-pulse ${color.replace('border', 'bg')}`}></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Users</p>
                <p className="text-xl font-black text-white">{data.users}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">VIP Sales</p>
                <p className="text-xl font-black text-orange-500">{data.vips}</p>
            </div>
        </div>
        <div className="mt-4 bg-green-500/10 p-5 rounded-2xl flex justify-between items-center">
            <p className="text-[10px] font-black text-green-500 uppercase">Net Earning</p>
            <p className="text-2xl font-black text-green-400">₹{data.earnings}</p>
        </div>
    </div>
);

export default AdminDashboard;