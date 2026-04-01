import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../slice/Adminslice";
import { fetchAllTransactions } from "../slice/Adminslice";
import StaffLayout from "./StaffLayout";

const fmt     = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtG    = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 4 });
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = (d) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

export default function StaffDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { users, transactions, loading } = useSelector((s) => s.admin);
  const { current } = useSelector((s) => s.price);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllTransactions());
  }, [dispatch]);

  const pendingKyc  = (users || []).filter((u) => u.kycStatus === "PENDING").length;
  const verifiedKyc = (users || []).filter((u) => u.kycStatus === "VERIFIED").length;
  const rejectedKyc = (users || []).filter((u) => u.kycStatus === "REJECTED").length;
  const recentTx    = (transactions || []).slice(0, 6);

  return (
    <StaffLayout active="/staff/dashboard">

      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.9rem", fontWeight: 700, color: "#1a1200", margin: 0 }}>
          Welcome, {user?.userName || "Staff"} 👋
        </h1>
        <p style={{ color: "#999", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* ── QUICK STATS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Users",   value: (users || []).length,           icon: "👥", color: "#1a1200",  to: "/staff/users" },
          { label: "Pending KYC",   value: pendingKyc,                     icon: "⏳", color: "#854d0e",  to: "/staff/kyc",   highlight: pendingKyc > 0 },
          { label: "Verified KYC",  value: verifiedKyc,                    icon: "✅", color: "#16a34a",  to: "/staff/kyc" },
          { label: "Rejected KYC",  value: rejectedKyc,                    icon: "❌", color: "#dc2626",  to: "/staff/kyc" },
          { label: "Transactions",  value: (transactions || []).length,    icon: "📋", color: "#1a1200",  to: "/staff/transactions" },
        ].map(({ label, value, icon, color, to, highlight }) => (
          <Link key={label} to={to} style={{ textDecoration: "none" }}>
            <div style={{
              background: highlight ? "linear-gradient(135deg,#fef9c3,#fef3c7)" : "#fff",
              borderRadius: "14px", padding: "1.1rem 1.2rem",
              border: `1px solid ${highlight ? "#fde68a" : "#e2e8f0"}`,
              boxShadow: highlight ? "0 2px 12px rgba(234,179,8,0.15)" : "0 1px 8px rgba(0,0,0,0.04)",
              cursor: "pointer", transition: "transform 0.15s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>{icon}</div>
              <div style={{ fontSize: "0.65rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.2rem" }}>{label}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 700, color }}>
                {value}
                {highlight && <span style={{ fontSize: "0.75rem", marginLeft: "0.4rem", color: "#92400e" }}>needs review</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── PENDING KYC ALERT ── */}
      {pendingKyc > 0 && (
        <div style={{ marginBottom: "1.5rem", padding: "1rem 1.25rem", background: "#fffbeb", borderRadius: "14px", border: "1px solid #fde68a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#92400e" }}>
              ⏳ {pendingKyc} user{pendingKyc > 1 ? "s" : ""} waiting for KYC verification
            </div>
            <div style={{ fontSize: "0.78rem", color: "#a16207", marginTop: "0.2rem" }}>
              Review and update their status to unblock trading.
            </div>
          </div>
          <Link to="/staff/kyc" style={{ padding: "0.5rem 1.1rem", borderRadius: "8px", background: "#c9a84c", color: "#0a0800", textDecoration: "none", fontWeight: 600, fontSize: "0.82rem", flexShrink: 0 }}>
            Review KYC →
          </Link>
        </div>
      )}

      {/* ── QUICK ACTION CARDS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { icon: "🪪", label: "Update KYC",       sub: "Verify or reject users",     to: "/staff/kyc",          accent: "#63b3ed" },
          { icon: "👥", label: "View Users",        sub: "Browse all registered users", to: "/staff/users",        accent: "#c9a84c" },
          { icon: "📋", label: "View Transactions", sub: "All platform trades",         to: "/staff/transactions",  accent: "#94a3b8" },
        ].map(({ icon, label, sub, to, accent }) => (
          <Link key={to} to={to} style={{ textDecoration: "none" }}>
            <div style={{ background: "#fff", borderRadius: "14px", padding: "1.25rem", border: "1px solid #e2e8f0", boxShadow: "0 1px 8px rgba(0,0,0,0.04)", transition: "all 0.15s", cursor: "pointer" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 4px 16px ${accent}22`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.04)"; }}
            >
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", marginBottom: "0.85rem" }}>{icon}</div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1a1200" }}>{label}</div>
              <div style={{ fontSize: "0.75rem", color: "#aaa", marginTop: "0.2rem" }}>{sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── RECENT TRANSACTIONS ── */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #f0f4f8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontWeight: 700, color: "#1a1200" }}>Recent Transactions</div>
          <Link to="/staff/transactions" style={{ fontSize: "0.78rem", color: "#63b3ed", textDecoration: "none", fontWeight: 500 }}>View All →</Link>
        </div>

        {loading ? (
          <div style={{ padding: "2.5rem", textAlign: "center" }}>
            <div style={{ width: "28px", height: "28px", border: "3px solid #63b3ed", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : recentTx.length === 0 ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: "#bbb", fontSize: "0.88rem" }}>No transactions yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {recentTx.map((tx, i) => (
              <div key={tx._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 1.25rem", borderBottom: i < recentTx.length - 1 ? "1px solid #f5f5f5" : "none" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#fafaf9"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: tx.type?.startsWith("BUY") ? "#fee2e2" : "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
                    {tx.asset === "GOLD" ? "🟡" : "⚪"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.83rem", color: "#1a1200" }}>{tx.user?.userName || "—"}</div>
                    <div style={{ fontSize: "0.7rem", color: "#bbb" }}>{tx.type?.replace("_", " ")} · {fmtG(tx.grams)}g</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: tx.type?.startsWith("BUY") ? "#dc2626" : "#16a34a" }}>
                    {tx.type?.startsWith("BUY") ? "−" : "+"}₹{fmt(tx.totalAmount || tx.amount)}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#bbb" }}>{fmtDate(tx.createdAt)} · {fmtTime(tx.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </StaffLayout>
  );
}
