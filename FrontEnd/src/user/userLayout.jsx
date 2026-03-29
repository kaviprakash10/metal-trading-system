import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slice/Authslice";
import {
  LayoutDashboard,
  Briefcase,
  Wallet,
  ShoppingBag,
  ArrowUpRight,
  RefreshCcw,
  ClipboardList,
  LogOut,
  ShieldCheck,
  CircleDot,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/user/dashboard" },
  { icon: Briefcase, label: "Portfolio", to: "/user/portfolio" },
  { icon: Wallet, label: "Wallet", to: "/user/wallet" },
  { type: "section", label: "TRADE" },
  {
    icon: CircleDot,
    label: "Buy Gold",
    to: "/user/buy/gold",
    color: "text-yellow-500",
  },
  {
    icon: CircleDot,
    label: "Buy Silver",
    to: "/user/buy/silver",
    color: "text-blue-400",
  },
  {
    icon: ArrowUpRight,
    label: "Sell Gold",
    to: "/user/sell/gold",
    color: "text-blue-500",
  },
  {
    icon: ArrowUpRight,
    label: "Sell Silver",
    to: "/user/sell/silver",
    color: "text-blue-500",
  },
  { type: "section", label: "MANAGE" },
  { icon: RefreshCcw, label: "SIP", to: "/user/sip" },
  { icon: ClipboardList, label: "Transactions", to: "/user/transactions" },
  { type: "section", label: "PROFILE" },
  { icon: ShieldCheck, label: "My Account", to: "/user/account" },
];

export default function UserLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans selection:bg-yellow-100">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap"
      />

      {/* ── SIDEBAR ── */}
      <aside className="w-64 bg-[#100C04] text-white flex flex-col sticky top-0 h-screen shadow-2xl z-20 overflow-hidden">
        {/* Logo Section */}
        <div className="p-8 pb-6">
          <div className="flex flex-col">
            <h1 className="font-serif text-3xl font-bold tracking-tight">
              <span className="text-white">Luna </span>
              <span className="text-[#BA943A]">Gold</span>
            </h1>
            <p className="text-[#88857F] text-xs font-medium mt-1 tracking-wider uppercase opacity-60">
              Investor Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 custom-scrollbar">
          <div className="space-y-1.5">
            {NAV_ITEMS.map((item, index) => {
              if (item.type === "section") {
                return (
                  <div key={index} className="pt-6 pb-2 px-4">
                    <p className="text-[#88857F] text-[10px] font-bold tracking-[0.2em] uppercase">
                      {item.label}
                    </p>
                  </div>
                );
              }

              const active = isActive(item.to);
              const Icon = item.icon;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                    active
                      ? "bg-[#BA943A] text-[#100C04] shadow-lg shadow-yellow-900/20"
                      : "text-[#88857F] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon
                    size={20}
                    className={`${active ? "text-[#100C04]" : item.color || "text-[#88857F] group-hover:text-white"}`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span
                    className={`text-[15px] font-medium ${active ? "font-semibold" : ""}`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 mt-auto border-t border-white/5 bg-[#0A0804]">
          <div className="bg-[#1A160F] rounded-2xl p-4 mb-3 flex items-center gap-4 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#BA943A] to-[#E2C06A] flex items-center justify-center text-[#100C04] font-bold text-xl shadow-inner">
              {user?.userName?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {user?.userName || "User"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck size={12} className="text-[#BA943A]" />
                <span className="text-[#88857F] text-[10px] font-bold tracking-wider uppercase">
                  {user?.kycStatus === "VERIFIED" ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-2xl text-[#FF5D5D] hover:bg-[#FF5D5D]/10 transition-colors font-medium text-[15px]"
          >
            <LogOut size={20} strokeWidth={2} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
