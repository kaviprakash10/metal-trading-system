import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  History,
  Banknote,
  ShieldCheck,
  Globe,
  LogOut,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react";
import { logout } from "../slice/Authslice";
import { fetchCurrentPrices } from "../slice/Priceslice";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const ADMIN_NAV = [
  { icon: LayoutDashboard, label: "Overview", to: "/admin/dashboard" },
  { section: "Management" },
  { icon: Users, label: "User Accounts", to: "/admin/users" },
  { icon: History, label: "Transactions", to: "/admin/transactions" },
  { icon: Banknote, label: "Price Control", to: "/admin/prices" },
  { icon: ShieldCheck, label: "KYC Verification", to: "/admin/kyc" },
  { section: "Portals" },
  { icon: Globe, label: "Go to User Portal", to: "/user/dashboard" },
];

export default function AdminLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const { current } = useSelector((s) => s.price);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    dispatch(fetchCurrentPrices());
    const interval = setInterval(() => dispatch(fetchCurrentPrices()), 180000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900 flex">
      {/* --- Sidebar --- */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="fixed left-0 top-0 h-full bg-[#0F172A] text-slate-300 shadow-2xl z-50 flex flex-col"
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl font-serif">L</span>
                </div>
                <span className="text-xl font-serif font-bold text-white tracking-tight">
                  Luna <span className="text-amber-500">Admin</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
          >
            {isSidebarOpen ? <Menu size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {ADMIN_NAV.map((item, i) => (
            item.section ? (
              isSidebarOpen && (
                <motion.div
                  key={`sec-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-4 py-3 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mt-4"
                >
                  {item.section}
                </motion.div>
              )
            ) : (
              <Link key={item.to} to={item.to}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(item.to)
                    ? "bg-amber-500/10 text-amber-500 shadow-sm"
                    : "hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  <item.icon size={20} className={isActive(item.to) ? "text-amber-500" : "text-slate-400 group-hover:text-white transition-colors"} />
                  {isSidebarOpen && (
                    <span className="text-[14px] font-medium tracking-wide">
                      {item.label}
                    </span>
                  )}
                  {isActive(item.to) && isSidebarOpen && (
                    <motion.div layoutId="activeTag" className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                </motion.div>
              </Link>
            )
          ))}
        </nav>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/30">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-900 font-bold shadow-lg shadow-amber-500/20">
                {user?.userName?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.userName || "Administrator"}</p>
                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Super Admin</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold">
              {user?.userName?.[0]?.toUpperCase() || "A"}
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all group overflow-hidden ${!isSidebarOpen && "justify-center"}`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* --- Main Content --- */}
      <main
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: isSidebarOpen ? "260px" : "80px" }}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-400 group">
            <div className="relative">

              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Universal Search..."
                className="bg-slate-100 border-none rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all outline-none text-slate-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8 bg-slate-50 px-6 py-2.5 rounded-full border border-slate-100">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Spot Gold
                </div>
                <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
                  ₹{fmt(current.gold?.pricePerGram)}
                  <TrendingUp size={14} className="text-emerald-500" />
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                  Spot Silver
                </div>
                <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
                  ₹{fmt(current.silver?.pricePerGram)}
                  <TrendingDown size={14} className="text-rose-500" />
                </div>
              </div>
            </div>

            {/* Notification */}
            {/* <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button> */}
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 pb-12 flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Custom Scrollers for Tailwind */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}