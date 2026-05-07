import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../slice/Transactionslice";
import UserLayout from "./userLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  X, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock,
  ArrowRight,
  ChevronRight,
  Info,
  Package,
  History,
  Zap,
  ReceiptText,
  Coins,
  ShieldCheck,
  Activity,
  ArrowUpRight
} from "lucide-react";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtG = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 4 });
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = (d) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const TYPE_CONFIG = {
  BUY_GOLD: { label: "Gold Acquisition", icon: <TrendingUp className="text-rose-500 rotate-180" size={18} />, bg: "bg-rose-50", border: "border-rose-100" },
  SELL_GOLD: { label: "Gold Liquidation", icon: <TrendingUp className="text-emerald-600" size={18} />, bg: "bg-emerald-50", border: "border-emerald-100" },
  BUY_SILVER: { label: "Silver Acquisition", icon: <TrendingUp className="text-rose-500 rotate-180" size={18} />, bg: "bg-rose-50", border: "border-rose-100" },
  SELL_SILVER: { label: "Silver Liquidation", icon: <TrendingUp className="text-emerald-600" size={18} />, bg: "bg-emerald-50", border: "border-emerald-100" },
  REDEEM_GOLD: { label: "Gold Redemption", icon: <Package className="text-indigo-600" size={18} />, bg: "bg-indigo-50", border: "border-indigo-100" },
  REDEEM_SILVER: { label: "Silver Redemption", icon: <Package className="text-indigo-600" size={18} />, bg: "bg-indigo-50", border: "border-indigo-100" },
};

const FILTERS = ["All", "Gold Acquisition", "Gold Liquidation", "Silver Acquisition", "Silver Liquidation"];

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((s) => s.transaction);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { dispatch(fetchTransactions()); }, [dispatch]);

  const filtered = transactions
    .filter((tx) => filter === "All" || TYPE_CONFIG[tx.type]?.label === filter)
    .filter((tx) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return tx.type.toLowerCase().includes(s) || tx.asset?.toLowerCase().includes(s) || String(tx.amount).includes(s);
    })
    .sort((a, b) => sortDesc ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt));

  const totalBought = transactions.filter(tx => tx.type.startsWith("BUY")).reduce((s, tx) => s + (tx.amount || 0), 0);
  const totalSold = transactions.filter(tx => tx.type.startsWith("SELL")).reduce((s, tx) => s + (tx.amount || 0), 0);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <UserLayout active="/user/transactions">
      <div className="space-y-12 max-w-7xl mx-auto">

        {/* Header Section (Staff-Matched) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight leading-none mb-3">
               Trade Ledger<span className="text-amber-500">.</span>
            </h1>
            <p className="text-slate-500 font-medium flex items-center gap-2.5">
               <Zap size={18} className="text-[#BA943A]" />
               Financial Audit
               <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-2" />
               <Activity size={16} className="text-emerald-500" />
               Live Displacement
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6 bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm"
          >
             <div className="px-6 py-1 border-r border-slate-100">
                <p className="text-slate-400 text-[9px] font-black tracking-widest uppercase mb-1">Total Inflow</p>
                <p className="font-serif font-black text-emerald-600 text-xl">₹{fmt(totalSold)}</p>
             </div>
             <div className="px-6 py-1">
                <p className="text-slate-400 text-[9px] font-black tracking-widest uppercase mb-1">Total Outflow</p>
                <p className="font-serif font-black text-rose-500 text-xl">₹{fmt(totalBought)}</p>
             </div>
          </motion.div>
        </div>

        {/* Key Metrics (Staff-Matched Scale) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Operation Volume", value: `₹${fmt(totalBought + totalSold)}`, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Asset Displacement", value: `${fmtG(transactions.reduce((s,tx) => s+(tx.grams||0), 0))}g`, icon: Package, color: "text-slate-900", bg: "bg-slate-100" },
            { label: "Ledger Entries", value: transactions.length, icon: History, color: "text-[#BA943A]", bg: "bg-yellow-50" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
               <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform ${stat.bg}`}>
                    <stat.icon className={stat.color} size={26} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-widest font-black text-slate-400 mb-1.5">{stat.label}</p>
                    <h3 className="text-3xl font-serif font-black text-slate-900 tracking-tight">{stat.value}</h3>
                  </div>
               </div>
               <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={18} className="text-slate-200" />
               </div>
            </motion.div>
          ))}
        </div>

        {/* Filter Matrix (Staff-Matched) */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Lookup asset, ID, or amount..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-[13px] font-extrabold focus:outline-none focus:border-[#BA943A]/40 transition-all"
              />
            </div>

            <div className="flex bg-slate-50 p-1.5 rounded-[1.25rem] border border-slate-100 overflow-x-auto w-full lg:w-auto no-scrollbar">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all
                    ${filter === f ? "bg-white text-slate-900 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setSortDesc(!sortDesc)}
              className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95"
            >
              <ArrowUpDown size={14} />
              {sortDesc ? "Latest" : "Earliest"}
            </button>
        </div>

        {/* Ledger Table (Staff-Matched Scale) */}
        <div className="bg-white rounded-[3rem] border border-slate-200/80 shadow-sm overflow-hidden relative">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-[#BA943A]/10 border-t-[#BA943A] rounded-full animate-spin" />
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Syncing Ledger...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black text-slate-400">Operation</th>
                    <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black text-slate-400">Mass (g)</th>
                    <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black text-slate-400">Quote</th>
                    <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black text-slate-400">Displacement</th>
                    <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black text-slate-400">Status</th>
                    <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black text-slate-400 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {filtered.map((tx) => {
                    const cfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG.BUY_GOLD;
                    const isNeg = tx.type.startsWith("BUY");
                    const isOpen = expanded === tx._id;
                    
                    return (
                      <React.Fragment key={tx._id}>
                        <tr 
                          onClick={() => setExpanded(isOpen ? null : tx._id)}
                          className={`group hover:bg-slate-50/80 cursor-pointer transition-colors ${isOpen ? "bg-slate-50/80" : ""}`}
                        >
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                                {cfg.icon}
                              </div>
                              <div>
                                <p className="text-[14px] font-black text-slate-900 tracking-tight uppercase">{cfg.label}</p>
                                <p className="text-[9px] font-black text-slate-300 tracking-widest uppercase mt-0.5">{tx.asset} Pure</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-2 font-serif font-black text-slate-900 text-lg">
                                {fmtG(tx.grams)}
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <div className="space-y-1 text-[11px] font-extrabold text-slate-600 uppercase tracking-tight">
                                <div className="flex gap-2"><span className="text-slate-300 w-10 font-black text-[8px]">Base:</span> ₹{fmt(tx.amount)}</div>
                                <div className="flex gap-2"><span className="text-slate-300 w-10 font-black text-[8px]">Rate:</span> ₹{fmt(tx.pricePerGram)}/g</div>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <div className={`text-xl font-serif font-black tracking-tighter ${isNeg ? "text-rose-500" : "text-emerald-600"}`}>
                                {isNeg ? "−" : "+"}₹{fmt(tx.totalAmount || tx.amount)}
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                <ShieldCheck size={10} /> {tx.status || 'Settled'}
                             </div>
                          </td>
                          <td className="px-10 py-8 text-right">
                             <div className="text-[12px] font-black text-slate-900">{fmtDate(tx.createdAt)}</div>
                             <div className="text-[10px] font-bold text-slate-300 mt-0.5">{fmtTime(tx.createdAt)}</div>
                          </td>
                        </tr>
                        
                        <AnimatePresence>
                          {isOpen && (
                            <tr>
                              <td colSpan="6" className="px-10 py-0">
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden border-x border-slate-100 bg-slate-50/30"
                                >
                                  <div className="p-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
                                    {[
                                      { label: "Ledger ID", value: tx._id, full: true },
                                      { label: "Market Displacement", value: `₹${fmt(tx.pricePerGram)}/g`, icon: <TrendingUp size={14} /> },
                                      { label: "Classification", value: tx.asset === "GOLD" ? "Aureum" : "Argentum", icon: <Coins size={14} /> },
                                      { label: "Node Verification", value: "Sovereign Audit", icon: <Zap size={14} />, color: "text-emerald-600" },
                                      { label: "Audit UUID", value: `LN-${tx._id?.slice(-8).toUpperCase()}`, icon: <ReceiptText size={14} /> },
                                    ].map((item, idx) => (
                                      <div key={idx} className={item.full ? "col-span-full pb-6 mb-4 border-b border-slate-200/50" : ""}>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                                          {item.icon} {item.label}
                                        </p>
                                        <p className={`font-serif font-black text-slate-900 ${item.full ? "text-xl" : "text-lg"} tracking-tight ${item.color || ""}`}>
                                          {item.value}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </UserLayout>
  );
}