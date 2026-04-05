import { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  History,
  Trash2,
  Edit,
  BadgeCheck,
  Briefcase
} from "lucide-react";
import {
  fetchAllUsers,
  updateKycStatus,
  updateUserRole,
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
  const { users, loading, error, successMessage } = useSelector((s) => s.admin);

  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

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
            <div className={`mx-6 mt-6 p-4 rounded-2xl border text-sm font-bold flex items-center gap-3 ${
              error ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
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
                  <AnimatePresence>
                    {filtered.map((u) => {
                      const kyc = KYC_CONFIG[u.kycStatus];
                      const role = ROLE_CONFIG[u.role] || ROLE_CONFIG.user;
                      const isExpanded = expandedId === u._id;

                      return (
                        <Fragment key={u._id}>
                          <motion.tr 
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`group transition-all ${isExpanded ? "bg-amber-50/20" : "hover:bg-slate-50"}`}
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
                                    onClick={() => setExpandedId(isExpanded ? null : u._id)}
                                    className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                                  >
                                     {isExpanded ? <ChevronUp size={16} /> : <Edit size={16} />}
                                  </button>
                                  <button className="p-2 rounded-lg text-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-all">
                                     <Trash2 size={16} />
                                  </button>
                               </div>
                            </td>
                          </motion.tr>

                          {isExpanded && (
                            <tr>
                              <td colSpan="6" className="px-8 pb-8 pt-0">
                                 <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
                                 >
                                    <div className="absolute top-0 right-0 p-12 opacity-5">
                                       <Users size={180} />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                                       <div className="space-y-4">
                                          <div>
                                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Portfolio Appraisal</p>
                                             <div className="flex items-center gap-4">
                                                <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500 border border-amber-500/20">
                                                   <Coins size={20} />
                                                </div>
                                                <div>
                                                   <p className="text-xl font-bold">{u.goldBalance || 0}g Gold</p>
                                                   <p className="text-xs text-slate-400">{u.silverBalance || 0}g Silver</p>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                       
                                       <div className="space-y-4">
                                          <div>
                                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Financial State</p>
                                             <p className="text-xl font-bold text-emerald-400">₹{fmt(u.walletBalance)}</p>
                                             <p className="text-xs text-slate-400">Available Liquid Funds</p>
                                          </div>
                                       </div>

                                       <div className="space-y-4">
                                          <div>
                                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Identification</p>
                                             <p className="text-xs font-mono text-amber-500">{u._id}</p>
                                             <p className="text-xs text-slate-400 mt-1">Unique Global ID</p>
                                          </div>
                                       </div>

                                       <div className="flex flex-col justify-center items-end gap-3">
                                          <button className="w-full bg-white text-slate-900 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                                             <History size={14} /> Full Audit Log
                                          </button>
                                          <button className="w-full bg-amber-500/10 text-amber-500 py-2.5 rounded-xl text-xs font-bold border border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2">
                                             <Edit size={14} /> Adjust Balances
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
