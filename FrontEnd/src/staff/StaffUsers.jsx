import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../slice/Adminslice";
import StaffLayout from "./StaffLayout";

const fmt     = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const KYC_CONFIG = {
  VERIFIED: { bg: "#dcfce7", color: "#16a34a" },
  PENDING:  { bg: "#fef9c3", color: "#854d0e" },
  REJECTED: { bg: "#fee2e2", color: "#dc2626" },
};

export default function StaffUsers() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((s) => s.admin);

  const [search,    setSearch]    = useState("");
  const [kycFilter, setKycFilter] = useState("All");
  const [sortBy,    setSortBy]    = useState("newest");
  const [selected,  setSelected]  = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const filtered = (users || [])
    .filter((u) => kycFilter === "All" || u.kycStatus === kycFilter)
    .filter((u) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return u.userName?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s);
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "wallet") return (b.walletBalance || 0) - (a.walletBalance || 0);
      if (sortBy === "name")   return a.userName?.localeCompare(b.userName);
      return 0;
    });

  const totalUsers = (users || []).length;

  return (
    <StaffLayout active="/staff/users">

      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.9rem", fontWeight: 700, color: "#1a1200", margin: 0 }}>
          All Users
        </h1>
        <p style={{ color: "#999", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          View all registered users. Contact admin to change roles.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Users",  value: totalUsers,                                                    icon: "👥", color: "#1a1200" },
          { label: "Verified",     value: (users || []).filter((u) => u.kycStatus === "VERIFIED").length, icon: "✅", color: "#16a34a" },
          { label: "Pending KYC",  value: (users || []).filter((u) => u.kycStatus === "PENDING").length,  icon: "⏳", color: "#854d0e" },
          { label: "Rejected",     value: (users || []).filter((u) => u.kycStatus === "REJECTED").length, icon: "❌", color: "#dc2626" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} style={{ background: "#fff", borderRadius: "14px", padding: "1.1rem 1.2rem", border: "1px solid #e2e8f0", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>{icon}</div>
            <div style={{ fontSize: "0.65rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.2rem" }}>{label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "0.85rem 1.1rem", marginBottom: "1.1rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#bbb" }}>🔍</span>
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "0.52rem 0.75rem 0.52rem 2.1rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.85rem", color: "#1a1200", outline: "none", background: "#fafaf9", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {["All", "VERIFIED", "PENDING", "REJECTED"].map((f) => (
            <button key={f} onClick={() => setKycFilter(f)}
              style={{ padding: "0.38rem 0.8rem", borderRadius: "100px", border: "none", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", background: kycFilter === f ? "#0f1623" : "#f1f5f9", color: kycFilter === f ? "#63b3ed" : "#888" }}>
              {f}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "0.42rem 0.8rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fafaf9", color: "#888", fontSize: "0.78rem", outline: "none", cursor: "pointer" }}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="wallet">Highest Wallet</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2.5fr 2fr 1.2fr 1.4fr 1.2fr 1.2fr", padding: "0.7rem 1.25rem", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          {["User", "Email", "Wallet", "KYC Status", "Role", "Joined"].map((h) => (
            <div key={h} style={{ fontSize: "0.62rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</div>
          ))}
        </div>

        {loading && (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <div style={{ width: "28px", height: "28px", border: "3px solid #63b3ed", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center", color: "#bbb", fontSize: "0.88rem" }}>No users found.</div>
        )}

        {!loading && filtered.map((u, i) => (
          <div key={u._id} onClick={() => setSelected(selected?._id === u._id ? null : u)}
            style={{ display: "grid", gridTemplateColumns: "2.5fr 2fr 1.2fr 1.4fr 1.2fr 1.2fr", padding: "0.9rem 1.25rem", borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none", cursor: "pointer", background: selected?._id === u._id ? "#f0f9ff" : "transparent", transition: "background 0.15s" }}
            onMouseEnter={(e) => { if (selected?._id !== u._id) e.currentTarget.style.background = "#f8fafc"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = selected?._id === u._id ? "#f0f9ff" : "transparent"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#63b3ed,#90cdf4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f1623", fontWeight: 700, fontSize: "0.8rem", flexShrink: 0 }}>
                {u.userName?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a1200" }}>{u.userName}</div>
                <div style={{ fontSize: "0.68rem", color: "#bbb" }}>ID: {u._id?.slice(-6)}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", fontSize: "0.83rem", color: "#64748b" }}>{u.email}</div>
            <div style={{ display: "flex", alignItems: "center", fontWeight: 600, fontSize: "0.85rem", color: "#1a1200" }}>₹{fmt(u.walletBalance)}</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ padding: "0.2rem 0.65rem", borderRadius: "100px", fontSize: "0.72rem", fontWeight: 600, background: KYC_CONFIG[u.kycStatus]?.bg, color: KYC_CONFIG[u.kycStatus]?.color }}>
                {u.kycStatus}
              </span>
            </div>
            {/* Role — read only, no dropdown */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ padding: "0.2rem 0.65rem", borderRadius: "100px", fontSize: "0.72rem", fontWeight: 600, background: "#f1f5f9", color: "#64748b" }}>
                {u.role}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", fontSize: "0.78rem", color: "#bbb" }}>{fmtDate(u.createdAt)}</div>
          </div>
        ))}

        {!loading && filtered.length > 0 && (
          <div style={{ padding: "0.7rem 1.25rem", background: "#f8fafc", borderTop: "1px solid #e2e8f0", fontSize: "0.75rem", color: "#94a3b8" }}>
            Showing {filtered.length} of {totalUsers} users
          </div>
        )}
      </div>

      {/* User detail panel */}
      {selected && (
        <div style={{ marginTop: "1.25rem", background: "#fff", borderRadius: "16px", border: "1px solid rgba(99,179,237,0.2)", boxShadow: "0 4px 24px rgba(99,179,237,0.08)", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "linear-gradient(135deg,#63b3ed,#90cdf4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f1623", fontWeight: 700, fontSize: "1rem" }}>
                {selected.userName?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 700, color: "#1a1200" }}>{selected.userName}</div>
                <div style={{ fontSize: "0.75rem", color: "#aaa" }}>{selected.email}</div>
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#bbb", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.85rem" }}>
            {[
              { label: "Wallet",  value: `₹${fmt(selected.walletBalance)}`, color: "#c9a84c" },
              { label: "Gold",    value: `${selected.goldBalance || 0}g`,    color: "#c9a84c" },
              { label: "Silver",  value: `${selected.silverBalance || 0}g`,  color: "#94a3b8" },
              { label: "KYC",     value: selected.kycStatus,                 color: KYC_CONFIG[selected.kycStatus]?.color },
              { label: "Role",    value: selected.role?.toUpperCase(),        color: "#64748b" },
              { label: "Joined",  value: fmtDate(selected.createdAt),        color: "#888" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ padding: "0.85rem", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "0.62rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>{label}</div>
                <div style={{ fontWeight: 700, fontSize: "0.92rem", color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </StaffLayout>
  );
}
