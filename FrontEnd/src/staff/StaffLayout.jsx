import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slice/Authslice";
import { fetchCurrentPrices } from "../slice/Priceslice";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  UserRoundCheck,
  ReceiptText,
  ExternalLink,
  LogOut,
  ChevronRight,
  TrendingUp,
  Coins,
  ShieldCheck,
  Bell,
  Search,
} from "lucide-react";
import logo from "../assets/logo.png";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const STAFF_NAV = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/staff/dashboard" },
  { section: "Administration" },
  { icon: Users, label: "User Registry", to: "/staff/users" },
  { icon: UserRoundCheck, label: "KYC Verification", to: "/staff/kyc" },
  { icon: ReceiptText, label: "Transactions", to: "/staff/transactions" },
  { section: "Systems" },
  { icon: ExternalLink, label: "Customer Portal", to: "/user/dashboard" },
];

export default function StaffLayout({ children, active }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const { current } = useSelector((s) => s.price);

  useEffect(() => {
    dispatch(fetchCurrentPrices());
    const interval = setInterval(() => dispatch(fetchCurrentPrices()), 180000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap"
      />

      {/* ── Background Pattern ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── SIDEBAR ── */}
      <aside className="w-72 flex-shrink-0 bg-[#0F172A] flex flex-col sticky top-0 h-screen z-20 shadow-[4px_0_24px_rgba(0,0,0,0.1)] border-r border-slate-800">
        {/* Brand Header */}
        <div className="p-8 pb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <img src={logo} alt="logo" className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-black tracking-tight text-white leading-none">
                Luna
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.25em] text-slate-400 font-extrabold">
                  Staff Terminal
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {STAFF_NAV.map((item, i) =>
            item.section ? (
              <div
                key={i}
                className="px-5 pt-8 pb-2 text-[10px] uppercase font-black tracking-[0.3em] text-slate-500/80"
              >
                {item.section}
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 relative border ${
                  active === item.to || location.pathname === item.to
                    ? "bg-amber-500 border-amber-400 text-slate-900 shadow-[0_8px_16px_rgba(245,158,11,0.2)]"
                    : "text-slate-400 border-transparent hover:bg-slate-800/60 hover:text-slate-100 hover:border-slate-700/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon
                    size={20}
                    className={
                      active === item.to || location.pathname === item.to
                        ? "text-slate-900"
                        : "text-slate-500 group-hover:text-amber-500 transition-colors"
                    }
                    strokeWidth={
                      active === item.to || location.pathname === item.to
                        ? 2.5
                        : 2
                    }
                  />
                  <span
                    className={`text-[13px] tracking-tight ${active === item.to || location.pathname === item.to ? "font-extrabold" : "font-semibold"}`}
                  >
                    {item.label}
                  </span>
                </div>
                {active === item.to || location.pathname === item.to ? (
                  <ChevronRight size={14} className="text-slate-900" />
                ) : (
                  <div className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-amber-500/50" />
                )}
              </Link>
            ),
          )}
        </nav>

        {/* Bottom Profile Section */}
        <div className="p-6 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-indigo-500/5 border border-indigo-500/10 mb-4 group cursor-pointer hover:bg-indigo-500/10 transition-colors">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 text-lg">
                {user?.userName?.[0]?.toUpperCase() || "S"}
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0F172A] rounded-full shadow-sm"
                title="Online"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-black text-white truncate leading-tight tracking-tight">
                {user?.userName || "Staff Member"}
              </p>
              <div className="flex items-center gap-1 mt-1 opacity-60">
                <ShieldCheck size={10} className="text-indigo-400" />
                <p className="text-[9px] text-indigo-400 font-extrabold tracking-widest uppercase">
                  Verified Analyst
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {/* logout button */}
            <button
              onClick={handleLogout}
              className="flex-[3] flex items-center justify-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl transition-all border border-rose-500/20 shadow-lg shadow-rose-500/0 hover:shadow-rose-500/20"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* Topbar */}
        <header className="h-[88px] bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-10 flex items-center justify-between sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-5">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <h2 className="text-2xl font-serif font-black text-slate-900 capitalize tracking-tight">
                {location.pathname.split("/").pop()?.replace("-", " ") ||
                  "Terminal"}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Luna Finance Group
                </span>
                <ChevronRight size={10} className="text-slate-300" />
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                  Admin Control
                </span>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-8">
            {/* Live Market Feeds */}
            <div className="flex gap-4 p-1.5 bg-slate-100/50 rounded-[1.5rem] border border-slate-200/50">
              {[
                {
                  label: "Gold (AU)",
                  price: current.gold?.pricePerGram,
                  color: "text-amber-500",
                  bg: "bg-amber-50",
                  border: "border-amber-100",
                },
                {
                  label: "Silver (AG)",
                  price: current.silver?.pricePerGram,
                  color: "text-slate-400",
                  bg: "bg-slate-50",
                  border: "border-slate-200",
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className={`px-5 py-2.5 ${m.bg} rounded-2xl shadow-sm border ${m.border} flex items-center gap-4 group transition-all hover:scale-[1.02]`}
                >
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                      {m.label}
                    </span>
                    <span className="text-sm font-black text-slate-900 tracking-tight">
                      ₹{fmt(m.price)}
                    </span>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-xl ${m.bg} border ${m.border} flex items-center justify-center text-slate-400 shadow-inner group-hover:text-emerald-500 transition-colors`}
                  >
                    <TrendingUp size={14} />
                  </div>
                </div>
              ))}
            </div>

            {/* Notifications placeholder toggle */}
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors relative">
              <Bell size={20} />
              <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </div>
          </div>
        </header>

        {/* Page Content Scroll Area */}
        <div className="p-10 flex-1">
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
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        
        @font-face {
          font-family: 'Outfit';
          font-display: swap;
        }
        
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
}
