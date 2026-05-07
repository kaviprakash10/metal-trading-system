import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPortfolio } from "../slice/Portfolioslice";
import { fetchCurrentPrices } from "../slice/Priceslice";
import { fetchWallet } from "../slice/Walletslice";
import UserLayout from "./userLayout";
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  ArrowUpRight, 
  Wallet, 
  BarChart3, 
  PieChart,
  ArrowRight,
  Package,
  History,
  Activity,
  Zap,
  Globe,
  Coins,
  Sparkles,
  Layers,
  ArrowRightCircle
} from "lucide-react";
import { motion } from "framer-motion";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtG = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 4 });

function AllocationVisual({ goldValue, silverValue }) {
  const total = goldValue + silverValue;
  const goldPct = total > 0 ? ((goldValue / total) * 100).toFixed(1) : 0;
  const silverPct = total > 0 ? ((silverValue / total) * 100).toFixed(1) : 0;
  
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
      <div className="flex items-center gap-2 mb-8 relative z-10">
        <PieChart className="text-[#BA943A]" size={16} />
        <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Capital Allocation</span>
      </div>

      <div className="flex items-end gap-2 h-20 mb-8 relative z-10">
        <motion.div 
          initial={{ height: 0 }}
          whileInView={{ height: `${goldPct}%` }}
          className="flex-1 bg-gradient-to-t from-[#BA943A] to-[#E2C06A] rounded-2xl relative group/bar"
        />
        <motion.div 
          initial={{ height: 0 }}
          whileInView={{ height: `${silverPct}%` }}
          className="flex-1 bg-gradient-to-t from-slate-400 to-slate-200 rounded-2xl relative group/bar"
        />
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#BA943A] shadow-lg shadow-yellow-500/20"></div>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Aureum</span>
          </div>
          <span className="text-slate-900 font-serif text-xl font-black">{goldPct}%</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-lg shadow-slate-400/20"></div>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Argentum</span>
          </div>
          <span className="text-slate-900 font-serif text-xl font-black">{silverPct}%</span>
        </div>
      </div>
    </div>
  );
}

function AssetReport({ asset, data, price, to }) {
  if (!data) return null;
  const isGold = asset === "GOLD";
  const isPos = data.pnl >= 0;
  const accent = isGold ? "text-[#BA943A]" : "text-slate-500";

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full group"
    >
      <div className="p-8 border-b border-slate-50 bg-white">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className={accent} size={14} strokeWidth={3} />
              <span className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">{asset} Inventory</span>
            </div>
            <h3 className={`font-serif text-5xl font-black tracking-tighter ${accent} leading-none`}>
              {fmtG(data.grams)}<span className="text-2xl font-medium text-slate-300 ml-1">g</span>
            </h3>
          </div>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner ${isGold ? 'bg-yellow-50' : 'bg-slate-50'}`}>
             {isGold ? <TrendingUp size={22} className="text-[#BA943A]" /> : <TrendingUp size={22} className="text-slate-400" />}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Valuation</p>
            <p className="font-serif text-xl font-black text-slate-900 tracking-tight">₹{fmt(data.currentValue)}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Net Accrual</p>
            <div className={`flex items-center justify-end gap-1 font-serif text-xl font-black tracking-tight ${isPos ? 'text-emerald-600' : 'text-red-600'}`}>
              {isPos ? "+" : ""}₹{fmt(data.pnl)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-3 bg-slate-50/30">
        {[
          { label: "Cost Basis", value: `₹${fmt(data.invested)}` },
          { label: "ROI", value: <span className={isPos ? "text-emerald-600" : "text-red-600"}>{isPos ? "+" : ""}{data.returnsPercent || 0}%</span> },
          { label: "Live Rate", value: `₹${fmt(price)}/g`, bold: true },
        ].map(({ label, value, bold }) => (
          <div key={label} className="flex justify-between items-center py-2.5 border-b border-dashed border-slate-200 last:border-0">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
            <span className={`text-xs ${bold ? "font-black text-slate-900" : "font-extrabold text-slate-600"}`}>{value}</span>
          </div>
        ))}
        
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Link to={to.buy} className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95 ${isGold ? "bg-slate-900 text-[#BA943A] hover:bg-black" : "bg-slate-700 text-white hover:bg-slate-800"}`}>
            Acquire More <ArrowUpRight size={12} />
          </Link>
          <Link to={to.sell} className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white border border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-[#BA943A] hover:text-[#BA943A] transition-all shadow-sm active:scale-95">
            Liquidate
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const dispatch = useDispatch();
  const { gold, silver, summary, loading } = useSelector((s) => s.portfolio);
  const { current } = useSelector((s) => s.price);
  const { walletBalance } = useSelector((s) => s.wallet);

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchCurrentPrices());
    dispatch(fetchWallet());
  }, [dispatch]);

  const goldPrice = current.gold?.pricePerGram ?? 0;
  const silverPrice = current.silver?.pricePerGram ?? 0;
  
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <UserLayout active="/user/portfolio">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header Section (Staff-Matched) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight leading-none mb-3">
               Asset Portfolio<span className="text-amber-500">.</span>
            </h1>
            <p className="text-slate-500 font-medium flex items-center gap-2.5">
               <ShieldCheck size={18} className="text-[#BA943A]" />
               Audited Reserves
               <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-2" />
               <Activity size={16} className="text-emerald-500" />
               Real-time Valuation
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6 bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm"
          >
             <div className="px-6 py-1 border-r border-slate-100 text-center">
                <p className="text-slate-400 text-[9px] font-black tracking-widest uppercase mb-1">Net Liquidity</p>
                <p className="font-serif font-black text-slate-900 text-2xl tracking-tight">₹{fmt(walletBalance)}</p>
             </div>
             <div className="pr-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                   <Wallet size={22} />
                </div>
             </div>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
             <div className="w-12 h-12 border-4 border-[#BA943A]/10 border-t-[#BA943A] rounded-full animate-spin" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Vaults...</p>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            {/* Left Column: Summary & Assets */}
            <div className="xl:col-span-8 space-y-10">
              
              {/* Executive Summary (Staff-Matched Scale) */}
              <motion.div variants={item} className="relative bg-slate-900 text-white rounded-[2.5rem] p-10 overflow-hidden shadow-2xl group border border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                  <div className="md:col-span-1">
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mb-4">Total Portfolio Value</p>
                    <h2 className="font-serif text-5xl font-black text-[#D8B452] tracking-tighter mb-4">
                      ₹{fmt(summary?.totalCurrentValue)}
                    </h2>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                       <TrendingUp size={12} strokeWidth={3} />
                       {summary?.totalReturnsPercent}% ROI
                    </div>
                  </div>

                  <div className="flex flex-col justify-center border-l border-white/5 pl-10">
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2">Principal Basis</p>
                    <p className="font-serif text-2xl font-black text-white tracking-tight">₹{fmt(summary?.totalInvested)}</p>
                    <p className="mt-2 text-slate-600 text-[8px] font-black uppercase tracking-[0.2em]">Verified Assets</p>
                  </div>

                  <div className="flex flex-col justify-center border-l border-white/5 pl-10">
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2">Net Accrual</p>
                    <p className={`font-serif text-2xl font-black tracking-tight ${summary?.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {summary?.totalPnL >= 0 ? "+" : ""}₹{fmt(summary?.totalPnL)}
                    </p>
                    <p className="mt-2 text-slate-600 text-[8px] font-black uppercase tracking-[0.2em]">Live Displacement</p>
                  </div>
                </div>
              </motion.div>

              {/* Asset Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div variants={item}>
                  <AssetReport asset="GOLD" data={gold} price={goldPrice} to={{ buy: "/user/buy/gold", sell: "/user/sell/gold" }} />
                </motion.div>
                <motion.div variants={item}>
                  <AssetReport asset="SILVER" data={silver} price={silverPrice} to={{ buy: "/user/buy/silver", sell: "/user/sell/silver" }} />
                </motion.div>
              </div>
            </div>

            {/* Right Column: Allocation & Insights */}
            <div className="xl:col-span-4 space-y-10">
               <motion.div variants={item}>
                  <AllocationVisual goldValue={gold?.currentValue ?? 0} silverValue={silver?.currentValue ?? 0} />
               </motion.div>

               {/* Market Intel (Staff-Matched) */}
               <motion.div variants={item} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-[#BA943A]">
                        <Zap size={20} />
                     </div>
                     <div>
                        <h4 className="font-serif text-xl font-black text-slate-900 tracking-tight">Market Intel</h4>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Real-time Observations</p>
                     </div>
                  </div>
                  
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                           <TrendingUp size={18} strokeWidth={3} />
                        </div>
                        <div>
                           <p className="text-xs font-black text-slate-900 mb-1 tracking-tight">Positive Divergence</p>
                           <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">Market technicals suggest strong support at current units.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                           <ShieldCheck size={18} strokeWidth={3} />
                        </div>
                        <div>
                           <p className="text-xs font-black text-slate-900 mb-1 tracking-tight">Vault Protocol</p>
                           <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">Your physical reserves are currently synchronized with LBMA tier-1 custody.</p>
                        </div>
                     </div>
                  </div>
                  
                  <Link to="/user/transactions" className="mt-10 flex items-center justify-center gap-3 w-full py-4 rounded-[1.25rem] bg-slate-50 border border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-[#BA943A] transition-all">
                     Audit History <ArrowRight size={14} />
                  </Link>
               </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </UserLayout>
  );
}
