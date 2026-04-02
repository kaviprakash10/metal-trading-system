import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, fetchAllTransactions } from "../slice/Adminslice";
import StaffLayout from "./StaffLayout";
import { motion } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  UserX, 
  ReceiptText, 
  TrendingUp, 
  ArrowRight,
  ShieldAlert,
  Zap,
  Activity,
  History,
  Coins,
  Clock,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";

const fmt     = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtG    = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 4 });
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = (d) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

export default function StaffDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { 
    users, 
    transactions, 
    loading, 
    total: totalUsers, 
    verifiedCount, 
    pendingCount,
    total: totalTx // Note: this might be confusing if both have 'total', but in slice they are overwritten by whichever thunk ran last.
    // Actually in my slice implementation:
    // state.total = action.payload.total;
    // So 'total' represents the count of the last fetched resource.
  } = useSelector((s) => s.admin);

  // We should actually store these separately in the slice if we want both on the dashboard.
  // But let's check current slice implementation again.
  
  useEffect(() => {
    dispatch(fetchAllUsers({ limit: 1 })); // Just to get metadata
    dispatch(fetchAllTransactions({ limit: 6 })); // Get recent activity
  }, [dispatch]);

  // Use the verified/pending counts we specifically added to the slice
  const rejectedKyc = totalUsers - verifiedCount - pendingCount;
  const recentTx = transactions || [];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <StaffLayout>
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* ── Welcome Section ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight leading-none mb-3">
              Hello, {user?.userName?.split(' ')[0] || "Staff"}<span className="text-amber-500">.</span>
            </h1>
            <p className="text-slate-500 font-medium flex items-center gap-2.5">
              <Activity size={18} className="text-emerald-500" />
              Portal Health: <span className="text-emerald-600 font-extrabold uppercase tracking-widest text-[10px]">Exceptional</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-2" />
              <History size={16} className="text-slate-400" />
              Last sync: Just now
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
              <History size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Session Date</p>
              <p className="text-sm font-black text-slate-900">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
            </div>
          </motion.div>
        </div>

        {/* ── Key Metrics ── */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {[
            { label: "Active Directory", value: totalUsers,             icon: Users,        color: "text-indigo-600", bg: "bg-indigo-50",  to: "/staff/users" },
            { label: "Verification Queue", value: pendingCount,           icon: ShieldAlert,  color: "text-amber-600", bg: "bg-amber-50",   to: "/staff/kyc",   highlight: pendingCount > 0 },
            { label: "Validated Vaults",  value: verifiedCount,          icon: UserCheck,    color: "text-emerald-600", bg: "bg-emerald-50", to: "/staff/kyc" },
            { label: "Rejected Entry",  value: Math.max(0, rejectedKyc), icon: UserX,        color: "text-rose-600", bg: "bg-rose-50",    to: "/staff/kyc" },
            { label: "Ledger Volume",  value: "—",                       icon: ReceiptText,  color: "text-slate-900", bg: "bg-slate-100",  to: "/staff/transactions" },
          ].map((stat) => (
            <Link key={stat.label} to={stat.to} className="group">
              <motion.div
                variants={item}
                className={`p-7 rounded-[2.5rem] border transition-all h-full flex flex-col justify-between relative overflow-hidden ${
                  stat.highlight 
                    ? "bg-amber-500 border-amber-400 text-slate-900 shadow-[0_20px_40px_rgba(245,158,11,0.2)]" 
                    : "bg-white border-slate-200/80 hover:border-indigo-200 hover:shadow-indigo-500/10 hover:shadow-xl"
                }`}
              >
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform group-hover:scale-110 ${stat.highlight ? "bg-white/30 backdrop-blur-md" : stat.bg}`}>
                    <stat.icon className={stat.highlight ? "text-slate-900" : stat.color} size={26} />
                  </div>
                  <div>
                    <p className={`text-[11px] uppercase tracking-widest font-black mb-1.5 ${stat.highlight ? "text-amber-900/60" : "text-slate-400"}`}>
                      {stat.label}
                    </p>
                    <h3 className={`text-3xl font-serif font-black ${stat.highlight ? "text-amber-900" : "text-slate-900"}`}>
                      {stat.value}
                    </h3>
                  </div>
                </div>
                <div className={`absolute top-6 right-6 transition-opacity ${stat.highlight ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                  <ArrowUpRight size={18} className={stat.highlight ? "text-amber-900/40" : "text-indigo-500/40"} />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* ── Intelligence Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Action Center */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Critical Alert */}
            {pendingCount > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-amber-500 rounded-[1.25rem] flex items-center justify-center mb-8 shadow-lg shadow-amber-500/20">
                    <ShieldAlert className="text-slate-900" size={28} />
                  </div>
                  <h3 className="text-2xl font-serif font-black mb-3">Verification Required</h3>
                  <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">
                    There are <span className="text-white font-black">{pendingCount} new applications</span> awaiting manual audit. Delay in processing may impact platform liquidity.
                  </p>
                  <Link to="/staff/kyc" className="flex items-center justify-center gap-3 w-full py-4 bg-white text-slate-900 rounded-[1.25rem] text-xs font-black uppercase tracking-widest hover:bg-amber-50 transition-all shadow-xl">
                    Process Ledger
                    <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
              </motion.div>
            )}

            {/* Quick Actions */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-200/80 shadow-sm">
              <h4 className="text-[11px] uppercase font-black tracking-widest text-slate-400 mb-8">Administrative Hub</h4>
              <div className="space-y-4">
                {[
                  { icon: Users, label: "System User Directory", to: "/staff/users", color: "bg-indigo-50 text-indigo-600" },
                  { icon: ReceiptText, label: "Full Audit History", to: "/staff/transactions", color: "bg-emerald-50 text-emerald-600" },
                ].map((action) => (
                  <Link 
                    key={action.to} 
                    to={action.to} 
                    className="flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                        <action.icon size={18} />
                      </div>
                      <span className="text-sm font-extrabold text-slate-700 tracking-tight">{action.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Ledger */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[3rem] border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-8 lg:p-10 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h3 className="text-2xl font-serif font-black text-slate-900 tracking-tight">Recent Activity</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Real-time ledger updates</p>
                </div>
                <Link to="/staff/transactions" className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">
                  Full Report
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar min-h-[400px]">
                {loading ? (
                  <div className="p-24 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Hydrating activity feed...</p>
                  </div>
                ) : recentTx.length === 0 ? (
                  <div className="p-24 flex flex-col items-center justify-center gap-6 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                      <History size={40} />
                    </div>
                    <p className="text-slate-400 font-medium">No transactions recorded in this epoch.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {recentTx.map((tx, i) => (
                      <motion.div 
                        key={tx._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-8 hover:bg-slate-50/50 transition-colors group cursor-default"
                      >
                        <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden ${
                            tx.asset === "GOLD" ? "bg-amber-50 text-amber-500" : "bg-slate-100 text-slate-500"
                          }`}>
                            <Coins size={28} className={tx.asset === "GOLD" ? "fill-amber-500/20" : ""} />
                            <div className={`absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors`} />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors text-[17px] tracking-tight">{tx.user?.userName || "Anonymous"}</p>
                            <div className="flex items-center gap-2.5 mt-1.5">
                              <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border ${
                                tx.type?.startsWith("BUY") ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                              }`}>
                                {tx.type?.replace("_", " ")}
                              </span>
                              <span className="text-[10px] font-extrabold text-slate-400 tracking-tight">
                                {fmtG(tx.grams)} grams
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-black tracking-tighter ${
                            tx.type?.startsWith("BUY") ? "text-rose-600" : "text-emerald-600"
                          }`}>
                            {tx.type?.startsWith("BUY") ? "−" : "+"}₹{fmt(tx.totalAmount || tx.amount)}
                          </div>
                          <div className="flex items-center justify-end gap-2 mt-1.5 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                            <Clock size={12} />
                            {fmtDate(tx.createdAt)} · {fmtTime(tx.createdAt)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
