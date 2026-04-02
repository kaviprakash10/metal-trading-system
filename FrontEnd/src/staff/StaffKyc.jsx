import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, updateKycStatus } from "../slice/Adminslice";
import StaffLayout from "./StaffLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Search, 
  ChevronRight, 
  UserCheck, 
  UserX, 
  Eye, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Mail,
  Calendar,
  MoreVertical,
  ChevronDown,
  ShieldAlert as ShieldIcon,
  Fingerprint,
  ChevronLeft
} from "lucide-react";

const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function StaffKyc() {
  const dispatch = useDispatch();
  const { users, loading, total, totalPages, verifiedCount, pendingCount } = useSelector((s) => s.admin);
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync with Backend Pagination
  useEffect(() => {
    dispatch(fetchAllUsers({
      page,
      limit: 20,
      search,
      kycStatus: statusFilter !== "All" ? statusFilter : ""
    }));X
  }, [dispatch, page, search, statusFilter]);

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleFilter = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleUpdate = async (userId, status) => {
    setIsUpdating(true);
    await dispatch(updateKycStatus({ userId, kycStatus: status }));
    setIsUpdating(false);
    setSelectedUser(null);
  };

  const userList = users || [];

  return (
    <StaffLayout>
      <div className="max-w-7xl mx-auto space-y-12 pb-10">
        
        {/* ── Intelligence Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/60 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100 flex items-center gap-2">
                <ShieldIcon size={12} />
                Compliance Protocol
              </span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-serif font-black text-slate-900 tracking-tight leading-none"
            >
              Verification Hub<span className="text-amber-500">.</span>
            </motion.h1>
            <p className="text-slate-500 font-medium mt-3">
              {statusFilter === "PENDING" 
                ? `System flagged ${pendingCount} candidates for manual audit buffer.`
                : "Comprehensive validation logs and identity archival system."}
            </p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 bg-white p-3 rounded-[1.5rem] border border-slate-200 shadow-sm"
          >
            <div className={`px-5 py-3 rounded-xl border text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${pendingCount > 0 ? "bg-amber-500 text-white border-amber-400" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
              {pendingCount} Active Audits
            </div>
          </motion.div>
        </div>

        {/* ── Operations Segment ── */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Lookup Filter */}
            <div className="relative flex-1 w-full text-slate-500">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Audit identity by Corporate Identifier or Alias..." 
                value={search} 
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
              />
            </div>

            {/* Logical Segments */}
            <div className="flex bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-100 overflow-x-auto w-full lg:w-auto no-scrollbar">
              {["All", "PENDING", "VERIFIED", "REJECTED"].map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilter(f)}
                  className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${
                    statusFilter === f 
                      ? "bg-white text-slate-900 shadow-sm border border-slate-100" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {f === "PENDING" && <Clock size={12} className={statusFilter === f ? "text-amber-500" : ""} />}
                  {f === "VERIFIED" && <ShieldCheck size={12} className={statusFilter === f ? "text-emerald-500" : ""} />}
                  {f === "REJECTED" && <XCircle size={12} className={statusFilter === f ? "text-rose-500" : ""} />}
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Audit Stream ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="col-span-full py-40 flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 border-[5px] border-indigo-500/10 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em] animate-pulse">Syncing Validation Nodes...</p>
              </div>
            ) : userList.length === 0 ? (
              <div className="col-span-full py-40 flex flex-col items-center justify-center gap-6 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                  <ShieldCheck size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-black text-slate-900 tracking-tight leading-none">Buffer Fully Synchronized</h3>
                  <p className="text-slate-400 text-sm font-medium px-10">No pending candidates identified for manual audit in this segment.</p>
                </div>
              </div>
            ) : (
              userList.map((u, i) => (
                <motion.div
                  layout
                  key={u._id}
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-[3rem] border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col h-full relative overflow-hidden group"
                >
                  <div className="p-8 pb-4 relative z-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50/50 flex items-center justify-center text-indigo-600 font-black text-xl group-hover:scale-110 transition-transform">
                        {u.userName[0].toUpperCase()}
                      </div>
                      <div className={`px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${
                        u.kycStatus === "VERIFIED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        u.kycStatus === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-100" :
                        "bg-rose-50 text-rose-600 border-rose-100"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          u.kycStatus === "VERIFIED" ? "bg-emerald-500 animate-pulse" :
                          u.kycStatus === "PENDING" ? "bg-amber-500" :
                          "bg-rose-500"
                        }`} />
                        {u.kycStatus}
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <h3 className="text-2xl font-serif font-black text-slate-900 tracking-tight">{u.userName}</h3>
                      <p className="text-slate-400 font-bold text-xs tracking-tight flex items-center gap-2">
                        <Mail size={14} className="opacity-40" />
                        {u.email}
                      </p>
                    </div>
                  </div>

                  <div className="px-8 py-6 space-y-4 relative z-10 flex-1">
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Registration Epoch</p>
                        <p className="text-xs font-black text-slate-700">{fmtDate(u.createdAt)}</p>
                      </div>
                      <Calendar size={20} className="text-slate-200" />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Identification Reference</p>
                        <p className="text-xs font-black text-slate-700 uppercase tracking-tighter">NODE-{u._id?.slice(-8)}</p>
                      </div>
                      <Fingerprint size={20} className="text-slate-200" />
                    </div>
                  </div>

                  <div className="p-8 pt-0 relative z-10">
                    <button 
                      onClick={() => setSelectedUser(u)}
                      className="w-full flex items-center justify-center gap-4 px-8 py-4.5 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]"
                    >
                      Audit Details
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  
                  {/* Backdrop Aesthetics */}
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-500/5 rounded-full blur-[80px]" />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* ── Pagination Intelligence ── */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-900 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
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
                        className={`w-12 h-12 rounded-xl text-[11px] font-black tracking-widest transition-all ${
                          page === p 
                            ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                            : "bg-white text-slate-400 hover:text-slate-600"
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
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-900 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-400 flex items-center gap-3">
              <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900 border border-slate-100">Page {page} of {totalPages}</div>
              <span>•</span>
              <span>Total Entities: {total}</span>
            </div>
          </div>
        )}

        {/* ── Decision Modular Overlay ── */}
        <AnimatePresence>
          {selectedUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 lg:p-10">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedUser(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" 
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 100 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 100 }}
                className="relative w-full max-w-4xl bg-white rounded-[4rem] shadow-2xl overflow-hidden shadow-slate-950/40"
              >
                <div className="p-10 lg:p-16">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 mb-16">
                    <div className="flex items-center gap-8">
                       <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 text-white flex items-center justify-center text-4xl font-black shadow-2xl shadow-indigo-500/30">
                        {selectedUser.userName[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-4xl font-serif font-black text-slate-900 tracking-tight leading-none">{selectedUser.userName}</h2>
                          <span className="p-1.5 px-3 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100">Audit Phase</span>
                        </div>
                        <p className="text-slate-500 font-bold text-sm tracking-tight flex items-center gap-3">
                          <Mail size={16} className="text-slate-300" />
                          {selectedUser.email}
                        </p>
                      </div>
                    </div>
                    <div className="w-full lg:w-auto flex flex-col gap-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Verification Token</p>
                      <div className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black text-slate-700 tracking-widest uppercase">
                        NODE-{selectedUser._id}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
                    {[
                      { label: "Document Classification", value: "Primary Identity Matrix", icon: FileText, color: "text-indigo-500" },
                      { label: "Temporal Origin", value: fmtDate(selectedUser.createdAt), icon: Clock, color: "text-indigo-500" },
                      { label: "Security Clearance", value: selectedUser.role || "Standard Participant", icon: ShieldCheck, color: "text-indigo-500" },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-slate-50/50 p-7 rounded-[2rem] border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-3">
                          <item.icon size={12} className={item.color} />
                          {item.label}
                        </p>
                        <p className="text-lg font-black text-slate-900 tracking-tight">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-slate-100">
                    <button
                      onClick={() => handleUpdate(selectedUser._id, "VERIFIED")}
                      disabled={isUpdating}
                      className="flex-1 flex items-center justify-center gap-4 px-10 py-6 bg-emerald-500 text-white rounded-[1.75rem] text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                    >
                      <CheckCircle2 size={24} />
                      {isUpdating ? "Processing..." : "Validate Candidate"}
                    </button>
                    <button
                      onClick={() => handleUpdate(selectedUser._id, "REJECTED")}
                      disabled={isUpdating}
                      className="flex-1 flex items-center justify-center gap-4 px-10 py-6 bg-rose-500 text-white rounded-[1.75rem] text-xs font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20 active:scale-95 disabled:opacity-50"
                    >
                      <XCircle size={24} />
                      {isUpdating ? "Processing..." : "Deny Application"}
                    </button>
                  </div>
                </div>
                
                {/* Visual Flair */}
                <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-indigo-600/5 rounded-full blur-[80px]" />
                <div className="absolute -right-20 top-20 w-60 h-60 bg-amber-500/5 rounded-full blur-[80px]" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </StaffLayout>
  );
}
