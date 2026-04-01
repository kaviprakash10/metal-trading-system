import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, updateKycStatus } from "../slice/Adminslice";
import StaffLayout from "./StaffLayout";

const fmt     = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const KYC_CONFIG = {
  VERIFIED: { bg: "#dcfce7", color: "#16a34a", border: "#86efac", label: "Verified", icon: "✅" },
  PENDING:  { bg: "#fef9c3", color: "#854d0e", border: "#fde68a", label: "Pending",  icon: "⏳" },
  REJECTED: { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5", label: "Rejected", icon: "❌" },
};

function KycCard({ user, onUpdate, loading }) {
  const [selected, setSelected] = useState(user.kycStatus);
  const [dirty,    setDirty]    = useState(false);

  const handleChange = (val) => { setSelected(val); setDirty(val !== user.kycStatus); };
  const handleSave   = () => { onUpdate(user._id, selected); setDirty(false); };

  const cfg = KYC_CONFIG[user.kycStatus];

  return (
    <div style={{ background: "#fff", borderRadius: "16px", border: `1px solid ${dirty ? "rgba(99,179,237,0.35)" : "#e2e8f0"}`, boxShadow: dirty ? "0 4px 20px rgba(99,179,237,0.1)" : "0 2px 12px rgba(0,0,0,0.04)", overflow: "hidden", transition: "all 0.2s" }}>
      <div style={{ height: "4px", background: cfg.bg, borderBottom: `1px solid ${cfg.border}` }} />
      <div style={{ padding: "1.2rem" }}>
        {/* User info */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1rem" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg,#63b3ed,#90cdf4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f1623", fontWeight: 700, fontSize: "0.95rem", flexShrink: 0 }}>
            {user.userName?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#1a1200" }}>{user.userName}</div>
            <div style={{ fontSize: "0.7rem", color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
          </div>
          <span style={{ padding: "0.2rem 0.6rem", borderRadius: "100px", fontSize: "0.68rem", fontWeight: 600, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, flexShrink: 0 }}>
            {cfg.icon} {cfg.label}
          </span>
        </div>

        {/* Details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem", padding: "0.8rem", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          {[
            { label: "Wallet", value: `₹${fmt(user.walletBalance)}` },
            { label: "Gold",   value: `${user.goldBalance || 0}g`    },
            { label: "Silver", value: `${user.silverBalance || 0}g`  },
            { label: "Joined", value: fmtDate(user.createdAt)        },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: "0.6rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
              <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "#1a1200", marginTop: "0.08rem" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* KYC Action Buttons */}
        <div style={{ marginBottom: "0.85rem" }}>
          <div style={{ fontSize: "0.65rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.45rem" }}>Update KYC Status</div>
          <div style={{ display: "flex", gap: "0.45rem" }}>
            {["VERIFIED", "PENDING", "REJECTED"].map((status) => {
              const c = KYC_CONFIG[status];
              const active = selected === status;
              return (
                <button key={status} onClick={() => handleChange(status)}
                  style={{ flex: 1, padding: "0.5rem 0.4rem", borderRadius: "8px", border: `1px solid ${active ? c.border : "#e2e8f0"}`, background: active ? c.bg : "#f8fafc", color: active ? c.color : "#94a3b8", fontSize: "0.7rem", fontWeight: active ? 700 : 400, cursor: "pointer", transition: "all 0.15s" }}>
                  {c.icon} {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {dirty && (
          <button onClick={handleSave} disabled={loading}
            style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: "linear-gradient(135deg,#63b3ed,#90cdf4)", color: "#0f1623", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", boxShadow: "0 2px 12px rgba(99,179,237,0.3)" }}>
            {loading ? "Saving..." : `Save → ${KYC_CONFIG[selected].label}`}
          </button>
        )}
      </div>
    </div>
  );
}

export default function StaffKyc() {
  const dispatch = useDispatch();
  const { users, loading, error, successMessage } = useSelector((s) => s.admin);

  const [filter, setFilter] = useState("PENDING"); // default to pending
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleUpdate = (userId, kycStatus) => {
    dispatch(updateKycStatus({ userId, kycStatus }));
  };

  const filtered = (users || [])
    .filter((u) => filter === "ALL" || u.kycStatus === filter)
    .filter((u) => !search || u.userName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total:    (users || []).length,
    verified: (users || []).filter((u) => u.kycStatus === "VERIFIED").length,
    pending:  (users || []).filter((u) => u.kycStatus === "PENDING").length,
    rejected: (users || []).filter((u) => u.kycStatus === "REJECTED").length,
  };

  return (
    <StaffLayout active="/staff/kyc">

      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.9rem", fontWeight: 700, color: "#1a1200", margin: 0 }}>KYC Management</h1>
        <p style={{ color: "#999", fontSize: "0.875rem", marginTop: "0.25rem" }}>Review and verify user KYC status.</p>
      </div>

      {/* Stats — clickable */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "All Users",   value: stats.total,    icon: "👥", color: "#1a1200", f: "ALL"      },
          { label: "Verified",    value: stats.verified, icon: "✅", color: "#16a34a", f: "VERIFIED" },
          { label: "Pending",     value: stats.pending,  icon: "⏳", color: "#854d0e", f: "PENDING"  },
          { label: "Rejected",    value: stats.rejected, icon: "❌", color: "#dc2626", f: "REJECTED" },
        ].map(({ label, value, icon, color, f }) => (
          <button key={label} onClick={() => setFilter(f)}
            style={{ background: filter === f ? "#0f1623" : "#fff", borderRadius: "14px", padding: "1.1rem 1.2rem", border: `1px solid ${filter === f ? "#0f1623" : "#e2e8f0"}`, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "0.35rem" }}>{icon}</div>
            <div style={{ fontSize: "0.62rem", color: filter === f ? "rgba(255,255,255,0.4)" : "#aaa", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.18rem" }}>{label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 700, color: filter === f ? (f === "ALL" ? "#63b3ed" : color) : color }}>{value}</div>
          </button>
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

      {/* Search + Filter */}
      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "0.85rem 1.1rem", marginBottom: "1.1rem", display: "flex", gap: "0.85rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
          <span style={{ position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)", color: "#bbb" }}>🔍</span>
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "0.5rem 0.7rem 0.5rem 2rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.82rem", color: "#1a1200", outline: "none", background: "#f8fafc", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {["ALL", "VERIFIED", "PENDING", "REJECTED"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "0.35rem 0.8rem", borderRadius: "100px", border: "none", fontSize: "0.72rem", fontWeight: 500, cursor: "pointer", background: filter === f ? "#0f1623" : "#f1f5f9", color: filter === f ? "#63b3ed" : "#888" }}>
              {f === "ALL" ? "All" : `${KYC_CONFIG[f].icon} ${KYC_CONFIG[f].label}`}
            </button>
          ))}
        </div>
        <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{filtered.length} users</span>
      </div>

      {/* KYC Cards */}
      {loading && !users.length ? (
        <div style={{ padding: "3rem", textAlign: "center" }}>
          <div style={{ width: "28px", height: "28px", border: "3px solid #63b3ed", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎉</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 700, color: "#1a1200", marginBottom: "0.4rem" }}>
            {filter === "PENDING" ? "No pending KYC requests!" : "No users found"}
          </div>
          <div style={{ color: "#aaa", fontSize: "0.85rem" }}>
            {filter === "PENDING" ? "All users are verified or rejected." : "Try adjusting your filter."}
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1rem" }}>
          {filtered.map((user) => (
            <KycCard key={user._id} user={user} onUpdate={handleUpdate} loading={loading} />
          ))}
        </div>
      )}

    </StaffLayout>
  );
}
