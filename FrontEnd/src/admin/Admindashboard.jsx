import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  TrendingUp, 
  Clock, 
  ShieldCheck,
  Zap,
  Activity,
  History as HistoryIcon
} from "lucide-react";
import { fetchAdminStats } from "../slice/Adminslice";
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

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, recentTrades, loading, error } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const overviewStats = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12%" },
    { label: "Active Trades", value: stats?.totalTransactions || 0, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+5.4%" },
    { label: "Gold Volume", value: stats?.breakdown?.buyGold + stats?.breakdown?.sellGold || 0, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", trend: "+8.2%" },
    { label: "Silver Volume", value: stats?.breakdown?.buySilver + stats?.breakdown?.sellSilver || 0, icon: ShieldCheck, color: "text-slate-500", bg: "bg-slate-500/10", trend: "+2.1%" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">System Overview</h1>
            <p className="text-slate-500 mt-1 font-medium">Real-time performance metrics and platform activities</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                Export Data
             </button>
             <button className="bg-[#0F172A] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                Refresh Stats
             </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-600 text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="h-96 flex items-center justify-center">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
               className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"
             />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {overviewStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                      <stat.icon size={24} />
                    </div>
                    <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                      {stat.trend} <ArrowUpRight size={12} />
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <h3 className="text-3xl font-serif font-bold text-slate-900">{stat.value}</h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Grid: Transactions and Performance */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Transactions Table */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                        <HistoryIcon size={20} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">Recent Trades</h2>
                        <p className="text-xs text-slate-400 font-medium tracking-tight">Last 10 platform activities</p>
                      </div>
                   </div>
                   <button className="text-amber-600 text-xs font-bold hover:underline">View All</button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50">
                      <tr>
                        {["Execution Date", "Client", "Operation", "Asset", "Amount", "Status"].map((h) => (
                          <th key={h} className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {recentTrades?.length === 0 ? (
                         <tr>
                           <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium italic">No recent activities available.</td>
                         </tr>
                      ) : (
                        recentTrades?.map((tx) => (
                          <motion.tr 
                            whileHover={{ backgroundColor: "rgba(248,250,252,0.5)" }}
                            key={tx._id} 
                            className="group transition-colors"
                          >
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-700">{fmtDate(tx.createdAt)}</span>
                                <span className="text-[10px] text-slate-400 font-medium mt-0.5">{fmtTime(tx.createdAt)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                                  {tx.user?.userName?.[0]?.toUpperCase() || "U"}
                                </div>
                                <span className="text-sm font-semibold text-slate-900">{tx.user?.userName || "Anonymous"}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-tight uppercase ${
                                tx.type.startsWith("BUY") 
                                  ? "bg-rose-50 text-rose-600 border border-rose-100" 
                                  : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              }`}>
                                <div className={`w-1 h-1 rounded-full ${tx.type.startsWith("BUY") ? "bg-rose-500" : "bg-emerald-500"}`} />
                                {tx.type}
                              </span>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${tx.asset === 'GOLD' ? 'bg-amber-400' : 'bg-slate-400'}`} />
                                <span className="text-sm font-bold text-slate-600">{tx.asset}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap font-bold text-slate-900">
                              ₹{fmt(tx.amount)}
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className={`text-[11px] font-bold ${tx.status === "SUCCESS" ? "text-emerald-500" : "text-amber-500"}`}>
                                ● {tx.status || "SUCCESS"}
                              </span>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Sidebar Cards: KYC/Prices info */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-[#0F172A] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                    <ShieldCheck size={120} />
                  </div>
                  <h3 className="text-lg font-bold relative z-10">Pending Verifications</h3>
                  <p className="text-slate-400 text-sm mt-1 relative z-10">KYC requests requiring attention</p>
                  
                  <div className="mt-8 flex items-end justify-between relative z-10">
                     <span className="text-5xl font-serif font-bold text-amber-500">{stats?.pendingKyc || 0}</span>
                     <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                        Review Now
                     </button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-slate-900">Asset Valuation</h3>
                      <TrendingUp size={18} className="text-slate-400" />
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                         <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            <span className="text-sm font-bold text-slate-700">Gold (24K)</span>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">₹{fmt(64500)}</p>
                            <p className="text-[10px] text-emerald-500 font-bold">+1.5%</p>
                         </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                         <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-slate-400" />
                            <span className="text-sm font-bold text-slate-700">Silver (Fine)</span>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">₹{fmt(78200)}</p>
                            <p className="text-[10px] text-rose-500 font-bold">-0.2%</p>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
