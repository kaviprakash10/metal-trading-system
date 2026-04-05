import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Search,
  Filter,
  User as UserIcon,
  Mail,
  Calendar,
  Wallet,
  Coins,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { fetchAllUsers, updateKycStatus } from "../slice/Adminslice";
import AdminLayout from "./adminLayout";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const KYC_CONFIG = {
  VERIFIED: {
    bg: "bg-emerald-50",
    color: "text-emerald-600",
    border: "border-emerald-100",
    label: "Verified",
    icon: CheckCircle2,
  },
  PENDING: {
    bg: "bg-amber-50",
    color: "text-amber-600",
    border: "border-amber-100",
    label: "Pending",
    icon: Clock,
  },
  REJECTED: {
    bg: "bg-rose-50",
    color: "text-rose-600",
    border: "border-rose-100",
    label: "Rejected",
    icon: XCircle,
  },
};

/* ── Single KYC User Card ── */
function KycCard({ user, onUpdate, loading }) {
  const [selected, setSelected] = useState(user.kycStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (status) => {
    setSelected(status);
    setIsUpdating(true);
    await onUpdate(user._id, status);
    setIsUpdating(false);
  };

  const cfg = KYC_CONFIG[user.kycStatus];
  const StatusIcon = cfg.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
    >
      {/* Top Status Banner */}
      <div className={`h-1.5 w-full ${cfg.bg.replace('50', '500')}`} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors">
              <UserIcon size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{user.userName}</h3>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                <Mail size={12} /> {user.email}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-tight ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
            <StatusIcon size={12} />
            {cfg.label}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg text-blue-500 shadow-sm"><Wallet size={14} /></div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Liquid Cash</p>
              <p className="text-xs font-bold text-slate-700">₹{fmt(user.walletBalance)}</p>
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg text-amber-500 shadow-sm"><Coins size={14} /></div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Au Balance</p>
              <p className="text-xs font-bold text-slate-700">{user.goldBalance || 0}g</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-4">
          <span>Update Verification Status</span>
          <ShieldQuestion size={14} className="text-slate-300" />
        </div>

        <div className="flex gap-2">
          {Object.entries(KYC_CONFIG).map(([status, config]) => {
            const isActive = user.kycStatus === status;
            const SIcon = config.icon;
            return (
              <button
                key={status}
                disabled={isActive || isUpdating}
                onClick={() => handleUpdate(status)}
                className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${isActive
                    ? `${config.bg} ${config.color} ${config.border} shadow-inner cursor-default`
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                  }`}
              >
                <SIcon size={18} />
                <span className="text-[10px] font-bold">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
          <Calendar size={12} />
          MEMBER SINCE {fmtDate(user.createdAt).toUpperCase()}
        </div>
        <button className="p-1 hover:bg-white rounded-lg transition-all text-slate-300 hover:text-slate-900 shadow-sm">
          <MoreVertical size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export default function KycManagement() {
  const dispatch = useDispatch();
  const { users, loading, error, successMessage } = useSelector((s) => s.admin);

  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleUpdate = (userId, kycStatus) => {
    dispatch(updateKycStatus({ userId, kycStatus }));
  };

  const filtered = (users || [])
    .filter((u) => filter === "ALL" || u.kycStatus === filter)
    .filter((u) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        u.userName?.toLowerCase().includes(s) ||
        u.email?.toLowerCase().includes(s)
      );
    });

  const stats = [
    { label: "Pending", count: (users || []).filter(u => u.kycStatus === 'PENDING').length, icon: ShieldAlert, color: "text-amber-500", bg: "bg-amber-50", f: "PENDING" },
    { label: "Verified", count: (users || []).filter(u => u.kycStatus === 'VERIFIED').length, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50", f: "VERIFIED" },
    { label: "Rejected", count: (users || []).filter(u => u.kycStatus === 'REJECTED').length, icon: XCircle, color: "text-rose-500", bg: "bg-rose-50", f: "REJECTED" },
    { label: "Total Accounts", count: (users || []).length, icon: UserIcon, color: "text-blue-500", bg: "bg-blue-50", f: "ALL" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="text-amber-500" size={20} />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compliance Center</h3>
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Identity Verification</h1>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Find users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/10 text-sm font-medium outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <button
              key={s.label}
              onClick={() => setFilter(s.f)}
              className={`flex items-center gap-5 p-6 rounded-3xl border transition-all text-left ${filter === s.f
                  ? "bg-[#0F172A] border-slate-900 shadow-xl"
                  : "bg-white border-slate-200 shadow-sm hover:border-amber-200 hover:shadow-md"
                }`}
            >
              <div className={`${s.bg} ${s.color} p-4 rounded-2xl`}>
                <s.icon size={24} />
              </div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${filter === s.f ? "text-slate-400" : "text-slate-400"}`}>{s.label}</p>
                <h3 className={`text-2xl font-black mt-1 ${filter === s.f ? "text-white" : "text-slate-900"}`}>{s.count}</h3>
              </div>
            </button>
          ))}
        </div>

        {(successMessage || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border text-sm font-bold flex items-center gap-3 ${error ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
              }`}
          >
            <div className={`w-2 h-2 rounded-full ${error ? "bg-rose-500" : "bg-emerald-500"} animate-pulse`} />
            {error || successMessage}
          </motion.div>
        )}

        {loading && !users.length ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full shadow-lg"
            />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Records...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((user) => (
                  <KycCard
                    key={user._id}
                    user={user}
                    onUpdate={handleUpdate}
                    loading={loading}
                  />
                ))}
              </AnimatePresence>
            </div>

            {filtered.length === 0 && (
              <div className="py-24 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6">
                  <ShieldQuestion size={48} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No Applications Found</h3>
                <p className="text-sm text-slate-400 font-medium mt-1">There are no users matching the current search or filter.</p>
                <button
                  onClick={() => { setFilter('ALL'); setSearch(''); }}
                  className="mt-6 text-amber-600 font-bold hover:underline py-2 px-4 rounded-xl hover:bg-amber-50 transition-all"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
