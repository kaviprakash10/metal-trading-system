import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowUpRight,
  Wallet,
  RefreshCcw,
  ChevronRight,
  Loader2,
  ArrowRight,
  ClipboardList,
  Sparkles,
  TrendingUp,
  Package,
  History,
  Zap,
  Activity,
  ShieldCheck,
  TrendingDown,
  LayoutGrid,
  Lock,
  Globe,
  Coins,
  Clock
} from "lucide-react";
import { fetchPortfolio } from "../slice/Portfolioslice";
import { fetchTransactions } from "../slice/Transactionslice";
import { fetchCurrentPrices } from "../slice/Priceslice";
import UserLayout from "./userLayout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtG = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 4 });

const Dashboard = () => {
  const dispatch = useDispatch();
  const [greeting, setGreeting] = useState("");

  const { user } = useSelector((state) => state.auth);
  const { gold, silver, summary, loading: portLoading } = useSelector((state) => state.portfolio);
  const { transactions, loading: txLoading } = useSelector((state) => state.transaction);
  const { current, loading: priceLoading } = useSelector((state) => state.price);

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchTransactions());
    dispatch(fetchCurrentPrices());

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, [dispatch]);

  const recentTx = transactions.slice(0, 5);
  const totalAssets = (gold?.grams || 0) + (silver?.grams || 0);
  const isLoading = portLoading || txLoading || priceLoading;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <UserLayout active="/user/dashboard">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Welcome Section (Staff-Matched) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight leading-none mb-3">
               {greeting}, {user?.userName?.split(" ")[0]}
               <span className="text-amber-500">.</span>
            </h1>
            <p className="text-slate-500 font-medium flex items-center gap-2.5">
               <ShieldCheck size={18} className="text-[#BA943A]" />
               Account Status: <span className="text-[#BA943A] font-extrabold uppercase tracking-widest text-[10px]">Verified Node</span>
               <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-2" />
               <Activity size={16} className="text-emerald-500" />
               Market Live
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm"
          >
             <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Clock size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Session Epoch</p>
                <p className="text-sm font-black text-slate-900">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long" })}</p>
             </div>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4 text-center">
             <div className="w-12 h-12 border-4 border-[#BA943A]/10 border-t-[#BA943A] rounded-full animate-spin" />
             <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Hydrating data feed...</p>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-12">
            
            {/* Key Metrics (Staff-Matched) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Net Liquidity", value: `₹${fmt(user?.walletBalance)}`, icon: Wallet, color: "text-[#BA943A]", bg: "bg-yellow-50" },
                { label: "Asset Inventory", value: `${fmtG(totalAssets)}g`, icon: Package, color: "text-slate-900", bg: "bg-slate-100" },
                { label: "Portfolio Value", value: `₹${fmt(summary?.totalCurrentValue)}`, icon: TrendingUp, color: "text-[#BA943A]", bg: "bg-yellow-50" },
                { label: "Net Earnings", value: `₹${fmt(summary?.totalPnL)}`, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
              ].map((stat, i) => (
                <motion.div key={i} variants={item} className="p-7 bg-white rounded-[2.5rem] border border-slate-200/80 hover:border-[#BA943A]/30 transition-all flex flex-col justify-between group">
                   <div>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform ${stat.bg}`}>
                        <stat.icon className={stat.color} size={26} />
                      </div>
                      <p className="text-[11px] uppercase tracking-widest font-black text-slate-400 mb-1.5">{stat.label}</p>
                      <h3 className="text-3xl font-serif font-black text-slate-900 tracking-tight">
                         {stat.value}
                      </h3>
                   </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Intelligence Column */}
              <div className="lg:col-span-1 space-y-8">
                 {/* Action Alert */}
                 <motion.div variants={item} className="p-8 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                       <div className="w-14 h-14 bg-[#BA943A] rounded-[1.25rem] flex items-center justify-center mb-8 shadow-lg shadow-yellow-900/20">
                          <Zap className="text-slate-900" size={28} />
                       </div>
                       <h3 className="text-2xl font-serif font-black mb-3">Market Intelligence</h3>
                       <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">
                          Prices are currently <span className="text-white font-black">stable</span>. Consider increasing your asset mass during this low volatility epoch.
                       </p>
                       <Link to="/user/buy/gold" className="flex items-center justify-center gap-3 w-full py-4 bg-white text-slate-900 rounded-[1.25rem] text-xs font-black uppercase tracking-widest hover:bg-amber-50 transition-all shadow-xl">
                          Redeem Assets <ArrowRight size={16} />
                       </Link>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#BA943A]/10 rounded-full blur-3xl group-hover:bg-[#BA943A]/20 transition-all" />
                 </motion.div>

                 {/* Navigation Hub */}
                 <div className="bg-white p-8 rounded-[3rem] border border-slate-200/80 shadow-sm">
                    <h4 className="text-[11px] uppercase font-black tracking-widest text-slate-400 mb-8">Personnel Hub</h4>
                    <div className="space-y-4">
                       {[
                         { icon: LayoutGrid, label: "Asset Portfolio", to: "/user/portfolio", color: "bg-indigo-50 text-indigo-600" },
                         { icon: ClipboardList, label: "Trade Audit History", to: "/user/transactions", color: "bg-emerald-50 text-emerald-600" },
                         { icon: Lock, label: "Identity & Security", to: "/user/account", color: "bg-slate-100 text-slate-900" },
                       ].map((action) => (
                         <Link key={action.to} to={action.to} className="flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
                            <div className="flex items-center gap-4">
                               <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                                  <action.icon size={18} />
                               </div>
                               <span className="text-sm font-extrabold text-slate-700 tracking-tight">{action.label}</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-[#BA943A] group-hover:translate-x-1 transition-all" />
                         </Link>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Recent Activity (Staff-Matched) */}
              <div className="lg:col-span-2">
                 <div className="bg-white rounded-[3rem] border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="p-8 lg:p-10 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                       <div>
                          <h3 className="text-2xl font-serif font-black text-slate-900 tracking-tight">Recent Activity</h3>
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Real-time ledger updates</p>
                       </div>
                       <Link to="/user/transactions" className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#BA943A] hover:text-black transition-all shadow-xl">Full Audit</Link>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar min-h-[400px]">
                       {recentTx.length === 0 ? (
                         <div className="p-24 flex flex-col items-center justify-center gap-6 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                               <History size={40} />
                            </div>
                            <p className="text-slate-400 font-medium italic">No ledger entries detected in this epoch.</p>
                         </div>
                       ) : (
                         <div className="divide-y divide-slate-50">
                            {recentTx.map((tx, i) => (
                               <motion.div key={tx._id} variants={item} className="flex items-center justify-between p-8 hover:bg-slate-50/50 transition-colors group">
                                  <div className="flex items-center gap-6">
                                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${tx.asset === "GOLD" ? "bg-yellow-50 text-[#BA943A]" : "bg-slate-100 text-slate-500"}`}>
                                        <Coins size={28} className={tx.asset === "GOLD" ? "fill-[#BA943A]/20" : ""} />
                                     </div>
                                     <div>
                                        <p className="font-black text-slate-900 group-hover:text-[#BA943A] transition-colors text-[17px] tracking-tight">{tx.type?.replace("_", " ")}</p>
                                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">{new Date(tx.createdAt).toLocaleDateString()} &bull; Node {tx._id.slice(-6)}</p>
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <div className={`text-xl font-black tracking-tighter ${tx.type?.startsWith("BUY") ? "text-rose-600" : "text-emerald-600"}`}>
                                        {tx.type?.startsWith("BUY") ? "−" : "+"}₹{fmt(tx.totalAmount || tx.amount)}
                                     </div>
                                     <div className="mt-1 text-[10px] font-black text-slate-200 uppercase tracking-widest italic">Authorized</div>
                                  </div>
                               </motion.div>
                            ))}
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            </div>

          </motion.div>
        )}
      </div>
    </UserLayout>
  );
};

export default Dashboard;
