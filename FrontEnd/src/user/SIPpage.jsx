import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMySips,
  createSip,
  pauseSip,
  resumeSip,
  deleteSip,
} from "../slice/Sipslice";
import { fetchWallet } from "../slice/Walletslice";
import UserLayout from "./userLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Calendar,
  Wallet,
  ArrowRight,
  Pause,
  Play,
  Trash2,
  AlertCircle,
  RefreshCcw,
  CheckCircle2,
  X,
  TrendingUp,
  TrendingDown,
  Info,
  Briefcase,
  History,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  Clock
} from "lucide-react";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const DAYS = Array.from({ length: 28 }, (_, i) => i + 1);
const ordinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/* ── Simple SIP Card ── */
function SipCard({ sip, onPause, onResume, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const isActive = sip.status === "ACTIVE";

  return (
    <motion.div
      layout
      className={`bg-white rounded-[2.5rem] border ${isActive ? "border-slate-200" : "border-slate-100 opacity-70"} shadow-sm overflow-hidden group transition-all duration-500 hover:shadow-xl hover:-translate-y-1`}
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${sip.asset === "GOLD" ? "bg-yellow-50 text-[#BA943A]" : "bg-slate-50 text-slate-400"}`}>
               {sip.asset === "GOLD" ? <TrendingUp size={22} /> : <TrendingUp size={22} />}
            </div>
            <div>
              <div className="font-serif text-3xl font-black text-slate-900 leading-none mb-1.5">₹{fmt(sip.amountPerMonth)}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sip.asset} Asset Node</div>
            </div>
          </div>
          
          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
            {isActive ? "Operational" : "Paused"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6 py-6 border-y border-slate-50 mb-8">
          <div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Cycle Day</p>
            <p className="text-xs font-black text-slate-900">{ordinal(sip.dayOfMonth)}</p>
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Last Sync</p>
            <p className="text-xs font-black text-slate-900">
              {sip.lastExecutedAt ? new Date(sip.lastExecutedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Void"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Created</p>
            <p className="text-xs font-black text-slate-900">
              {new Date(sip.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {isActive ? (
            <button
              onClick={() => onPause(sip._id)}
              className="flex-1 py-4 rounded-2xl border border-slate-100 bg-white text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <Pause size={14} strokeWidth={3} /> Pause Cycle
            </button>
          ) : (
            <button
              onClick={() => onResume(sip._id)}
              className="flex-1 py-4 rounded-2xl border border-yellow-100 bg-yellow-50 text-[#BA943A] text-[10px] font-black uppercase tracking-widest hover:bg-yellow-100 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Play size={14} strokeWidth={3} fill="currentColor" /> Resume Cycle
            </button>
          )}

          <AnimatePresence mode="wait">
            {confirming ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-1 gap-3"
              >
                <button
                  onClick={() => onDelete(sip._id)}
                  className="flex-1 py-4 rounded-2xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-900/20"
                >
                  Confirm Wipe
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="p-4 rounded-2xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              </motion.div>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="p-4 rounded-2xl border border-rose-50 text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                <Trash2 size={16} strokeWidth={2.5} />
              </button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function SipPage() {
  const dispatch = useDispatch();
  const { sips, loading, error, successMessage } = useSelector((s) => s.sip);
  const { walletBalance } = useSelector((s) => s.wallet);

  const [form, setForm] = useState({
    asset: "GOLD",
    amountPerMonth: "",
    dayOfMonth: 1,
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchMySips());
    dispatch(fetchWallet());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setForm({ asset: "GOLD", amountPerMonth: "", dayOfMonth: 1 });
      setShowForm(false);
    }
  }, [successMessage]);

  const handleCreate = () => {
    if (!form.amountPerMonth || parseFloat(form.amountPerMonth) <= 0) return;
    dispatch(
      createSip({
        asset: form.asset,
        amountPerMonth: parseFloat(form.amountPerMonth),
        dayOfMonth: parseInt(form.dayOfMonth),
      }),
    );
  };

  const activeSips = sips.filter((s) => s.status === "ACTIVE");
  const totalMonthly = activeSips.reduce((sum, s) => sum + s.amountPerMonth, 0);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <UserLayout active="/user/sip">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section (Staff-Matched) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight leading-none mb-3">
               Savings Cycles<span className="text-amber-500">.</span>
            </h1>
            <p className="text-slate-500 font-medium flex items-center gap-2.5">
               <RefreshCcw size={18} className="text-[#BA943A]" />
               Automated Accumulation
               <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-2" />
               <Activity size={16} className="text-emerald-500" />
               Operational Protocol
            </p>
          </motion.div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-xl active:scale-95
              ${showForm 
                ? "bg-white text-slate-900 border border-slate-200" 
                : "bg-slate-900 text-[#BA943A] shadow-yellow-900/10 hover:bg-black"}`}
          >
            {showForm ? <X size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
            <span>{showForm ? "Cancel Creation" : "Setup New Cycle"}</span>
          </button>
        </div>

        {/* Summary Dashboard (Staff-Matched Scale) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Active Nodes", value: activeSips.length, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Monthly Outflow", value: `₹${fmt(totalMonthly)}`, icon: Calendar, color: "text-[#BA943A]", bg: "bg-yellow-50" },
            { label: "Total Managed", value: sips.length, icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Wallet Hub", value: `₹${fmt(walletBalance)}`, icon: Wallet, color: "text-slate-900", bg: "bg-slate-100" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white p-7 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-start group"
            >
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform`}>
                <stat.icon size={22} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
              <p className={`font-serif text-3xl font-black ${stat.color} tracking-tight`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] border border-[#BA943A]/20 shadow-2xl shadow-yellow-900/5 overflow-hidden"
            >
              <div className="p-10 lg:p-12">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-[#BA943A]">
                      <Plus size={28} strokeWidth={3} />
                   </div>
                   <div>
                      <h2 className="font-serif text-3xl font-black text-slate-900 tracking-tight">Initiate Accumulation Cycle</h2>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Setup Automated Asset Acquisition</p>
                   </div>
                </div>
                
                {error && (
                  <div className="mb-10 p-5 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                    <AlertCircle size={20} />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="space-y-10">
                    {/* Asset Selection */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5">Target Asset Node</label>
                      <div className="grid grid-cols-2 gap-5">
                        {["GOLD", "SILVER"].map((a) => (
                          <button
                            key={a}
                            onClick={() => setForm({ ...form, asset: a })}
                            className={`relative flex items-center justify-center gap-4 py-5 rounded-2xl border-2 transition-all duration-500
                              ${form.asset === a 
                                ? (a === "GOLD" ? "bg-yellow-50 border-[#BA943A] text-[#BA943A] shadow-xl shadow-yellow-900/5" : "bg-slate-50 border-slate-900 text-slate-900 shadow-xl shadow-slate-900/5") 
                                : "bg-white border-slate-100 text-slate-300 hover:border-slate-200 hover:bg-slate-50"}`}
                          >
                            <span className="text-xl">{a === "GOLD" ? "🟡" : "⚪"}</span>
                            <span className="font-black text-[11px] tracking-widest uppercase">{a} Node</span>
                            {form.asset === a && (
                              <motion.div layoutId="sip-active" className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-xl ${a === "GOLD" ? "bg-[#BA943A]" : "bg-slate-900"}`}>
                                <CheckCircle2 size={16} strokeWidth={3} />
                              </motion.div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5">Cycle Displacement (Amount)</label>
                      <div className="relative">
                        <span className="absolute left-7 top-1/2 -translate-y-1/2 text-3xl font-serif font-black text-[#BA943A]">₹</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={form.amountPerMonth}
                          onChange={(e) => setForm({ ...form, amountPerMonth: e.target.value })}
                          className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] py-6 pl-14 pr-8 font-serif text-4xl font-black text-slate-900 outline-none focus:bg-white focus:border-[#BA943A]/40 transition-all placeholder:opacity-20 shadow-inner"
                        />
                      </div>
                      <div className="flex flex-wrap gap-3 mt-5">
                        {[500, 1000, 2000, 5000].map((a) => (
                          <button
                            key={a}
                            onClick={() => setForm({ ...form, amountPerMonth: String(a) })}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all
                              ${Number(form.amountPerMonth) === a 
                                ? "bg-slate-900 text-[#BA943A] border-slate-900 shadow-xl" 
                                : "bg-white text-slate-400 border-slate-100 hover:border-[#BA943A] hover:text-[#BA943A]"}`}
                          >
                            ₹{fmt(a)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-10">
                    {/* Date Picker */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5">Debit Synchronization Day</label>
                      <div className="grid grid-cols-7 gap-2.5">
                        {DAYS.map((d) => (
                          <button
                            key={d}
                            onClick={() => setForm({ ...form, dayOfMonth: d })}
                            className={`w-full aspect-square rounded-xl text-[11px] font-black flex items-center justify-center transition-all duration-500
                              ${form.dayOfMonth === d 
                                ? "bg-slate-900 text-[#BA943A] shadow-xl shadow-slate-900/40 scale-110 rotate-3" 
                                : "bg-slate-50 text-slate-300 hover:bg-slate-100 hover:text-slate-600"}`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preview / CTA */}
                    <div className="p-10 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#BA943A]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                      
                      <div className="flex items-center gap-4 mb-6">
                         <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#BA943A]">
                            <Zap size={20} fill="currentColor" />
                         </div>
                         <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Subscription Intelligence</p>
                      </div>
                      
                      <p className="text-base font-medium leading-relaxed italic text-white/80">
                        On the <span className="text-[#BA943A] font-black underline decoration-2 decoration-offset-4">{ordinal(form.dayOfMonth)}</span> of every month, 
                        a sum of <span className="text-[#BA943A] font-black">₹{fmt(form.amountPerMonth || 0)}</span> will be 
                        automatically displacement into <span className="text-[#BA943A] font-black">{form.asset}</span> units.
                      </p>
                      
                      <button
                        onClick={handleCreate}
                        disabled={loading || !form.amountPerMonth || Number(form.amountPerMonth) <= 0}
                        className={`w-full mt-10 py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 active:scale-95
                          ${!form.amountPerMonth || Number(form.amountPerMonth) <= 0
                            ? "bg-white/5 text-white/20 cursor-not-allowed"
                            : "bg-[#BA943A] text-black hover:bg-white shadow-2xl shadow-yellow-900/20"}`}
                      >
                        {loading ? <RefreshCcw size={20} className="animate-spin" /> : <><ShieldCheck size={20} strokeWidth={3} /> Authorize Cycle</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SIP Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {sips.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 py-32 bg-white rounded-[4rem] border border-slate-100 text-center shadow-inner">
              <div className="w-24 h-24 rounded-[3rem] bg-slate-50 flex items-center justify-center mx-auto mb-8 shadow-sm">
                <RefreshCcw size={40} className="text-slate-200" strokeWidth={1} />
              </div>
              <h3 className="font-serif text-3xl font-black text-slate-900 tracking-tight mb-4">No Operational Cycles</h3>
              <p className="text-slate-400 font-medium italic max-w-sm mx-auto px-6">Initiate your disciplined asset accumulation protocol by creating a new cycle above.</p>
            </div>
          ) : (
            sips.map((sip) => (
              <SipCard 
                key={sip._id} 
                sip={sip} 
                onPause={(id) => dispatch(pauseSip(id))}
                onResume={(id) => dispatch(resumeSip(id))}
                onDelete={(id) => dispatch(deleteSip(id))}
              />
            ))
          )}
        </div>
      </div>
    </UserLayout>
  );
}
