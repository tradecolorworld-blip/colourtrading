import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserCheck, ShieldCheck, Loader2, Smartphone, CheckCircle, XCircle, Lock, Gamepad2, Plus, Trash2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

// 🟢 Domain Detect Helper
const getDomainConfig = () => {
    const host = window.location.hostname;
    if (host.includes('sureshotpro.sbs')) return { variant: 'sure1', label: 'SURE1 (Main)' };
    if (host.includes('sureshothack.pro')) return { variant: 'sure2', label: 'SURE2 (Ashu)' };
    if (host.includes('sureshotypro.xyz')) return { variant: 'sure3', label: 'SURE3 (Golu)' };
    return { variant: 'sure1', storageKey: 'SURE_test_user', whatsapp: '919116046055', telegram: 'modapksh', youtube: '' };

};

const AdminPanel = () => {
    const navigate = useNavigate();
    const { variant: autoVariant, label: domainLabel } = getDomainConfig();
    
    const [activeTab, setActiveTab] = useState('vip'); // 'vip' or 'games'
    const [variant, setVariant] = useState(autoVariant);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    // VIP State
    const [phone, setPhone] = useState('');

    // Game Management State
    const [games, setGames] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [gameForm, setGameForm] = useState({ name: '', logo: '', link: '', hot: false });

    useEffect(() => {
        setVariant(autoVariant);
    }, [autoVariant]);

    // Fetch Games when variant or tab changes
    useEffect(() => {
        if (activeTab === 'games') {
            fetchGames();
        }
    }, [variant, activeTab]);

    const fetchGames = async () => {
        try {
            const res = await axios.get(`/api/sureshotnew/games/${variant}`);
            setGames(res.data);
        } catch (error) {
            console.error("Failed to fetch games");
        }
    };

    // --- VIP LOGIC ---
    const handleManualActivate = async () => {
        if (!phone) return alert("Please enter a phone number");
        setLoading(true); setStatus(null);
        try {
            const res = await axios.post('/api/sureshotnew/admin/activate-vip', { phone, variant });
            setStatus({ type: 'success', msg: res.data.message });
            setPhone('');
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    // --- GAME LOGIC ---
    const handleSaveGame = async (e) => {
        e.preventDefault();
        setLoading(true); setStatus(null);
        try {
            const payload = { ...gameForm, variant };
            if (editingId) {
                await axios.put(`/api/sureshotnew/admin/games/${editingId}`, payload);
                setStatus({ type: 'success', msg: "Game updated!" });
            } else {
                await axios.post('/api/sureshotnew/admin/games', payload);
                setStatus({ type: 'success', msg: "Game added!" });
            }
            setGameForm({ name: '', logo: '', link: '', hot: false });
            setEditingId(null);
            fetchGames();
        } catch (err) {
            setStatus({ type: 'error', msg: "Failed to save game" });
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (game) => {
        setEditingId(game._id);
        setGameForm({ name: game.name, logo: game.logo, link: game.link, hot: game.hot });
        setStatus(null);
    };

    const handleDeleteGame = async (id) => {
        if (!window.confirm("Delete this game?")) return;
        try {
            await axios.delete(`/api/sureshotnew/admin/games/${id}`);
            fetchGames();
        } catch (err) {
            alert("Failed to delete game");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0D0620] via-[#1A0535] to-[#2D0A5C] text-[#F5F0FF] font-['Poppins'] p-4 relative overflow-x-hidden">
            
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.08) 1px, transparent 1px)' }} />
            <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent z-50 opacity-80" />

            <div className="relative z-10 max-w-md mx-auto pt-6 pb-12">
                <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-[#FBBF24] font-bold text-sm hover:text-[#F59E0B] transition-colors drop-shadow-md">
                    <ArrowLeft size={18} /> BACK TO DASHBOARD
                </button>

                <div className="bg-[#1E0A3C]/80 border border-[#F59E0B]/30 backdrop-blur-xl rounded-[32px] p-6 shadow-[0_8px_32px_rgba(124,58,237,0.35)]">
                    
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] border border-[#A855F7]/50 p-3.5 rounded-2xl text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                            <ShieldCheck size={28} className="text-[#FBBF24]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white leading-tight uppercase">Admin Panel</h1>
                            <p className="text-[10px] font-bold text-[#8B7CB8] uppercase tracking-widest">{domainLabel}</p>
                        </div>
                    </div>

                    {/* Variant Selector (Applies to both Tabs) */}
                    <div className="mb-6">
                        <label className="text-[10px] font-bold text-[#C4B5FD] ml-1 uppercase tracking-wider mb-1 block">Select Environment</label>
                        <select 
                            value={variant} onChange={(e) => setVariant(e.target.value)}
                            className="w-full bg-[#0D0620]/60 border border-[#7C3AED]/40 text-white py-3 px-4 rounded-xl font-bold outline-none focus:border-[#F59E0B] transition-all"
                        >
                            <option value="sure1">SURE 1 (Main Project)</option>
                            <option value="sure2">SURE 2 (Ashu)</option>
                            <option value="sure3">SURE 3 (Golu)</option>
                        </select>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-[#0D0620]/60 p-1 rounded-2xl mb-6 border border-[#7C3AED]/20">
                        <button onClick={() => {setActiveTab('vip'); setStatus(null)}} className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'vip' ? 'bg-[#7C3AED] text-white shadow-md' : 'text-[#8B7CB8] hover:text-[#C4B5FD]'}`}>
                            <UserCheck size={16} /> VIP Access
                        </button>
                        <button onClick={() => {setActiveTab('games'); setStatus(null)}} className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'games' ? 'bg-[#F59E0B] text-[#0D0620] shadow-md' : 'text-[#8B7CB8] hover:text-[#C4B5FD]'}`}>
                            <Gamepad2 size={16} /> Games
                        </button>
                    </div>

                    {/* STATUS ALERT */}
                    <AnimatePresence>
                        {status && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`p-3 mb-4 rounded-xl text-[11px] font-black flex items-center justify-center gap-2 uppercase tracking-wider border ${status.type === 'success' ? 'bg-[#10b981]/10 text-[#34d399] border-[#10b981]/40' : 'bg-[#ef4444]/10 text-[#f87171] border-[#ef4444]/40'}`}>
                                {status.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                {status.msg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* TAB CONTENT: VIP */}
                    {activeTab === 'vip' && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-[#C4B5FD] ml-1 uppercase tracking-wider block mb-1">User Phone Number</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F59E0B]"><Smartphone size={16} /></div>
                                    <input type="tel" placeholder="Enter 10 digits" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} className="w-full bg-[#0D0620]/60 border border-[#7C3AED]/40 text-white py-3 pl-12 pr-4 rounded-xl font-bold outline-none focus:border-[#F59E0B] transition-all" />
                                </div>
                            </div>
                            <motion.button whileTap={{ scale: 0.96 }} onClick={handleManualActivate} disabled={loading} className="w-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:border-[#F59E0B] disabled:opacity-70 uppercase tracking-wide">
                                {loading ? <Loader2 className="animate-spin" /> : <><UserCheck size={18} className="text-[#FBBF24]" /> Grant VIP Access</>}
                            </motion.button>
                        </div>
                    )}

                    {/* TAB CONTENT: GAMES */}
                    {activeTab === 'games' && (
                        <div className="space-y-5">
                            <form onSubmit={handleSaveGame} className="bg-[#0D0620]/40 p-4 rounded-2xl border border-[#7C3AED]/30 space-y-3">
                                <div>
                                    <input type="text" placeholder="Game Name" value={gameForm.name} onChange={e => setGameForm({...gameForm, name: e.target.value})} required className="w-full bg-[#1E0A3C] border border-[#7C3AED]/30 text-white py-2.5 px-4 rounded-lg text-xs font-bold outline-none focus:border-[#F59E0B]" />
                                </div>
                                <div>
                                    <input type="url" placeholder="Logo URL (https://...png)" value={gameForm.logo} onChange={e => setGameForm({...gameForm, logo: e.target.value})} required className="w-full bg-[#1E0A3C] border border-[#7C3AED]/30 text-white py-2.5 px-4 rounded-lg text-xs font-bold outline-none focus:border-[#F59E0B]" />
                                </div>
                                <div>
                                    <input type="url" placeholder="Game Link (https://...)" value={gameForm.link} onChange={e => setGameForm({...gameForm, link: e.target.value})} required className="w-full bg-[#1E0A3C] border border-[#7C3AED]/30 text-white py-2.5 px-4 rounded-lg text-xs font-bold outline-none focus:border-[#F59E0B]" />
                                </div>
                                <div className="flex items-center gap-2 px-1">
                                    <input type="checkbox" id="hot" checked={gameForm.hot} onChange={e => setGameForm({...gameForm, hot: e.target.checked})} className="w-4 h-4 accent-[#F59E0B]" />
                                    <label htmlFor="hot" className="text-xs font-bold text-[#F59E0B] uppercase">Mark as HOT 🔥</label>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button type="submit" disabled={loading} className="flex-1 bg-[#F59E0B] text-[#0D0620] py-2.5 rounded-lg font-black text-xs uppercase flex items-center justify-center gap-2">
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : editingId ? "Update Game" : <><Plus size={16}/> Add Game</>}
                                    </button>
                                    {editingId && (
                                        <button type="button" onClick={() => {setEditingId(null); setGameForm({name:'', logo:'', link:'', hot:false})}} className="bg-red-500/20 text-red-400 px-4 rounded-lg font-bold text-xs uppercase">Cancel</button>
                                    )}
                                </div>
                            </form>

                            {/* Game List */}
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                {games.length === 0 ? (
                                    <p className="text-center text-xs text-[#8B7CB8] py-4">No games added yet.</p>
                                ) : (
                                    games.map(game => (
                                        <div key={game._id} className="bg-[#1E0A3C] border border-[#7C3AED]/30 p-3 rounded-xl flex items-center justify-between gap-3">
                                            <img src={game.logo} alt={game.name} className="w-10 h-10 rounded-lg object-cover border border-[#F59E0B]/50 bg-white" />
                                            <div className="flex-1 overflow-hidden">
                                                <h4 className="text-sm font-black text-white truncate flex items-center gap-2">
                                                    {game.name} {game.hot && <span className="text-[9px] bg-red-500 px-1.5 py-0.5 rounded text-white">HOT</span>}
                                                </h4>
                                                <p className="text-[10px] text-[#8B7CB8] truncate">{game.link}</p>
                                            </div>
                                            <div className="flex gap-1.5">
                                                <button onClick={() => handleEditClick(game)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"><Edit2 size={14} /></button>
                                                <button onClick={() => handleDeleteGame(game._id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;