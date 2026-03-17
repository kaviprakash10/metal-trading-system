import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  VERIFIED: { bg: "#dcfce7", color: "#16a34a" },
  PENDING:  { bg: "#fef9c3", color: "#854d0e" },
  REJECTED: { bg: "#fee2e2", color: "#dc2626" },
};

const ROLE_CONFIG = {
  admin: { bg: "rgba(201,168,76,0.12)", color: "#c9a84c", border: "rgba(201,168,76,0.3)" },
  user:  { bg: "#f5f5f5",               color: "#666",    border: "#e5e5e5" },
  staff: { bg: "#eff6ff",               color: "#3b82f6", border: "#bfdbfe" },
};

export default function ManageUsers() {
  const dispatch = useDispatch();
  const { users, loading, error, successMessage } = useSelector((s) => s.admin);

  const [search,     setSearch]     = useState("");
  const [kycFilter,  setKycFilter]  = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortBy,     setSortBy]     = useState("newest");
  const [selected,   setSelected]   = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const filtered = (users || [])
    .filter((u) => {
      if (kycFilter  !== "All" && u.kycStatus !== kycFilter)  return false;
      if (roleFilter !== "All" && u.role      !== roleFilter)  return false;
      if (search) {
        const s = search.toLowerCase();
        return u.userName?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "wallet") return (b.walletBalance || 0) - (a.walletBalance || 0);
      if (sortBy === "name")   return a.userName?.localeCompare(b.userName);
      return 0;
    });

  const totalUsers = (users || []).length;
  const verified   = (users || []).filter((u) => u.kycStatus === "VERIFIED").length;
  const pending    = (users || []).filter((u) => u.kycStatus === "PENDING").length;
  const admins     = (users || []).filter((u) => u.role === "admin").length;

  return (
    <AdminLayout active="/admin/users">

      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.9rem", fontWeight: 700, color: "#1a1200", margin: 0 }}>
          Manage Users
        </h1>
        <p style={{ color: "#999", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          View all users, update KYC status and roles.
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Users",  value: totalUsers, icon: "👥", color: "#1a1200" },
          { label: "Verified",     value: verified,   icon: "✅", color: "#16a34a" },
          { label: "Pending KYC",  value: pending,    icon: "⏳", color: "#854d0e" },
          { label: "Admins",       value: admins,     icon: "🛡️", color: "#c9a84c" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} style={{ background: "#fff", borderRadius: "14px", padding: "1.1rem 1.2rem", border: "1px solid #ede8d8", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>{icon}</div>
            <div style={{ fontSize: "0.65rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.2rem" }}>{label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Success / Error */}
      {successMessage && (
        <div style={{ marginBottom: "1rem", padding: "0.85rem 1rem", borderRadius: "10px", background: "#dcfce7", border: "1px solid #86efac", color: "#15803d", fontSize: "0.85rem", fontWeight: 500 }}>
          ✓ {successMessage}
        </div>
      )}
      {error && (
        <div style={{ marginBottom: "1rem", padding: "0.85rem 1rem", borderRadius: "10px", background: "#fee2e2", border: "1px solid #fca5a5", color: "#dc2626", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      {/* Filters Bar */}
      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #ede8d8", padding: "1rem 1.25rem", marginBottom: "1.25rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>

        {/* Search */}
        <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#bbb" }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "0.55rem 0.75rem 0.55rem 2.1rem", borderRadius: "8px", border: "1px solid #e5e0d0", fontSize: "0.85rem", color: "#1a1200", outline: "none", background: "#fafaf7", boxSizing: "border-box" }}
          />
        </div>

        {/* KYC filter */}
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {["All", "VERIFIED", "PENDING", "REJECTED"].map((f) => (
            <button key={f} onClick={() => setKycFilter(f)}
              style={{ padding: "0.38rem 0.8rem", borderRadius: "100px", border: "none", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", background: kycFilter === f ? "#1a1200" : "#f5f0e8", color: kycFilter === f ? "#c9a84c" : "#888" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Role filter */}
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {["All", "user", "admin", "staff"].map((f) => (
            <button key={f} onClick={() => setRoleFilter(f)}
              style={{ padding: "0.38rem 0.8rem", borderRadius: "100px", border: "none", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", background: roleFilter === f ? "#0a0a0a" : "#f5f0e8", color: roleFilter === f ? "#fff" : "#888" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "0.42rem 0.8rem", borderRadius: "8px", border: "1px solid #e5e0d0", background: "#fafaf7", color: "#888", fontSize: "0.78rem", outline: "none", cursor: "pointer" }}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="wallet">Highest Wallet</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* User Table */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #ede8d8", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>

        {/* Table Head */}
        <div style={{ display: "grid", gridTemplateColumns: "2.5fr 2fr 1.2fr 1.4fr 1.2fr 1.2fr", padding: "0.7rem 1.25rem", background: "#fafaf7", borderBottom: "1px solid #f0ead8" }}>
          {["User", "Email", "Wallet", "KYC Status", "Role", "Joined"].map((h) => (
            <div key={h} style={{ fontSize: "0.62rem", fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <div style={{ width: "32px", height: "32px", border: "3px solid #c9a84c", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>👤</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 700, color: "#1a1200", marginBottom: "0.4rem" }}>
              {search || kycFilter !== "All" || roleFilter !== "All" ? "No matching users" : "No users yet"}
            </div>
            <div style={{ color: "#bbb", fontSize: "0.85rem" }}>Try adjusting your filters.</div>
          </div>
        )}

        {/* ── ROWS ── */}
        {!loading && filtered.map((u, i) => (
          <div
            key={u._id}
            onClick={() => setSelected(selected?._id === u._id ? null : u)}
            style={{
              display: "grid",
              gridTemplateColumns: "2.5fr 2fr 1.2fr 1.4fr 1.2fr 1.2fr",
              padding: "0.9rem 1.25rem",
              borderBottom: i < filtered.length - 1 ? "1px solid #f5f0e8" : "none",
              cursor: "pointer",
              background: selected?._id === u._id ? "#fffbeb" : "transparent",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { if (selected?._id !== u._id) e.currentTarget.style.background = "#fafaf7"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = selected?._id === u._id ? "#fffbeb" : "transparent"; }}
          >
            {/* Avatar + Name */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#c9a84c,#e2c06a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0800", fontWeight: 700, fontSize: "0.82rem", flexShrink: 0 }}>
                {u.userName?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a1200" }}>{u.userName}</div>
                <div style={{ fontSize: "0.68rem", color: "#bbb" }}>ID: {u._id?.slice(-6)}</div>
              </div>
            </div>

            {/* Email */}
            <div style={{ display: "flex", alignItems: "center", fontSize: "0.83rem", color: "#666" }}>{u.email}</div>

            {/* Wallet */}
            <div style={{ display: "flex", alignItems: "center", fontWeight: 600, fontSize: "0.85rem", color: "#1a1200" }}>₹{fmt(u.walletBalance)}</div>

            {/* KYC Dropdown */}
            <div style={{ display: "flex", alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
              <select
                value={u.kycStatus}
                onChange={(e) => dispatch(updateKycStatus({ userId: u._id, kycStatus: e.target.value }))}
                style={{ padding: "0.3rem 0.65rem", borderRadius: "8px", border: `1px solid ${KYC_CONFIG[u.kycStatus]?.color}33`, background: KYC_CONFIG[u.kycStatus]?.bg, color: KYC_CONFIG[u.kycStatus]?.color, fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", outline: "none" }}
              >
                {["PENDING", "VERIFIED", "REJECTED"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Role Dropdown */}
            <div style={{ display: "flex", alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
              <select
                value={u.role}
                onChange={(e) => dispatch(updateUserRole({ userId: u._id, role: e.target.value }))}
                style={{ padding: "0.3rem 0.65rem", borderRadius: "8px", border: `1px solid ${ROLE_CONFIG[u.role]?.border}`, background: ROLE_CONFIG[u.role]?.bg, color: ROLE_CONFIG[u.role]?.color, fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", outline: "none" }}
              >
                {["user", "admin", "staff"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Joined */}
            <div style={{ display: "flex", alignItems: "center", fontSize: "0.78rem", color: "#bbb" }}>
              {fmtDate(u.createdAt)}
            </div>
          </div>
        ))}

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div style={{ padding: "0.7rem 1.25rem", background: "#fafaf7", borderTop: "1px solid #f0ead8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "#bbb" }}>
              Showing {filtered.length} of {totalUsers} users
            </span>
            {(search || kycFilter !== "All" || roleFilter !== "All") && (
              <button onClick={() => { setSearch(""); setKycFilter("All"); setRoleFilter("All"); }}
                style={{ fontSize: "0.75rem", color: "#c9a84c", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
      {/* ── END TABLE ── */}

      {/* User Detail Panel */}
      {selected && (
        <div style={{ marginTop: "1.25rem", background: "#fff", borderRadius: "16px", border: "1px solid rgba(201,168,76,0.2)", boxShadow: "0 4px 24px rgba(201,168,76,0.08)", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "linear-gradient(135deg,#c9a84c,#e2c06a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0800", fontWeight: 700, fontSize: "1.1rem" }}>
                {selected.userName?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 700, color: "#1a1200" }}>{selected.userName}</div>
                <div style={{ fontSize: "0.78rem", color: "#aaa" }}>{selected.email}</div>
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#bbb", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
            {[
              { label: "Wallet Balance", value: `₹${fmt(selected.walletBalance)}`,   color: "#c9a84c" },
              { label: "Gold Balance",   value: `${selected.goldBalance || 0}g`,       color: "#c9a84c" },
              { label: "Silver Balance", value: `${selected.silverBalance || 0}g`,     color: "#94a3b8" },
              { label: "KYC Status",     value: selected.kycStatus,                    color: KYC_CONFIG[selected.kycStatus]?.color },
              { label: "Role",           value: selected.role?.toUpperCase(),           color: ROLE_CONFIG[selected.role]?.color },
              { label: "Joined",         value: fmtDate(selected.createdAt),            color: "#888" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ padding: "0.85rem 1rem", background: "#fafaf7", borderRadius: "10px", border: "1px solid #f0ead8" }}>
                <div style={{ fontSize: "0.65rem", color: "#bbb", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.3rem" }}>{label}</div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </AdminLayout>
  );
}