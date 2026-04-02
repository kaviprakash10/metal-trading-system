import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllUsers } from "../slice/Adminslice";
import StaffLayout from "./StaffLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Mail,
  Wallet,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Calendar,
  ArrowUpDown,
  UserCircle,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Fingerprint,
  Coins,
  ReceiptText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const KYC_CONFIG = {
  VERIFIED: { icon: <ShieldCheck size={14} />, bg: "bg-emerald-50 text-emerald-600 border-emerald-100", label: "Validated" },
  PENDING: { icon: <Clock size={14} />, bg: "bg-amber-50 text-amber-600 border-amber-100", label: "Auditing" },
  REJECTED: { icon: <ShieldX size={14} />, bg: "bg-rose-50 text-rose-600 border-rose-100", label: "Revoked" },
};

export default function StaffUsers() {
  const dispatch = useDispatch();
  const { users, loading, total, totalPages, currentPage, verifiedCount, pendingCount } = useSelector((s) => s.admin);

  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchAllUsers({ page, search, kycStatus: kycFilter, sort: sortBy }));
    }, search ? 500 : 0);
    return () => clearTimeout(timer);
  }, [dispatch, page, search, kycFilter, sortBy]);

  // Reset page on filter changes
  const handleFilterChange = (f) => {
    setKycFilter(f);
    setPage(1);
  };

  const handleSortChange = (s) => {
    setSortBy(s);
    setPage(1);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const stats = {
    total: total,
    verified: verifiedCount,
    pending: pendingCount,
  };

  return (
    <StaffLayout>
      <div className="max-w-7xl mx-auto space-y-10 pb-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/60 pb-8">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100 flex items-center gap-2">
                <Users size={12} />
                Identity Management
              </span>
            </div>
            <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight leading-none">
              User Registry<span className="text-amber-500">.</span>
            </h1>
            <p className="text-slate-500 font-medium mt-3">
              Comprehensive directory of institutional and individual platform participants.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-xl border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-10 h-10 rounded-xl border-2 border-white bg-amber-500 flex items-center justify-center text-[10px] font-black text-white shadow-xl shadow-amber-500/20">
                +{stats.total}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Strategic Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Active Directory", value: stats.total, icon: <Users className="text-indigo-500" />, bg: "bg-indigo-50" },
            { label: "Validated Node", value: stats.verified, icon: <CheckCircle2 className="text-emerald-500" />, bg: "bg-emerald-50" },
            { label: "Awaiting Audit", value: stats.pending, icon: <Clock className="text-amber-500" />, bg: "bg-amber-50" },
            { label: "System Health", value: "99.9%", icon: <ShieldCheck className="text-blue-500" />, bg: "bg-blue-50" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-7 rounded-[2.5rem] border border-slate-200/80 shadow-sm flex items-center gap-6 relative overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center shadow-inner relative z-10`}>
                {stat.icon}
              </div>
              <div className="relative z-10">
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-serif font-black text-slate-900">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Controls */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full text-slate-500">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search Corporate Identifiers, Emails, or Legal Names..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-medium"
              />
            </div>

            {/* Validation Segments */}
            <div className="flex bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-100 overflow-x-auto w-full lg:w-auto no-scrollbar">
              {["All", "VERIFIED", "PENDING", "REJECTED"].map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
                  className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${kycFilter === f
                    ? "bg-white text-slate-900 shadow-sm border border-slate-100"
                    : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Sort Strategy */}
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-6 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500/20 border-none appearance-none cursor-pointer pr-12 relative"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'white\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.5rem center', backgroundSize: '1rem' }}
            >
              <option value="newest">Registration: Latest</option>
              <option value="oldest">Registration: Legacy</option>
              <option value="wallet">Portfolio: Descending</option>
              <option value="name">Alpha: Ascending</option>
            </select>
          </div>
        </div>

        {/* Directory Ledger */}
        <div className="bg-white rounded-[3rem] border border-slate-200/80 shadow-sm overflow-hidden overflow-x-auto">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 border-[5px] border-indigo-500/10 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em] animate-pulse">Accessing Core Identity Database...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-10 py-6 text-[10px] uppercase font-black tracking-[0.3em] text-slate-400">Identification Node</th>
                  <th className="px-10 py-6 text-[10px] uppercase font-black tracking-[0.3em] text-slate-400">Communication</th>
                  <th className="px-10 py-6 text-[10px] uppercase font-black tracking-[0.3em] text-slate-400">Portfolio Status</th>
                  <th className="px-10 py-6 text-[10px] uppercase font-black tracking-[0.3em] text-slate-400">Security Clearance</th>
                  <th className="px-10 py-6 text-[10px] uppercase font-black tracking-[0.3em] text-slate-400">Entry Date</th>
                  <th className="px-10 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {users.map((u, i) => (
                  <motion.tr
                    key={u._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => setSelected(selected?._id === u._id ? null : u)}
                    className={`group hover:bg-slate-50/80 cursor-pointer transition-colors ${selected?._id === u._id ? "bg-indigo-50/50" : ""}`}
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center text-white font-black text-sm shadow-xl group-hover:scale-105 transition-transform">
                          {u.userName[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-serif font-black text-slate-900 text-[15px] tracking-tight leading-none">{u.userName}</p>
                          <p className="text-[9px] font-black tracking-widest text-slate-400 mt-1.5 uppercase opacity-60">ID: {u._id?.slice(-12)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3 text-slate-600 font-bold text-xs tracking-tight">
                        <Mail size={16} className="text-slate-300" />
                        {u.email}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3 font-black text-slate-900 text-sm tracking-tight">
                        <Wallet size={16} className="text-indigo-500" />
                        ₹{fmt(u.walletBalance)}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${KYC_CONFIG[u.kycStatus]?.bg}`}>
                          {KYC_CONFIG[u.kycStatus]?.icon}
                          {KYC_CONFIG[u.kycStatus]?.label}
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-[10px] font-black text-white uppercase tracking-widest border border-slate-800">
                          {u.role}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3 text-slate-500 text-xs font-bold tracking-tight">
                        <Calendar size={16} className="text-slate-300" />
                        {fmtDate(u.createdAt)}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className={`p-2 rounded-xl transition-all border ${selected?._id === u._id ? "bg-slate-900 text-white border-slate-900 rotate-180 shadow-lg" : "text-slate-200 border-slate-100 group-hover:text-slate-400"}`}>
                        <ChevronDown size={20} />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Intelligence */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-10">
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-100 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all text-slate-900"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  // Show current page, first, last, and neighbors
                  if (
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1)
                  ) {
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-12 h-12 rounded-xl text-[11px] font-black tracking-widest transition-all ${page === p
                          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                          : "bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                          }`}
                      >
                        {p}
                      </button>
                    );
                  }
                  if (p === page - 2 || p === page + 2) {
                    return <span key={p} className="w-8 text-center text-slate-300 font-black">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-100 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all text-slate-900"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-400 flex items-center gap-3">
              <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-900">Page {page} of {totalPages}</div>
              <span>•</span>
              <span>Total Registry: {total}</span>
            </div>
          </div>
        )}

        {/* Intelligence Detail Panel (Modal) */}
        <AnimatePresence>
          {selected && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 lg:p-10">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelected(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
              />

              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                className="relative w-full max-w-4xl bg-[#1E293B] rounded-[3.5rem] p-10 text-white shadow-2xl overflow-hidden border border-slate-800 shadow-slate-950/50"
              >
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 border-b border-white/10 pb-10">
                    <div className="flex items-center gap-8">
                      <div className="w-24 h-24 rounded-[2rem] bg-white text-slate-900 flex items-center justify-center text-4xl font-black shadow-2xl ring-8 ring-white/10">
                        {selected.userName[0].toUpperCase()}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-4xl font-serif font-black tracking-tight">{selected.userName}</h3>
                          <div className="p-1 px-3 bg-amber-500 text-slate-900 rounded-lg font-black text-[10px] uppercase tracking-widest">Active Client</div>
                        </div>
                        <p className="text-slate-400 font-bold tracking-widest text-[11px] flex items-center gap-3">
                          <Fingerprint size={14} className="text-indigo-400" />
                          NODE REFERENCE: <span className="text-white px-3 py-1 rounded-lg bg-white/10">{selected._id}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 text-[10px] font-black uppercase tracking-widest active:scale-95"
                    >
                      Close Protocol View
                      <XCircle size={18} className="text-rose-400" />
                    </button>
                  </div>

                  <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {[
                      { label: "Available Liquidity", value: `₹${fmt(selected.walletBalance)}`, icon: Wallet, color: "text-white" },
                      { label: "Gold Allocation", value: `${selected.goldBalance || 0}g`, icon: Coins, color: "text-amber-400" },
                      { label: "Silver Allocation", value: `${selected.silverBalance || 0}g`, icon: TrendingUp, color: "text-slate-300" },
                      { label: "Security Token", value: selected.email, icon: Mail, full: true, color: "text-white" },
                      { label: "Initiation Datum", value: fmtDate(selected.createdAt), icon: Calendar, color: "text-white" },
                      { label: "Validation Tier", value: selected.kycStatus, icon: ShieldCheck, color: "text-emerald-400" },
                    ].map((item, idx) => (
                      <div key={idx} className={item.full ? "col-span-full" : ""}>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-3">
                          <item.icon size={12} className="text-indigo-400 shadow-sm" />
                          {item.label}
                        </p>
                        <p className={`text-2xl font-serif font-black tracking-tight ${item.color}`}>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Link to="/staff/kyc" className="flex-1 flex items-center justify-center gap-4 px-10 py-5 bg-white text-slate-900 rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-amber-50 transition-all shadow-2xl active:scale-[0.98]">
                      Verify Identity Protocols
                      <ExternalLink size={18} />
                    </Link>
                    <Link to="/staff/transactions" className="flex-1 flex items-center justify-center gap-4 px-10 py-5 bg-white/5 text-white border border-white/10 rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-[0.98]">
                      Review Audit Ledger
                      <ReceiptText size={18} />
                    </Link>
                  </div>
                </div>

                {/* Background Aesthetics */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -left-20 top-20 w-60 h-60 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </StaffLayout>
  );
}
