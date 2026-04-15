import { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Download,
  Calendar,
  User as UserIcon,
  ShoppingBag,
  TrendingUp,
  History as HistoryIcon,
  FileText,
  IndianRupee,
  BadgeCheck
} from "lucide-react";
import { fetchAllTransactions } from "../slice/Adminslice";
import AdminLayout from "./adminLayout";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtG = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 4 });
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

const TYPE_CONFIG = {
  BUY_GOLD: { label: "Buy Gold", icon: "🟡", color: "text-rose-500", bg: "bg-rose-50" },
  SELL_GOLD: { label: "Sell Gold", icon: "🟡", color: "text-emerald-500", bg: "bg-emerald-50" },
  BUY_SILVER: { label: "Buy Silver", icon: "⚪", color: "text-rose-500", bg: "bg-rose-50" },
  SELL_SILVER: { label: "Sell Silver", icon: "⚪", color: "text-emerald-500", bg: "bg-emerald-50" },
};

const FILTERS = ["All", "BUY_GOLD", "SELL_GOLD", "BUY_SILVER", "SELL_SILVER"];

export default function AllTransactions() {
  const dispatch = useDispatch();
  const { transactions, loading, error } = useSelector((s) => s.admin);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [assetFilter, setAssetFilter] = useState("All");
  const [sortDesc, setSortDesc] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    dispatch(fetchAllTransactions());
  }, [dispatch]);

  const uniqueUsers = Array.from(new Set((transactions || []).map(tx => tx.user?._id)))
    .map(id => (transactions || []).find(tx => tx.user?._id === id)?.user)
    .filter(u => u && u.userName)
    .sort((a, b) => a.userName.localeCompare(b.userName));

  const filtered = (transactions || [])
    .filter((tx) => {
      if (selectedUser && tx.user?._id !== selectedUser._id) return false;
      if (typeFilter !== "All" && tx.type !== typeFilter) return false;
      if (assetFilter !== "All" && tx.asset !== assetFilter) return false;

      if (search) {
        const s = search.toLowerCase();
        return (
          tx.user?.userName?.toLowerCase().includes(s) ||
          tx.user?.email?.toLowerCase().includes(s) ||
          tx.type?.toLowerCase().includes(s) ||
          tx._id?.toLowerCase().includes(s)
        );
      }
      return true;
    })
    .sort((a, b) =>
      sortDesc
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt),
    );

  const txList = transactions || [];
  const totalBuys = txList.filter((t) => t.type.startsWith("BUY"));
  const totalSells = txList.filter((t) => t.type.startsWith("SELL"));
  const totalVol = txList.reduce((s, t) => s + (t.totalAmount || t.amount || 0), 0);

  const stats = [ 
    { label: "Total Volume", value: `₹${fmt(totalVol)}`, icon: IndianRupee, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Total Orders", value: txList.length, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Buy Orders", value: totalBuys.length, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Sell Orders", value: totalSells.length, icon: HistoryIcon, color: "text-rose-500", bg: "bg-rose-50" },
  ];

  const handleExportCSV = () => {
    if (!filtered || filtered.length === 0) return;
    const headers = ["Order ID", "Date", "User", "Email", "Type", "Asset", "Weight(g)", "Rate", "Base Amount", "GST(3%)", "Total", "Status"];
    const rows = filtered.map(tx => [
      tx._id,
      new Date(tx.createdAt).toLocaleString(),
      tx.user?.userName || "N/A",
      tx.user?.email || "N/A",
      tx.type,
      tx.asset,
      tx.grams,
      tx.pricePerGram,
      tx.amount,
      tx.gstAmount || 0,
      tx.totalAmount || tx.amount,
      tx.status || "SUCCESS"
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.map(cell => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Metal_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction Ledger</h3>
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Financial Records</h1>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportCSV}
              className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm active:scale-95"
            >
              <Download size={18} /> Export CSV
            </button>
            {selectedUser && (
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-amber-500 text-slate-900 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-amber-600 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <ArrowLeft size={18} /> Exit User View
              </button>
            )}
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={s.label}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5"
            >
              <div className={`${s.bg} ${s.color} p-4 rounded-2xl`}>
                <s.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{s.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation & Filters */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search txid, email, or username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 text-sm font-medium outline-none transition-all"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${typeFilter === f
                      ? "bg-[#0F172A] text-white shadow-lg shadow-slate-200"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                >
                  {f.replace("_", " ")}
                </button>
              ))}
            </div>

            <div className="w-px h-6 bg-slate-200 hidden lg:block" />

            {/* Sort Toggle */}
            <button
              onClick={() => setSortDesc(!sortDesc)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold hover:bg-slate-100 transition-all ml-auto"
            >
              <Calendar size={16} />
              {sortDesc ? "Newest First" : "Oldest First"}
            </button>
          </div>

          {!selectedUser ? (
            /* User Listing View */
            <div className="divide-y divide-slate-50">
              <div className="px-8 py-4 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Clients with recorded activity
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-8 bg-slate-50/20">
                {uniqueUsers.map((u, i) => (
                  <motion.div
                    key={u._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                    onClick={() => setSelectedUser(u)}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 font-bold text-xl">
                        {u.userName[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 truncate group-hover:text-amber-600 transition-colors">{u.userName}</h3>
                        <p className="text-xs text-slate-400 truncate font-medium">{u.email}</p>
                      </div>
                      <div className="text-slate-300 group-hover:text-amber-500 transition-all transform group-hover:translate-x-1">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold uppercase tracking-tight flex items-center gap-1">
                        <BadgeCheck size={12} /> Verified Client
                      </div>
                      <div className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter italic">ID: {u._id.slice(-6)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            /* Transactions Table View */
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    {["Trade details", "Operation", "Asset", "Amount Insights", "Total Value", "Status"].map((h) => (
                      <th key={h} className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {filtered.map((tx) => {
                      const cfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG.BUY_GOLD;
                      const isBuy = tx.type.startsWith("BUY");
                      const isExpanded = expanded === tx._id;

                      return (
                        <Fragment key={tx._id}>
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setExpanded(isExpanded ? null : tx._id)}
                            className={`group cursor-pointer transition-all ${isExpanded ? "bg-amber-50/30" : "hover:bg-slate-50"}`}
                          >
                            <td className="px-8 py-5 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 tracking-tighter mb-0.5">#{tx._id.slice(-8).toUpperCase()}</span>
                                <span className="text-sm font-bold text-slate-800">{fmtDate(tx.createdAt)}</span>
                                <span className="text-[10px] text-slate-400 font-medium">{fmtTime(tx.createdAt)}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap">
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-tight ${cfg.bg} ${cfg.color}`}>
                                <span>{cfg.icon}</span>
                                {cfg.label}
                              </div>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-slate-600">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${tx.asset === 'GOLD' ? 'bg-amber-400' : 'bg-slate-300'}`} />
                                {tx.asset}
                              </div>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-700">{fmtG(tx.grams)}g @ ₹{fmt(tx.pricePerGram)}</span>
                                <span className="text-[10px] text-slate-400 font-medium">Base: ₹{fmt(tx.amount)}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-sm font-black text-slate-900 group-hover:scale-105 transition-transform origin-left">
                              ₹{fmt(tx.totalAmount || tx.amount)}
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap">
                              <div className="flex items-center gap-4">
                                <span className={`text-[10px] font-bold ${tx.status === "SUCCESS" ? "text-emerald-500" : "text-amber-500"}`}>
                                  ● {tx.status || "SUCCESS"}
                                </span>
                                {isExpanded ? <ChevronUp size={16} className="text-slate-300" /> : <ChevronDown size={16} className="text-slate-300" />}
                              </div>
                            </td>
                          </motion.tr>

                          {isExpanded && (
                            <tr>
                              <td colSpan="6" className="px-8 pb-8">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  className="bg-white rounded-2xl border border-amber-100 p-6 shadow-inner"
                                >
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                    <div>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Transaction Identity</p>
                                      <p className="text-xs font-mono text-slate-600 font-medium">{tx._id}</p>
                                    </div>
                                    <div>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Taxation Summary</p>
                                      <p className="text-xs text-slate-700 font-bold">{tx.gstAmount > 0 ? `GST (3%): ₹${fmt(tx.gstAmount)}` : 'N/A (Sell Operation)'}</p>
                                    </div>
                                    <div>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Client Profile</p>
                                      <p className="text-xs text-slate-700 font-bold">{tx.user?.userName}</p>
                                      <p className="text-[10px] text-slate-400">{tx.user?.email}</p>
                                    </div>
                                    <div className="text-right">
                                      <button className="text-[10px] font-bold bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 ml-auto">
                                        <FileText size={14} /> Download Invoice
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      )
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                    <Search size={32} />
                  </div>
                  <h3 className="font-bold text-slate-900">No matching records</h3>
                  <p className="text-sm text-slate-400 mt-1 font-medium">Try adjusting your filters or search query</p>
                </div>
              )}
            </div>
          )}

          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing {filtered.length} entries of {txList.length}</p>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors"><ChevronRight className="rotate-180" size={16} /></button>
              <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 shadow-sm">1</div>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
