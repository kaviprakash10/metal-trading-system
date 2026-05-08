import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slice/Authslice";
import { fetchCurrentPrices } from "../slice/Priceslice";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Wallet,
  RefreshCcw,
  ClipboardList,
  LogOut,
  ShieldCheck,
  ShieldPlus,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  GalleryHorizontalEnd,
  Bell,
  Search,
  User,
  Settings,
  HelpCircle,
  Clock,
  ChevronRight,
  Activity,
  History,
  ExternalLink,
  Plus,
  Zap,
  MoreVertical,
  LayoutGrid,
  ArrowRight,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/user/dashboard" },
  { icon: Briefcase, label: "Portfolio", to: "/user/portfolio" },
  { icon: Wallet, label: "Wallet", to: "/user/wallet" },
  { section: "MARKETPLACE" },
  { icon: TrendingUp, label: "Buy Gold", to: "/user/buy/gold", accent: "gold" },
  { icon: TrendingUp, label: "Buy Silver", to: "/user/buy/silver", accent: "silver" },
  { icon: TrendingDown, label: "Sell Gold", to: "/user/sell/gold", accent: "sell" },
  { icon: TrendingDown, label: "Sell Silver", to: "/user/sell/silver", accent: "sell" },
  { section: "MY ASSETS" },
  { icon: RefreshCcw, label: "SIP", to: "/user/sip" },
  { icon: ClipboardList, label: "Audit", to: "/user/transactions" },
  { icon: GalleryHorizontalEnd, label: "Gallery", to: "/user/gallery" },
  { section: "IDENTITY" },
  { icon: ShieldCheck, label: "My Identity", to: "/user/account" },
];

export default function UserLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const { current } = useSelector((s) => s.price);

  const sidebarRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile & Collapsed Desktop
  const [scrolled, setScrolled] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentPrices());
    const interval = setInterval(() => dispatch(fetchCurrentPrices()), 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setSidebarOpen(false);
    setShowQuickMenu(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] text-[#1a1200] font-sans selection:bg-[#BA943A]/20">
      {/* ── Background Pattern ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── COLLAPSIBLE SIDEBAR (Universal) ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-[#100C04]/80 backdrop-blur-md z-[60]"
            />
            {/* Sidebar Shell */}
            <motion.aside
              ref={sidebarRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-[300px] bg-[#100C04] z-[70] flex flex-col border-r border-white/10 shadow-[20px_0_60px_rgba(0,0,0,0.5)]"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#1a150a]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#BA943A] to-[#E2C06A] flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-white/20" />
                  </div>
                  <span className="font-serif text-2xl font-black text-white tracking-tight">Luna</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-rose-500 hover:text-white transition-all shadow-inner group"
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <SidebarContent user={user} isActive={isActive} handleLogout={handleLogout} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN VIEWPORT ── */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 transition-all duration-500">

        {/* ── TOP NAVIGATION ── */}
        <header
          className={`sticky top-0 z-30 px-6 lg:px-12 h-20 flex items-center justify-between transition-all duration-500
            ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-[#ede8d8] shadow-sm" : "bg-transparent"}`}
        >
          <div className="flex items-center gap-6">
            {/* Sidebar Toggle Button (Primary Menu) */}
            <button
              className={`p-3 rounded-2xl border transition-all shadow-sm flex items-center gap-3 group active:scale-95
                ${sidebarOpen ? "bg-slate-900 border-slate-900 text-[#BA943A]" : "bg-white border-[#ede8d8] text-slate-900 hover:border-[#BA943A] hover:text-[#BA943A]"}`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={22} strokeWidth={2.5} className="group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] hidden sm:block">Command Center</span>
            </button>

            {/* Breadcrumbs (Staff Style) */}
            <div className="hidden md:flex items-center gap-4">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <h2 className="text-xl font-serif font-black text-slate-900 capitalize tracking-tight leading-none">
                  {NAV_ITEMS.find(n => n.to === location.pathname)?.label || "Terminal"}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-black text-[#A3A09A] uppercase tracking-[0.25em]">Luna Finance</span>
                  <ChevronRight size={10} className="text-[#ede8d8]" />
                  <span className="text-[9px] font-black text-[#BA943A] uppercase tracking-[0.25em]">Asset Portal</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Quick Actions & Menu Button */}
          <div className="flex items-center gap-4">

            {/* Quick Acquisition Bar (Staff Style) */}
            <div className="hidden xl:flex gap-3 p-1 bg-slate-100/50 rounded-2xl border border-slate-200/50">
              <Link to="/user/buy/gold" className="px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 group hover:scale-[1.02] transition-all">
                <div className="flex flex-col text-right">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Buy Gold</span>
                  <span className="text-xs font-black text-slate-900 tracking-tight">₹{fmt(current.gold?.pricePerGram)}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-[#BA943A] shadow-inner group-hover:bg-yellow-100 transition-colors">
                  <TrendingUp size={16} strokeWidth={3} />
                </div>
              </Link>
              <Link to="/user/buy/silver" className="px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 group hover:scale-[1.02] transition-all">
                <div className="flex flex-col text-right">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Buy Silver</span>
                  <span className="text-xs font-black text-slate-900 tracking-tight">₹{fmt(current.silver?.pricePerGram)}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner group-hover:bg-slate-200 transition-colors">
                  <TrendingUp size={16} strokeWidth={3} />
                </div>
              </Link>
            </div>

            {/* Quick Access Grid */}
            <div className="relative">
              <button
                onClick={() => setShowQuickMenu(!showQuickMenu)}
                className={`p-3 rounded-2xl border transition-all shadow-sm flex items-center gap-3 group active:scale-95
                  ${showQuickMenu ? "bg-slate-900 text-[#BA943A] border-slate-900" : "bg-white hover:bg-gray-50 text-slate-900 hover:border-[#BA943A] hover:text-[#BA943A]"}`}
              >
                <LayoutGrid size={22} strokeWidth={2.5} />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] hidden sm:block">Quick Terminal</span>
              </button>

              <AnimatePresence>
                {showQuickMenu && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowQuickMenu(false)} className="fixed inset-0 z-40" />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-4 w-72 bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 overflow-hidden p-4"
                    >
                      <div className="p-4 border-b border-slate-50 mb-3 flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Access</p>
                        <Zap size={14} className="text-[#BA943A]" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Portfolio", to: "/user/portfolio", icon: Briefcase, color: "bg-indigo-50 text-indigo-600" },
                          { label: "Wallet Hub", to: "/user/wallet", icon: Wallet, color: "bg-emerald-50 text-emerald-600" },
                          { label: "Vault Gallery", to: "/user/gallery", icon: GalleryHorizontalEnd, color: "bg-rose-50 text-rose-600" },
                          { label: "Savings Hub", to: "/user/sip", icon: RefreshCcw, color: "bg-amber-50 text-amber-600" },
                          { label: "My Identity", to: "/user/account", icon: ShieldCheck, color: "bg-slate-50 text-slate-900" },
                          { label: "Security Hub", to: "/user/account", icon: ShieldPlus, color: "bg-blue-50 text-blue-600" },
                        ].map((item) => (
                          <Link key={item.label} to={item.to} className="p-5 rounded-[1.5rem] bg-white border border-slate-50 hover:bg-slate-50 hover:border-slate-200 transition-all group flex flex-col items-center text-center">
                            <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform`}>
                              <item.icon size={22} strokeWidth={2.5} />
                            </div>
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-tight">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                      <Link to="/user/transactions" className="mt-4 flex items-center justify-between p-5 rounded-[1.5rem] bg-slate-900 text-[#BA943A] hover:bg-black transition-all group shadow-xl shadow-yellow-900/10">
                        <div className="flex items-center gap-4">
                          <History size={18} />
                          <span className="text-[11px] font-black uppercase tracking-widest leading-none">Trade Ledger</span>
                        </div>
                        <ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/user/account"
              className="hidden sm:flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-[1.25rem] border border-[#ede8d8] bg-white hover:border-[#BA943A] transition-all shadow-sm group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#100C04] to-[#2a2108] flex items-center justify-center text-[#BA943A] font-black text-sm shadow-lg group-hover:scale-105 transition-transform">
                {user?.userName?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="hidden lg:flex flex-col items-start leading-none pr-2">
                <span className="text-xs font-black text-[#1a1200]">{user?.userName || "Investor"}</span>
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1">Verified Member</span>
              </div>
            </Link>
          </div>
        </header>

        {/* ── CONTENT AREA ── */}
        <main className="flex-1 overflow-y-auto custom-scrollbar px-6 lg:px-12 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
}

function SidebarContent({ user, isActive, handleLogout }) {
  return (
    <div className="p-8 flex flex-col h-full">
      {/* Corporate Access (Staff Style) */}
      {user?.role !== "user" && (
        <Link
          to={user?.role === "admin" ? "/admin/dashboard" : "/staff/dashboard"}
          className="mb-10 flex items-center justify-between p-6 rounded-[2rem] bg-[#BA943A] text-[#100C04] shadow-2xl shadow-yellow-900/20 border border-[#BA943A] hover:scale-[1.02] active:scale-95 transition-all group"
        >
          <div className="flex items-center gap-5">
            <ShieldPlus size={24} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
            <span className="font-black text-[14px] tracking-tight uppercase">Executive Terminal</span>
          </div>
          <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      )}

      {/* Main Navigation (Staff Style) */}
      <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
        {NAV_ITEMS.map((item, i) => {
          if (item.section) {
            return (
              <div key={i} className="px-5 pt-10 pb-3 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
                {item.section}
              </div>
            );
          }

          const active = isActive(item.to);
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 border
                ${active
                  ? "bg-[#BA943A] border-[#BA943A]/50 text-[#100C04] shadow-xl shadow-yellow-900/10"
                  : "text-white/40 border-transparent hover:bg-white/5 hover:text-white hover:border-white/5"}`}
            >
              <div className="flex items-center gap-5">
                <Icon size={20} strokeWidth={active ? 3 : 2} className={active ? "text-[#100C04]" : "text-white/20 group-hover:text-[#BA943A] transition-colors"} />
                <span className={`text-[14px] tracking-tight uppercase ${active ? "font-black" : "font-bold"}`}>{item.label}</span>
              </div>
              {active ? (
                <ChevronRight size={16} strokeWidth={3} className="text-[#100C04]" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-[#BA943A]/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Section (Staff Style) */}
      <div className="mt-10 pt-8 border-t border-white/5">
        <div className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-white/5 border border-white/10 mb-6 group cursor-pointer hover:bg-white/10 transition-colors shadow-inner">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#BA943A] to-[#E2C06A] flex items-center justify-center text-[#100C04] font-black shadow-lg text-xl">
              {user?.userName?.[0]?.toUpperCase() || "I"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-emerald-500 border-2 border-[#100C04] rounded-full shadow-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-black text-white truncate tracking-tight uppercase">
              {user?.userName || "Investor"}
            </p>
            <div className="flex items-center gap-2 mt-1 opacity-60">
              <ShieldCheck size={12} className="text-[#BA943A]" />
              <p className="text-[10px] text-[#BA943A] font-black tracking-widest uppercase">Verified Node</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-4 w-full px-6 py-4 text-[11px] font-black uppercase tracking-widest text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl transition-all border border-rose-500/20 shadow-xl shadow-rose-900/10 group"
        >
          <LogOut size={18} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
          Terminate Session
        </button>
      </div>
    </div>
  );
}