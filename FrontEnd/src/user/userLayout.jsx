import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slice/Authslice";
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
  Sparkles,
  GalleryHorizontalEnd,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/user/dashboard" },
  { icon: Briefcase, label: "Portfolio", to: "/user/portfolio" },
  { icon: Wallet, label: "Wallet", to: "/user/wallet" },
  { type: "section", label: "TRADE" },
  { icon: TrendingUp, label: "Buy Gold", to: "/user/buy/gold", accent: "gold" },
  { icon: TrendingUp, label: "Buy Silver", to: "/user/buy/silver", accent: "silver" },
  { icon: TrendingDown, label: "Sell Gold", to: "/user/sell/gold", accent: "sell" },
  { icon: TrendingDown, label: "Sell Silver", to: "/user/sell/silver", accent: "sell" },
  { type: "section", label: "MANAGE" },
  { icon: RefreshCcw, label: "SIP", to: "/user/sip" },
  { icon: ClipboardList, label: "Transactions", to: "/user/transactions" },
  { icon: GalleryHorizontalEnd, label: "Metal Gallery", to: "/user/gallery" },
  { type: "section", label: "PROFILE" },
  { icon: ShieldCheck, label: "My Account", to: "/user/account" },
];

const ACCENT_STYLES = {
  gold: { color: "#c9a84c", bg: "rgba(201,168,76,0.12)" },
  silver: { color: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
  sell: { color: "#f87171", bg: "rgba(248,113,113,0.10)" },
};

export default function UserLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const sidebarRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tradeDropdown, setTradeDropdown] = useState(false);
  const tradeRef = useRef(null);

  const handleLogout = () => { dispatch(logout()); navigate("/login"); };
  const isActive = (path) => location.pathname === path;

  // Close sidebar on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [sidebarOpen]);

  // Close trade dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (tradeDropdown && tradeRef.current && !tradeRef.current.contains(e.target)) {
        setTradeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [tradeDropdown]);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#FDFBF7", fontFamily: "'Outfit', sans-serif" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" />
      <style>{`
        .sidebar-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); backdrop-filter:blur(2px); z-index:40; transition:opacity 0.25s; }
        .sidebar-panel { position:fixed; top:0; left:0; height:100vh; width:268px; background:#100C04; z-index:50; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s cubic-bezier(.4,0,.2,1); overflow:hidden; }
        .sidebar-panel.open { transform:translateX(0); }
        .nav-link { display:flex; align-items:center; gap:12px; padding:11px 16px; border-radius:14px; transition:all 0.18s; cursor:pointer; text-decoration:none; font-size:14.5px; font-weight:500; color:#88857F; }
        .nav-link:hover { background:rgba(255,255,255,0.06); color:#fff; }
        .nav-link.active { background:#BA943A; color:#100C04; box-shadow:0 4px 14px rgba(186,148,58,0.3); }
        .custom-scrollbar::-webkit-scrollbar { width:4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background:transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background:rgba(186,148,58,0.2); border-radius:4px; }
        .topnav-btn { display:flex; align-items:center; gap:8px; padding:8px 16px; border-radius:10px; border:none; cursor:pointer; font-family:'Outfit',sans-serif; font-size:13.5px; font-weight:600; transition:all 0.18s; }
        .topnav-btn:hover { transform:translateY(-1px); }
        .trade-dropdown { position:absolute; top:calc(100% + 8px); right:0; background:#fff; border:1px solid #ede8d8; border-radius:14px; box-shadow:0 8px 32px rgba(0,0,0,0.1); width:200px; overflow:hidden; z-index:30; animation:dropIn 0.15s ease; }
        @keyframes dropIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .trade-item { display:flex; align-items:center; gap:10px; padding:11px 16px; font-size:13.5px; font-weight:500; color:#1a1200; text-decoration:none; transition:background 0.12s; }
        .trade-item:hover { background:#fafaf7; }
        .hamburger-btn { width:38px; height:38px; border-radius:10px; border:1px solid #ede8d8; background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; color:#555; }
        .hamburger-btn:hover { background:#fafaf7; border-color:#d4c8a0; }
        @media (max-width:768px) { .topnav-center { display:none !important; } }
      `}</style>

      {/* ── TOP NAVIGATION BAR ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "rgba(253,251,247,0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #ede8d8",
        padding: "0 1.5rem", height: "64px",
        display: "flex", alignItems: "center", gap: "16px",
        boxShadow: "0 1px 12px rgba(0,0,0,0.04)",
      }}>

        {/* Left: Hamburger + Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "0 0 auto" }}>
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>
          <Link to="/user/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.45rem", fontWeight: 700, color: "#1a1200" }}>Luna</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.45rem", fontWeight: 700, color: "#BA943A" }}>Gold</span>
          </Link>
        </div>

        {/* Center: Page title area / breadcrumb */}
        <div className="topnav-center" style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px", color: "#bbb" }}>
            {NAV_ITEMS.find(n => n.to === location.pathname)?.label || ""}
          </span>
        </div>

        {/* Right: Buy / Sell CTAs + Trade dropdown + user */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "auto" }}>
          {/* Gallery Button */}
          <Link to="/user/gallery" className="topnav-btn" style={{ background: "linear-gradient(135deg,#c9a84c,#e2c06a)", color: "#0a0800", boxShadow: "0 3px 12px rgba(201,168,76,0.28)" }}>
            <GalleryHorizontalEnd size={14} />
            <span>Gallery</span>
          </Link>
          {/* Buy Gold */}
          <Link to="/user/buy/gold" className="topnav-btn" style={{ background: "linear-gradient(135deg,#c9a84c,#e2c06a)", color: "#0a0800", boxShadow: "0 3px 12px rgba(201,168,76,0.28)" }}>
            <TrendingUp size={14} />
            <span>Buy Gold</span>
          </Link>

          {/* Buy Silver */}
          <Link to="/user/buy/silver" className="topnav-btn" style={{ background: "linear-gradient(135deg,#94a3b8,#cbd5e1)", color: "#0f172a", boxShadow: "0 3px 12px rgba(148,163,184,0.22)" }}>
            <TrendingUp size={14} />
            <span style={{ display: "none" }}>Buy Silver</span>
            <span className="topnav-center" style={{ display: "flex" }}>Buy Silver</span>
          </Link>

          {/* More Trade dropdown */}
          <div ref={tradeRef} style={{ position: "relative" }}>
            <button
              className="topnav-btn"
              style={{ background: "#fff", color: "#555", border: "1px solid #ede8d8" }}
              onClick={() => setTradeDropdown(v => !v)}
            >
              <span>Sell</span>
              <ChevronDown size={13} style={{ transition: "transform 0.18s", transform: tradeDropdown ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>

            {tradeDropdown && (
              <div className="trade-dropdown">
                <div style={{ padding: "8px 12px 4px", fontSize: "10px", fontWeight: 700, color: "#bbb", letterSpacing: "0.1em", textTransform: "uppercase" }}>Sell</div>
                <Link to="/user/sell/gold" className="trade-item" onClick={() => setTradeDropdown(false)}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#fbbf24,#d97706)", display: "inline-block", flexShrink: 0 }} />
                  Sell Gold
                </Link>
                <Link to="/user/sell/silver" className="trade-item" onClick={() => setTradeDropdown(false)}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#e2e8f0,#94a3b8)", display: "inline-block", flexShrink: 0 }} />
                  Sell Silver
                </Link>
                <div style={{ height: "1px", background: "#f5f0e8", margin: "4px 0" }} />
                <div style={{ padding: "4px 12px 8px", fontSize: "10px", fontWeight: 700, color: "#bbb", letterSpacing: "0.1em", textTransform: "uppercase" }}>Other</div>
                <Link to="/user/sip" className="trade-item" onClick={() => setTradeDropdown(false)}>
                  <RefreshCcw size={16} style={{ color: "#6366f1", flexShrink: 0 }} />
                  Setup SIP
                </Link>
                <Link to="/user/wallet" className="trade-item" onClick={() => setTradeDropdown(false)}>
                  <Wallet size={16} style={{ color: "#f97316", flexShrink: 0 }} />
                  Add Money
                </Link>
              </div>
            )}
          </div>

          {/* User avatar */}
          <Link to="/user/account" style={{ textDecoration: "none" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg,#c9a84c,#e2c06a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#0a0800", fontWeight: 700, fontSize: "14px",
              border: "2px solid rgba(201,168,76,0.25)",
              cursor: "pointer",
            }}>
              {user?.userName?.[0]?.toUpperCase() || "U"}
            </div>
          </Link>
        </div>
      </header>

      {/* ── SIDEBAR OVERLAY ── */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── SIDEBAR PANEL ── */}
      <aside ref={sidebarRef} className={`sidebar-panel${sidebarOpen ? " open" : ""}`}>

        {/* Sidebar Header */}
        <div style={{ padding: "20px 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", fontWeight: 700 }}>
              <span style={{ color: "#fff" }}>Luna </span>
              <span style={{ color: "#BA943A" }}>Gold</span>
            </div>
            <p style={{ color: "#88857F", fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: "2px", opacity: 0.6 }}>
              Investor Portal
            </p>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "rgba(255,255,255,0.06)", color: "#88857F", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} />
          </button>
        </div>

        {/* User Card */}
        <div style={{ margin: "12px 16px", background: "#1A160F", borderRadius: "14px", padding: "14px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg,#BA943A,#E2C06A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#100C04", fontWeight: 700, fontSize: "18px", flexShrink: 0 }}>
            {user?.userName?.[0]?.toUpperCase() || "U"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.userName || "User"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "3px" }}>
              <ShieldCheck size={11} style={{ color: "#BA943A" }} />
              <span style={{ color: "#88857F", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {user?.kycStatus === "VERIFIED" ? "Verified" : "Unverified"}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>

          {user?.role !== "user" && (
            <Link
              to={user?.role === "admin" ? "/admin/dashboard" : "/staff/dashboard"}
              className="nav-link"
              style={{ background: "rgba(201,168,76,0.1)", color: "#c9a84c", marginBottom: "12px", fontWeight: 600 }}
            >
              <ShieldPlus size={18} />
              Management Portal
            </Link>
          )}

          {NAV_ITEMS.map((item, i) => {
            if (item.type === "section") {
              return (
                <div key={i} style={{ padding: "18px 12px 6px", fontSize: "10px", fontWeight: 700, color: "#88857F", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  {item.label}
                </div>
              );
            }

            const active = isActive(item.to);
            const Icon = item.icon;
            const accent = item.accent ? ACCENT_STYLES[item.accent] : null;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-link${active ? " active" : ""}`}
                style={
                  active ? {} :
                    accent ? { color: accent.color } : {}
                }
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.5 : 2}
                  style={active ? { color: "#100C04" } : accent ? { color: accent.color } : {}}
                />
                {item.label}

                {/* Accent dot for buy/sell items */}
                {accent && !active && (
                  <span style={{
                    marginLeft: "auto", width: "7px", height: "7px",
                    borderRadius: "50%", background: accent.color,
                    opacity: 0.7,
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 12px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              width: "100%", padding: "11px 16px", borderRadius: "14px",
              border: "none", background: "transparent",
              color: "#FF5D5D", fontFamily: "'Outfit',sans-serif",
              fontSize: "14.5px", fontWeight: 500, cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,93,93,0.08)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <LogOut size={18} strokeWidth={2} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}