import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
   TrendingUp,
   TrendingDown,
   RefreshCw,
   ShieldCheck,
   AlertTriangle,
   History as HistoryIcon,
   CheckCircle2,
   XCircle,
   IndianRupee,
   Clock,
   ArrowUpRight,
   ArrowDownRight,
   Target
} from "lucide-react";
import { setGoldPrice, setSilverPrice } from "../slice/Adminslice";
import { fetchCurrentPrices, fetchPriceHistory } from "../slice/Priceslice";
import AdminLayout from "./adminLayout";

const fmt = (n) =>
   Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtDate = (d) =>
   new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
   });
const fmtTime = (d) =>
   new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
   });

export default function PriceManagement() {
   const dispatch = useDispatch();

   const { current, history } = useSelector((s) => s.price);
   const { loading, error, successMessage } = useSelector((s) => s.admin);

   const [goldInput, setGoldInput] = useState("");
   const [silverInput, setSilverInput] = useState("");
   const [goldConfirm, setGoldConfirm] = useState(false);
   const [silverConfirm, setSilverConfirm] = useState(false);
   const [activeHistory, setActiveHistory] = useState("GOLD");
   const [isRefreshing, setIsRefreshing] = useState(false);

   useEffect(() => {
      dispatch(fetchCurrentPrices());
      dispatch(fetchPriceHistory({ asset: "GOLD", limit: 10 }));
      dispatch(fetchPriceHistory({ asset: "SILVER", limit: 10 }));
   }, [dispatch]);

   const handleSetGold = () => {
      if (!goldInput || parseFloat(goldInput) <= 0) return;
      dispatch(setGoldPrice({ pricePerGram: parseFloat(goldInput) }));
      setGoldInput("");
      setGoldConfirm(false);
   };

   const handleSetSilver = () => {
      if (!silverInput || parseFloat(silverInput) <= 0) return;
      dispatch(setSilverPrice({ pricePerGram: parseFloat(silverInput) }));
      setSilverInput("");
      setSilverConfirm(false);
   };

   const currentGold = current.gold?.pricePerGram ?? 0;
   const currentSilver = current.silver?.pricePerGram ?? 0;

   const goldChange = goldInput && currentGold ? (((parseFloat(goldInput) - currentGold) / currentGold) * 100).toFixed(2) : null;
   const silverChange = silverInput && currentSilver ? (((parseFloat(silverInput) - currentSilver) / currentSilver) * 100).toFixed(2) : null;

   const historyData = activeHistory === "GOLD" ? history.gold || [] : history.silver || [];

   const auditLog = [
      ...(history.gold || []).map(e => ({ ...e, type: 'GOLD' })),
      ...(history.silver || []).map(e => ({ ...e, type: 'SILVER' }))
   ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 15);

   return (
      <AdminLayout>
         <div className="max-w-[1600px] mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <RefreshCw className="text-amber-500 animate-spin-slow" size={20} />
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Market Control</h3>
                  </div>
                  <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Price Propagation</h1>
               </div>

               <div className="flex items-center gap-3">
                  <button
                     onClick={() => {
                        setIsRefreshing(true);
                        dispatch(fetchCurrentPrices());
                        dispatch(fetchPriceHistory({ asset: "GOLD", limit: 10 }));
                        dispatch(fetchPriceHistory({ asset: "SILVER", limit: 10 }));
                        setTimeout(() => setIsRefreshing(false), 1000);
                     }}
                     className="bg-white border border-slate-200 p-3 rounded-2xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm group active:scale-95"
                     title="Refresh Market Data"
                  >
                     <RefreshCw 
                        size={20} 
                        className={`${isRefreshing ? "animate-spin" : "group-hover:rotate-180"} transition-all duration-700 ease-in-out`} 
                     />
                  </button>
                  <div className="bg-[#0F172A] text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-xl">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     LIVE MARKET FEED ACTIVE
                  </div>
               </div>
            </div>

            {/* Real-time Tickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Gold Ticker */}
               <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl"
               >
                  <div className="absolute top-0 right-0 p-16 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                     <Target size={200} className="text-amber-500" />
                  </div>

                  <div className="relative z-10">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Current Trading Rate [AU-24K]</p>
                     <div className="flex items-baseline gap-4">
                        <h2 className="text-6xl font-black text-amber-500 tracking-tighter italic">₹{fmt(currentGold)}</h2>
                        <span className="text-sm font-bold text-slate-400">/ PER GRAM</span>
                     </div>

                     <div className="mt-10 flex items-center gap-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                           <Clock size={14} className="text-slate-500" />
                           <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{current.gold?.updatedAt ? fmtTime(current.gold.updatedAt) : 'LIVE'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400">
                           <TrendingUp size={16} />
                           <span className="text-xs font-bold font-mono">+0.24% MARKET AVG</span>
                        </div>
                     </div>
                  </div>
               </motion.div>

               {/* Silver Ticker */}
               <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-xl border border-white"
               >
                  <div className="absolute top-0 right-0 p-16 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                     <Target size={200} className="text-slate-900" />
                  </div>

                  <div className="relative z-10">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Current Trading Rate [AG-925]</p>
                     <div className="flex items-baseline gap-4">
                        <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic">₹{fmt(currentSilver)}</h2>
                        <span className="text-sm font-bold text-slate-500">/ PER GRAM</span>
                     </div>

                     <div className="mt-10 flex items-center gap-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-black/5 rounded-xl border border-black/5">
                           <Clock size={14} className="text-slate-400" />
                           <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{current.silver?.updatedAt ? fmtTime(current.silver.updatedAt) : 'LIVE'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-rose-500">
                           <TrendingDown size={16} />
                           <span className="text-xs font-bold font-mono">-0.12% MARKET AVG</span>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>

            {/* Update Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-8">
                  {/* Force Adjust Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Gold Adjust */}
                     <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                           <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-inner">
                              <TrendingUp size={20} />
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-900">Adjust Gold Floor</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Manual Price Override</p>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div className="relative">
                              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 tracking-tighter">₹</span>
                              <input
                                 type="number"
                                 placeholder="0.00"
                                 value={goldInput}
                                 onChange={(e) => { setGoldInput(e.target.value); setGoldConfirm(false); }}
                                 className="w-full bg-slate-50 border-none rounded-3xl py-6 pl-14 pr-6 text-2xl font-black text-slate-900 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                              />
                           </div>

                           {goldChange !== null && (
                              <div className={`p-4 rounded-2xl border flex items-center justify-between font-bold text-xs ${parseFloat(goldChange) >= 0 ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"}`}>
                                 <span>Projected Market Shift</span>
                                 <div className="flex items-center gap-1">
                                    {parseFloat(goldChange) >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {goldChange}%
                                 </div>
                              </div>
                           )}

                           <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <input
                                 type="checkbox"
                                 checked={goldConfirm}
                                 onChange={(e) => setGoldConfirm(e.target.checked)}
                                 className="mt-1 w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
                              />
                              <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">I authorize the immediate manual override of global gold prices across the entire platform.</p>
                           </div>

                           <button
                              onClick={handleSetGold}
                              disabled={!goldConfirm || loading || !goldInput}
                              className={`w-full py-5 rounded-[1.5rem] font-black text-sm tracking-[0.1em] transition-all shadow-xl ${goldConfirm && goldInput
                                 ? "bg-[#0F172A] text-white shadow-slate-200 hover:-translate-y-1"
                                 : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
                                 }`}
                           >
                              {loading ? "PROPAGATING..." : "COMMIT GOLD PRICE"}
                           </button>
                        </div>
                     </div>

                     {/* Silver Adjust */}
                     <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                           <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center shadow-inner">
                              <TrendingDown size={20} />
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-900">Adjust Silver Floor</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Manual Price Override</p>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div className="relative">
                              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 tracking-tighter">₹</span>
                              <input
                                 type="number"
                                 placeholder="0.00"
                                 value={silverInput}
                                 onChange={(e) => { setSilverInput(e.target.value); setSilverConfirm(false); }}
                                 className="w-full bg-slate-50 border-none rounded-3xl py-6 pl-14 pr-6 text-2xl font-black text-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all outline-none"
                              />
                           </div>

                           {silverChange !== null && (
                              <div className={`p-4 rounded-2xl border flex items-center justify-between font-bold text-xs ${parseFloat(silverChange) >= 0 ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"}`}>
                                 <span>Projected Market Shift</span>
                                 <div className="flex items-center gap-1">
                                    {parseFloat(silverChange) >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {silverChange}%
                                 </div>
                              </div>
                           )}

                           <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <input
                                 type="checkbox"
                                 checked={silverConfirm}
                                 onChange={(e) => setSilverConfirm(e.target.checked)}
                                 className="mt-1 w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
                              />
                              <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">I authorize the immediate manual override of global silver prices across the entire platform.</p>
                           </div>

                           <button
                              onClick={handleSetSilver}
                              disabled={!silverConfirm || loading || !silverInput}
                              className={`w-full py-5 rounded-[1.5rem] font-black text-sm tracking-[0.1em] transition-all shadow-xl ${silverConfirm && silverInput
                                 ? "bg-[#0F172A] text-white shadow-slate-200 hover:-translate-y-1"
                                 : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
                                 }`}
                           >
                              {loading ? "PROPAGATING..." : "COMMIT SILVER PRICE"}
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Warnings & Messages */}
                  <AnimatePresence>
                     {(successMessage || error) && (
                        <motion.div
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           className={`p-6 rounded-3xl border flex items-center gap-5 shadow-lg ${error ? "bg-rose-50 border-rose-100 text-rose-600 shadow-rose-200/20" : "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-emerald-200/20"
                              }`}
                        >
                           <div className={`p-3 rounded-2xl ${error ? "bg-rose-100" : "bg-emerald-100"}`}>
                              {error ? <XCircle size={24} /> : <CheckCircle2 size={24} />}
                           </div>
                           <div>
                              <p className="text-xs font-bold uppercase tracking-widest mb-1">{error ? "Transmission Failed" : "Transmission Successful"}</p>
                              <h4 className="text-sm font-black italic">{error || successMessage}</h4>
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>

                  <div className="bg-amber-50 rounded-3xl border border-amber-100 p-8 flex items-start gap-6">
                     <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                        <AlertTriangle size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-amber-800 text-sm italic mb-2 tracking-tight">Proprietary Override Protocol</h4>
                        <p className="text-[11px] text-amber-700/70 font-bold uppercase leading-relaxed tracking-tighter">
                           MANUAL DATA INJECTION WILL SUPERSEDE ALL AUTO-CRON SYNC DATA UNTIL THE NEXT SCHEDULED POLLING CYCLE [EVERY 120 MINUTES]. AUDIT LOGS WILL RECORD ALL USER TERMINAL OVERRIDES.
                        </p>
                     </div>
                  </div>
               </div>

               {/* History Column */}
               <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[700px]">
                  <div className="p-8 border-b border-slate-100">
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                           <HistoryIcon className="text-slate-400" size={20} />
                           <h4 className="font-bold text-slate-900 tracking-tighter italic">Ledger History</h4>
                        </div>
                        <div className="flex p-1 bg-slate-50 border border-slate-100 rounded-xl">
                           <button
                              onClick={() => setActiveHistory("GOLD")}
                              className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${activeHistory === 'GOLD' ? 'bg-[#0F172A] text-white shadow-lg' : 'text-slate-400'}`}
                           >
                              AU
                           </button>
                           <button
                              onClick={() => setActiveHistory("SILVER")}
                              className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${activeHistory === 'SILVER' ? 'bg-[#0F172A] text-white shadow-lg' : 'text-slate-400'}`}
                           >
                              AG
                           </button>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">
                        <span>Valuation</span>
                        <span className="text-right">Timestamp</span>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                     {historyData.map((entry, i) => (
                        <motion.div
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: i * 0.05 }}
                           key={entry._id || i}
                           className="group flex items-center justify-between p-5 rounded-[1.5rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                        >
                           <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic text-xs ${activeHistory === 'GOLD' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                                 ₹
                              </div>
                              <div>
                                 <h5 className="text-sm font-black text-slate-900 tracking-tight italic">₹{fmt(entry.pricePerGram)}</h5>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase">Rate/Gram</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-xs font-bold text-slate-700 italic tracking-tight">{fmtDate(entry.createdAt)}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{fmtTime(entry.createdAt)}</p>
                           </div>
                        </motion.div>
                     ))}

                     {historyData.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                           <HistoryIcon size={48} className="opacity-20 mb-4" />
                           <p className="text-[10px] font-bold uppercase tracking-[0.2em]">No Ledger Entries Found</p>
                        </div>
                     )}
                  </div>

                  <div className="p-8 bg-slate-50 border-t border-slate-100">
                     <button className="w-full py-4 border-2 border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all">
                        Export Full Historical Audit
                     </button>
                  </div>
               </div>

               {/* Audit Log Column */}
               <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[700px]">
                  <div className="p-8 border-b border-slate-100">
                     <div className="flex items-center gap-3">
                        <HistoryIcon className="text-slate-400" size={20} />
                        <h4 className="font-bold text-slate-900 tracking-tighter italic">Audit Log</h4>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                     {auditLog.map((entry, i) => (
                        <motion.div
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: i * 0.05 }}
                           key={entry._id || i}
                           className="group flex items-center justify-between p-5 rounded-[1.5rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                        >
                           <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic text-xs ${entry.type === 'GOLD' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                                 ₹
                              </div>
                              <div>
                                 <h5 className="text-sm font-black text-slate-900 tracking-tight italic">₹{fmt(entry.pricePerGram)}</h5>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase">Rate/Gram</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-xs font-bold text-slate-700 italic tracking-tight">{fmtDate(entry.createdAt)}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{fmtTime(entry.createdAt)}</p>
                           </div>
                        </motion.div>
                     ))}

                     {auditLog.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                           <HistoryIcon size={48} className="opacity-20 mb-4" />
                           <p className="text-[10px] font-bold uppercase tracking-[0.2em]">No Audit Entries Found</p>
                        </div>
                     )}
                  </div>

                  <div className="p-8 bg-slate-50 border-t border-slate-100">
                     <button className="w-full py-4 border-2 border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all">
                        Export Full Historical Audit
                     </button>
                  </div>
               </div>
            </div>
         </div>
         <style>{`
        .animate-spin-slow {
           animation: spin 8s linear infinite;
        }
        @keyframes spin {
           from { transform: rotate(0deg); }
           to { transform: rotate(360deg); }
        }
      `}</style>
      </AdminLayout>
   );
}
