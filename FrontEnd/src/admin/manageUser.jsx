import { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  ShieldClose,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Mail,
  Wallet,
  Coins,
  History as HistoryIcon,
  Trash2,
  Edit,
  BadgeCheck,
  Briefcase,
  X,
  Save,
  Undo2
} from "lucide-react";
import {
  fetchAllUsers,
  updateKycStatus,
  updateUserRole,
  updateUserBalance,
} from "../slice/Adminslice";
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
  VERIFIED: { bg: "bg-emerald-50", color: "text-emerald-600", border: "border-emerald-100", icon: ShieldCheck },
  PENDING: { bg: "bg-amber-50", color: "text-amber-600", border: "border-amber-100", icon: ShieldAlert },
  REJECTED: { bg: "bg-rose-50", color: "text-rose-600", border: "border-rose-100", icon: ShieldClose },
};

const ROLE_CONFIG = {
  admin: { bg: "bg-amber-500", color: "text-white", label: "Master Admin" },
  user: { bg: "bg-slate-100", color: "text-slate-600", label: "General User" },
  staff: { bg: "bg-blue-500", color: "text-white", label: "Staff Support" },
};

export default function ManageUsers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error, successMessage } = useSelector((s) => s.admin);

  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedUser, setSelectedUser] = useState(null);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    walletBalance: 0,
    goldBalance: 0,
    silverBalance: 0,
  });

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUser) {
      setEditForm({
        walletBalance: selectedUser.walletBalance || 0,
        goldBalance: selectedUser.goldBalance || 0,
        silverBalance: selectedUser.silverBalance || 0,
      });
    } else {
      setIsEditing(false);
    }
  }, [selectedUser]);

  const handleSaveBalance = async () => {
    await dispatch(updateUserBalance({
      userId: selectedUser._id,
      balances: editForm
    }));
    setIsEditing(false);
  };

  const filtered = (users || [])
    .filter((u) => {
      if (kycFilter !== "All" && u.kycStatus !== kycFilter) return false;
      if (roleFilter !== "All" && u.role !== roleFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          u.userName?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s) ||
          u._id?.toLowerCase().includes(s)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "wallet") return (b.walletBalance || 0) - (a.walletBalance || 0);
      if (sortBy === "name") return a.userName?.localeCompare(b.userName);
      return 0;
    });

  const stats = [
    { label: "Total Accounts", value: (users || []).length, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Verified Users", value: (users || []).filter(u => u.kycStatus === 'VERIFIED').length, icon: BadgeCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Staff Panel", value: (users || []).filter(u => u.role === 'staff' || u.role === 'admin').length, icon: Briefcase, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="text-amber-500" size={20} />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">User Governance</h3>
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Account Directory</h1>
          </div>
          <button className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            <UserPlus size={18} /> Provision New Account
          </button>
        </div>

        {/* Dynamic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={s.label}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5"
            >
              <div className={`${s.bg} ${s.color} p-4 rounded-2xl`}>
                <s.icon size={26} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{s.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters & Control Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
          <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Find by name, email, or id..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 text-sm font-medium outline-none transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={kycFilter}
                onChange={(e) => setKycFilter(e.target.value)}
                className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none hover:bg-slate-100 transition-all"
              >
                <option value="All">All Statuses</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none hover:bg-slate-100 transition-all"
              >
                <option value="All">All Roles</option>
                <option value="user">Users</option>
                <option value="staff">Staff</option>
                <option value="admin">Admins</option>
              </select>

              <div className="w-px h-6 bg-slate-200 hidden lg:block mx-2" />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none hover:bg-slate-100 transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="wallet">Highest Balance</option>
                <option value="name">Alpha A-Z</option>
              </select>
            </div>
          </div>

          {(successMessage || error) && (
            <div className={`mx-6 mt-6 p-4 rounded-2xl border text-sm font-bold flex items-center gap-3 ${error ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
              }`}>
              <div className={`w-2 h-2 rounded-full ${error ? "bg-rose-500" : "bg-emerald-500"} animate-pulse`} />
              {error || successMessage}
            </div>
          )}

          {loading && !users.length ? (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"
              />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Compiling Records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    {["Client Identity", "Financial State", "Verification", "Permission", "Activity", "Actions"].map((h) => (
                      <th key={h} className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((u) => {
                    const kyc = KYC_CONFIG[u.kycStatus];
                    const role = ROLE_CONFIG[u.role] || ROLE_CONFIG.user;

                    return (
                      <motion.tr
                        key={u._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group transition-all hover:bg-slate-50 cursor-pointer"
                        onClick={() => setSelectedUser(u)}
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm border border-slate-200">
                              {u.userName?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 leading-tight">{u.userName}</h4>
                              <p className="text-[11px] text-slate-400 font-medium">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <IndianRupee size={14} className="text-slate-400" />
                            {fmt(u.walletBalance)}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="relative group/select">
                            <select
                              value={u.kycStatus}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => dispatch(updateKycStatus({ userId: u._id, kycStatus: e.target.value }))}
                              className={`appearance-none font-bold text-[10px] uppercase tracking-tight py-1.5 px-4 pr-8 rounded-xl border outline-none transition-all cursor-pointer ${kyc.bg} ${kyc.color} ${kyc.border}`}
                            >
                              <option value="VERIFIED">Verified</option>
                              <option value="PENDING">Pending</option>
                              <option value="REJECTED">Rejected</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                          </div>
                        </td>
                        <td className="px-8 py-5 text-[10px] font-bold text-slate-600">
                          <select
                            value={u.role}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => dispatch(updateUserRole({ userId: u._id, role: e.target.value }))}
                            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer"
                          >
                            <option value="user">User</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-8 py-5">
                          <div className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
                            {fmtDate(u.createdAt)}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedUser(u); }}
                              className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                            >
                              <Edit size={16} />
                            </button>
                            <button onClick={(e) => e.stopPropagation()} className="p-2 rounded-lg text-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="py-32 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
                    <Users size={40} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Catalogue Empty</h3>
                  <p className="text-sm text-slate-400 mt-1 font-medium max-w-xs">No user accounts found matching your selected criteria.</p>
                </div>
              )}
            </div>
          )}

          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between mt-auto">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Luna Identity Registry v2.0</p>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
              <span>Total Reach: {filtered.length} Clients</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto"
            >
              <div className="absolute top-6 right-6 z-10">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-10 h-10 bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                  <Users size={200} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 border-4 border-white/10 flex items-center justify-center text-white text-4xl font-black shadow-2xl">
                    {selectedUser.userName?.[0]?.toUpperCase()}
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-serif font-bold tracking-tight">{selectedUser.userName}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-2">
                      <span className="bg-white/10 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">
                        <Mail size={14} className="text-amber-500" /> {selectedUser.email}
                      </span>
                      <span className="bg-white/10 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2 uppercase tracking-tighter">
                        ID: {selectedUser._id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 space-y-10">
                {/* Core Balances Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-4 group h-full">
                    <div className="w-12 h-12 bg-white rounded-2xl text-emerald-500 shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
                      <Wallet size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Liquid Wallet</p>
                      {isEditing ? (
                        <div className="relative mt-2">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                          <input
                            type="number"
                            value={editForm.walletBalance}
                            onChange={(e) => setEditForm(p => ({ ...p, walletBalance: e.target.value }))}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                          />
                        </div>
                      ) : (
                        <p className="text-xl font-bold text-slate-900 truncate">₹{fmt(selectedUser.walletBalance)}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-4 group h-full">
                    <div className="w-12 h-12 bg-white rounded-2xl text-amber-500 shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
                      <Coins size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Aurum Balance</p>
                      {isEditing ? (
                        <div className="relative mt-2">
                          <input
                            type="number"
                            step="0.001"
                            value={editForm.goldBalance}
                            onChange={(e) => setEditForm(p => ({ ...p, goldBalance: e.target.value }))}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500/20 transition-all font-mono"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-amber-500 uppercase tracking-tighter">AU</span>
                        </div>
                      ) : (
                        <p className="text-xl font-bold text-slate-900 truncate">{selectedUser.goldBalance || 0}g Gold</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-4 group h-full">
                    <div className="w-12 h-12 bg-white rounded-2xl text-slate-400 shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
                      <ShieldCheck size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Silver Fine</p>
                      {isEditing ? (
                        <div className="relative mt-2">
                          <input
                            type="number"
                            step="0.001"
                            value={editForm.silverBalance}
                            onChange={(e) => setEditForm(p => ({ ...p, silverBalance: e.target.value }))}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-500/20 transition-all font-mono"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">AG</span>
                        </div>
                      ) : (
                        <p className="text-xl font-bold text-slate-900 truncate">{selectedUser.silverBalance || 0}g Silver</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Secondary Details Grid */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Account Oversight</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">KYC Status</span>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${KYC_CONFIG[selectedUser.kycStatus].bg} ${KYC_CONFIG[selectedUser.kycStatus].color} border ${KYC_CONFIG[selectedUser.kycStatus].border}`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`} />
                        {selectedUser.kycStatus}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Access Role</span>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${ROLE_CONFIG[selectedUser.role]?.bg || "bg-slate-100"} ${ROLE_CONFIG[selectedUser.role]?.color || "text-slate-600"} border border-transparent`}>
                        {selectedUser.role}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registry Date</span>
                      <span className="text-sm font-bold text-slate-700 font-mono">
                        {fmtDate(selectedUser.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">System Identifier</span>
                      <span className="text-[10px] font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        {selectedUser._id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-6">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setSelectedUser(null);
                          navigate(`/admin/transactions?userId=${selectedUser._id}`);
                        }}
                        className="flex-1 bg-[#0F172A] text-white py-4 rounded-2xl text-xs font-bold shadow-xl shadow-slate-200 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                      >
                        <HistoryIcon size={16} /> TRANSACTION AUDIT
                      </button>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 border-2 border-slate-200 text-slate-600 py-4 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Edit size={16} /> USER ADJUSTMENT
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSaveBalance}
                        disabled={loading}
                        className="flex-[2] bg-emerald-600 text-white py-4 rounded-2xl text-xs font-bold shadow-xl shadow-emerald-200 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:translate-y-0"
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Save size={16} />
                        )}
                        {loading ? "PROCESSING..." : "COMMIT CHANGES"}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl text-xs font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                      >
                        <Undo2 size={16} /> CANCEL
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

const IndianRupee = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="m6 13 8.5 8" />
    <path d="M6 13h3" />
    <path d="M9 13c6.667 0 6.667-10 0-10" />
  </svg>
);
