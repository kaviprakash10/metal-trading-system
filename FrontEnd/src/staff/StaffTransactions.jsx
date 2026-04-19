import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import StaffLayout from "./StaffLayout";
import { fetchAllTransactions } from "../slice/Adminslice";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  Zap,
  TrendingUp,
  Package,
  Coins,
  ReceiptText,
  IndianRupee,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

const TYPE_CONFIG = {
  BUY_GOLD: {
    label: "Gold Acquisition",
    icon: <TrendingUp className="text-emerald-500" size={18} />,
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  SELL_GOLD: {
    label: "Gold Liquidated",
    icon: <TrendingUp className="text-rose-500 rotate-180" size={18} />,
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  BUY_SILVER: {
    label: "Silver Acquisition",
    icon: <TrendingUp className="text-indigo-500" size={18} />,
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  SELL_SILVER: {
    label: "Silver Liquidated",
    icon: <TrendingUp className="text-slate-500 rotate-180" size={18} />,
    bg: "bg-slate-50",
    border: "border-slate-100",
  },
  WALLET_ADD: {
    label: "Wallet Deposit",
    icon: <IndianRupee className="text-indigo-600" size={18} />,
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
};


const FILTERS = {
  All: "All Operations",
  Buy: "Acquisitions",
  Sell: "Liquidations",
  WALLET_ADD: "Wallet Deposits",
};


export default function StaffTransactions() {
  const dispatch = useDispatch();
  const {
    transactions,
    loading,
    total,
    totalPages,
    currentPage,
    totalVolume,
    totalGst,
  } = useSelector((state) => state.admin);

  // Local State Intelligence
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [assetFilter, setAssetFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [sortDesc, setSortDesc] = useState(true);


  // Thunk Dispatch Sync
  useEffect(() => {
    const params = {
      page,
      limit: 20,
      search,
      type: typeFilter !== "All" ? typeFilter : "",
      sort: sortDesc ? "newest" : "oldest",
    };

    if (selectedUser) params.userId = selectedUser._id;

    dispatch(fetchAllTransactions(params));
  }, [dispatch, page, search, typeFilter, sortDesc, selectedUser]);

  // Event Handlers
  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleTypeChange = (val) => {
    setTypeFilter(val);
    setPage(1);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setPage(1);
    setSearch("");
  };

  const txList = transactions || [];

  const uniqueUsers = useMemo(() => {
    const usersMap = new Map();
    txList.forEach(tx => {
      if (tx.user && !usersMap.has(tx.user._id)) {
        usersMap.set(tx.user._id, tx.user);
      }
    });
    return Array.from(usersMap.values()).sort((a, b) => 
      (a.userName || "").localeCompare(b.userName || "")
    );
  }, [txList]);


  // Formatter Utilities
  const fmt = (v) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(v || 0);

  const fmtG = (v) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 3,
      minimumFractionDigits: 3,
    }).format(v || 0);

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  const fmtTime = (d) =>
    new Date(d).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const stats = [
    {
      label: "Gross Cumulative Volume",
      value: `₹${fmt(totalVolume)}`,
      icon: <TrendingUp size={20} />,
      color: "from-slate-900 to-indigo-900",
    },
    {
      label: "Aggregate Tax Revenue",
      value: `₹${fmt(totalGst)}`,
      icon: <ReceiptText size={20} />,
      color: "from-slate-900 to-slate-800",
    },
    {
      label: "Total Operations",
      value: total,
      icon: <Zap size={20} />,
      color: "from-indigo-600 to-indigo-900",
    },
  ];

  return (
    <StaffLayout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
              <Zap size={12} /> Financial Intelligence
            </div>
            <h1 className="text-4xl font-serif font-black text-slate-900 tracking-tight">
              {selectedUser ? `${selectedUser.userName}'s Ledger` : "Global Audit Ledger"}
            </h1>
            <p className="text-slate-400 font-medium max-w-lg">
              Synchronized real-time transaction monitoring and immutable asset tracking infrastructure.
            </p>
          </div>
          {selectedUser && (
            <button
              onClick={() => setSelectedUser(null)}
              className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200"
            >
              Back to Global Feed
            </button>
          )}
        </div>

        {/* Global Analytics Intelligence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm"
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-bl-[5rem] group-hover:scale-110 transition-transform`}
              />
              <div className="flex flex-col gap-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors shadow-inner">
                  {stat.icon}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-serif font-black text-slate-900 tracking-tight">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search & Filter Matrix */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Lookup Name, Corporate Email, or Transaction UUID..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all tracking-tight"
              />
            </div>

            {/* View Segments */}
            <div className="flex bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-100 overflow-x-auto w-full lg:w-auto no-scrollbar">
              {Object.entries(FILTERS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleTypeChange(key)}
                  className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${typeFilter === key
                    ? "bg-white text-slate-900 shadow-sm border border-slate-100"
                    : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Temporal Toggle */}
            <button
              onClick={() => setSortDesc((v) => !v)}
              className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg active:scale-95"
            >
              <ArrowUpDown size={14} />
              {sortDesc ? "Latest First" : "Earliest First"}
            </button>
          </div>
        </div>

        {/* Ledger Table Section */}
        <div className="bg-white rounded-[3rem] border border-slate-200/80 shadow-sm overflow-hidden relative">
          <div className="overflow-x-auto">
            {loading ? (

              <div className="py-32 flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 border-[5px] border-indigo-500/10 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em] animate-pulse">
                  Accessing Core Ledger Database...
                </p>
              </div>
            ) : !selectedUser ? (
              /* User Directory View */
              <div className="bg-slate-50/30 p-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {uniqueUsers.map((u, i) => (
                    <motion.div
                      key={u._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleUserSelect(u)}
                      className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-pointer hover:shadow-xl hover:shadow-indigo-500/5 transition-all hover:-translate-y-1"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-slate-900/20 group-hover:bg-indigo-600 transition-colors">
                          {u.userName ? u.userName[0].toUpperCase() : "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-serif font-black text-slate-900 truncate tracking-tight">{u.userName}</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate mt-1">{u.email}</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-50 text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                           <Zap size={10} /> Active Partner
                        </div>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">UID: {u._id?.slice(-6)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              /* Ledger Table View */
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">
                      Principal / Operation
                    </th>
                    <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">
                      Mass (g)
                    </th>
                    <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">
                      Quote Detail
                    </th>
                    <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">
                      Displacement
                    </th>
                    <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">
                      Status
                    </th>
                    <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 text-right">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {txList.map((tx, i) => {
                    const cfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG.BUY_GOLD;
                    const isBuy = tx.type?.startsWith("BUY");
                    const isOpen = expanded === tx._id;
                    return (
                      <React.Fragment key={tx._id}>
                        <tr className={`group hover:bg-slate-50/80 cursor-pointer transition-colors ${isOpen ? "bg-slate-50/80" : ""}`}>
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                                  {cfg.icon}
                                </div>
                                <div className="space-y-1" onClick={() => setExpanded(isOpen ? null : tx._id)}>
                                  <p className="text-[13px] font-black text-slate-900 tracking-tight">{cfg.label}</p>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${tx.asset === "GOLD" ? "bg-amber-400" : tx.asset === "SILVER" ? "bg-slate-400" : "bg-indigo-400"} shadow-sm`} />
                                    <span className="text-[10px] font-black text-slate-400 tracking-[0.1em] uppercase">
                                      {tx.asset} (99.9)
                                    </span>
                                  </div>
                                </div>
                            </div>
                          </td>
                          <td className="px-10 py-6" onClick={() => setExpanded(isOpen ? null : tx._id)}>
                            <div className="flex items-center gap-2.5 font-serif font-black text-slate-900 text-lg">
                              {tx.type === "WALLET_ADD" ? (
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic opacity-50">N/A</span>
                              ) : (
                                <>
                                  <Package size={16} className="text-slate-300" />
                                  {fmtG(tx.grams || 0)}
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-10 py-6" onClick={() => setExpanded(isOpen ? null : tx._id)}>
                            <div className="space-y-1.5">
                              {tx.type === "WALLET_ADD" ? (
                                <div className="text-[11px] font-black text-indigo-600/60 uppercase tracking-widest underline decoration-indigo-200 underline-offset-4">Fiat Deposit</div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-3 text-[11px] font-extrabold text-slate-700 uppercase tracking-tight">
                                    <span className="text-slate-300 w-10 text-[9px] font-black tracking-widest">Base:</span>
                                    ₹{fmt(tx.amount)}
                                  </div>
                                  <div className="flex items-center gap-3 text-[11px] font-extrabold text-slate-700 uppercase tracking-tight">
                                    <span className="text-slate-300 w-10 text-[9px] font-black tracking-widest">Tax:</span>
                                    {tx.gstAmount > 0 ? `₹${fmt(tx.gstAmount)}` : "—"}
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-10 py-6" onClick={() => setExpanded(isOpen ? null : tx._id)}>
                            <div className={`text-xl font-serif font-black tracking-tighter ${isBuy ? "text-rose-600" : "text-emerald-600"}`}>
                              {isBuy ? "−" : "+"}₹{fmt(tx.totalAmount || tx.amount)}
                            </div>
                          </td>
                          <td className="px-10 py-6" onClick={() => setExpanded(isOpen ? null : tx._id)}>
                             <div className={`inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest ${tx.status === 'SUCCESS' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {tx.status || 'CONFIRMED'}
                             </div>
                          </td>
                          <td className="px-10 py-6 text-right" onClick={() => setExpanded(isOpen ? null : tx._id)}>
                             <div className="text-[12px] font-black text-slate-900">{fmtDate(tx.createdAt)}</div>
                             <div className="text-[10px] font-bold text-slate-400 mt-0.5">{fmtTime(tx.createdAt)}</div>
                          </td>
                        </tr>
                        <AnimatePresence>
                          {isOpen && (
                            <tr>
                              <td colSpan="6" className="px-10 py-0 text-left">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden border-x-2 border-slate-100 bg-slate-50/30"
                                >
                                  <div className="p-10 grid grid-cols-2 lg:grid-cols-4 gap-10">
                                    {[
                                      { label: "Operation System Reference", value: tx._id, full: true },
                                      { label: "Market Quote / Unit", value: tx.type === "WALLET_ADD" ? "N/A" : `₹${fmt(tx.pricePerGram)}`, icon: <TrendingUp size={14} /> },
                                      { label: "Asset Classification", value: tx.type === "WALLET_ADD" ? "Fiat Currency" : tx.asset === "GOLD" ? "MCX AU High Grade" : "MCX AG Pure Grade", icon: <Coins size={14} /> },
                                      { label: "Node Verification", value: tx.status || "CONFIRMED", icon: <Zap size={14} />, color: "text-emerald-600" },
                                      { label: "Compliance UUID", value: `AU-LEDGER-${tx._id?.slice(-8).toUpperCase()}`, icon: <ReceiptText size={14} /> },
                                    ].map((item, idx) => (
                                      <div key={idx} className={item.full ? "col-span-full pb-8 mb-4 border-b border-slate-200/50" : ""}>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-3">
                                          <span className="p-1.5 bg-white rounded-lg shadow-sm">{item.icon}</span>
                                          {item.label}
                                        </p>
                                        <p className={`font-serif font-black text-slate-900 ${item.full ? "text-2xl" : "text-xl"} tracking-tight ${item.color || ""}`}>
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

          {/* Pagination Intelligence */}
          {!loading && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-10 py-10 border-t border-slate-50">
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
                    if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-12 h-12 rounded-xl text-[11px] font-black tracking-widest transition-all ${page === p ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : "bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
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
                <span>Total Ledger: {total}</span>
              </div>
            </div>
          )}

          {/* Void State */}
          {!loading && txList.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center gap-6 text-center">
              <div className="w-24 h-24 bg-slate-50 flex items-center justify-center text-slate-200 rounded-[2.5rem] shadow-inner mb-2">
                <Search size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-black text-slate-900 tracking-tight">
                  No Encrypted Records
                </h3>
                <p className="text-slate-400 text-sm font-medium px-10 max-w-sm mx-auto">
                  The search parameters did not yield clinical matches within our prioritized audit buffers.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearch("");
                  setTypeFilter("All");
                  setAssetFilter("All");
                  setSelectedUser(null);
                }}
                className="mt-6 flex items-center gap-3 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
              >
                Reset Ledger Filter
              </button>
            </div>
          )}
        </div>

        {/* Operational Intelligence Footer */}
        {!loading && txList.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80">
            <span className="flex items-center gap-2">
              Viewing prioritized entries from synchronized ledger
            </span>
            <span className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-slate-200/50 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/10" />
              Live Clinical Observation Active
            </span>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
