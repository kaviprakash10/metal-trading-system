import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slice/Authslice";
import { fetchCurrentPrices } from "../slice/Priceslice";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const STAFF_NAV = [
  { icon: "⬡",  label: "Dashboard",    to: "/staff/dashboard" },
  { section: "Manage" },
  { icon: "👥",  label: "Users",        to: "/staff/users" },
  { icon: "🪪",  label: "KYC",          to: "/staff/kyc" },
  { icon: "📋",  label: "Transactions", to: "/staff/transactions" },
  { section: "PUBLIC" },
  { icon: "🌍",  label: "User Portal",  to: "/user/dashboard" },
];

export default function StaffLayout({ children, active }) {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector((s) => s.auth);
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
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f5f0", fontFamily: "'DM Sans', sans-serif" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" />

      {/* ── SIDEBAR ── */}
      <aside style={{ width: "220px", flexShrink: 0, background: "#0f1623", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>

        {/* Brand */}
        <div style={{ padding: "1.5rem 1.3rem 1rem", borderBottom: "1px solid rgba(99,179,237,0.1)" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 700 }}>
            <span style={{ color: "#fff" }}>Luna </span>
            <span style={{ color: "#63b3ed" }}>Staff</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.65rem", marginTop: "0.1rem" }}>
            Support Portal
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0.75rem 0", overflowY: "auto" }}>
          {STAFF_NAV.map((item, i) =>
            item.section ? (
              <div key={i} style={{ padding: "0.4rem 1.2rem 0.2rem", color: "rgba(255,255,255,0.25)", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "0.5rem" }}>
                {item.section}
              </div>
            ) : (
              <Link key={item.to} to={item.to} style={{
                display: "flex", alignItems: "center", gap: "0.7rem",
                padding: "0.6rem 1.1rem", margin: "0.1rem 0.5rem",
                borderRadius: "8px", textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: active === item.to ? 600 : 400,
                color: active === item.to ? "#63b3ed" : "rgba(255,255,255,0.55)",
                background: active === item.to ? "rgba(99,179,237,0.1)" : "transparent",
                transition: "all 0.15s",
              }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          )}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "0.85rem 0.5rem", borderTop: "1px solid rgba(99,179,237,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.65rem 0.8rem", borderRadius: "10px", background: "rgba(255,255,255,0.04)", marginBottom: "0.4rem" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#63b3ed,#90cdf4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f1623", fontWeight: 700, fontSize: "0.8rem" }}>
              {user?.userName?.[0]?.toUpperCase() || "S"}
            </div>
            <div>
              <div style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 500 }}>{user?.userName || "Staff"}</div>
              <div style={{ color: "#63b3ed", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.06em" }}>STAFF</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "0.7rem", padding: "0.6rem 1.1rem", margin: "0.1rem 0.5rem", borderRadius: "8px", border: "none", fontSize: "0.85rem", color: "#f87171", background: "transparent", cursor: "pointer", width: "calc(100% - 1rem)", textAlign: "left" }}>
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 1.75rem", height: "58px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 700, color: "#1a1200" }}>
            Luna Staff Portal
          </div>
          <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.82rem", color: "#999" }}>
            <span>🟡 Gold <strong style={{ color: "#c9a84c" }}>₹{fmt(current.gold?.pricePerGram)}</strong></span>
            <span>⚪ Silver <strong style={{ color: "#888" }}>₹{fmt(current.silver?.pricePerGram)}</strong></span>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
