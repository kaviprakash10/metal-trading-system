import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, updateKycStatus } from "../slice/Adminslice";
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
  VERIFIED: {
    bg: "#dcfce7",
    color: "#16a34a",
    border: "#86efac",
    label: "Verified",
    icon: "✅",
  },
  PENDING: {
    bg: "#fef9c3",
    color: "#854d0e",
    border: "#fde68a",
    label: "Pending",
    icon: "⏳",
  },
  REJECTED: {
    bg: "#fee2e2",
    color: "#dc2626",
    border: "#fca5a5",
    label: "Rejected",
    icon: "❌",
  },
};

/* ── Single KYC User Card ── */
function KycCard({ user, onUpdate, loading }) {
  const [selected, setSelected] = useState(user.kycStatus);
  const [dirty, setDirty] = useState(false);

  const handleChange = (val) => {
    setSelected(val);
    setDirty(val !== user.kycStatus);
  };

  const handleSave = () => {
    onUpdate(user._id, selected);
    setDirty(false);
  };

  const cfg = KYC_CONFIG[user.kycStatus];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        border: `1px solid ${dirty ? "rgba(201,168,76,0.3)" : "#ede8d8"}`,
        boxShadow: dirty
          ? "0 4px 20px rgba(201,168,76,0.1)"
          : "0 2px 12px rgba(0,0,0,0.04)",
        overflow: "hidden",
        transition: "all 0.2s",
      }}
    >
      {/* Top status strip */}
      <div
        style={{
          height: "4px",
          background: cfg.bg,
          borderBottom: `1px solid ${cfg.border}`,
        }}
      />

      <div style={{ padding: "1.25rem" }}>
        {/* User info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            marginBottom: "1.1rem",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#c9a84c,#e2c06a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0a0800",
              fontWeight: 700,
              fontSize: "1rem",
              flexShrink: 0,
            }}
          >
            {user.userName?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1a1200" }}
            >
              {user.userName}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "#aaa",
                marginTop: "0.1rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.email}
            </div>
          </div>
          {/* Current KYC badge */}
          <span
            style={{
              padding: "0.22rem 0.65rem",
              borderRadius: "100px",
              fontSize: "0.7rem",
              fontWeight: 600,
              background: cfg.bg,
              color: cfg.color,
              border: `1px solid ${cfg.border}`,
              flexShrink: 0,
            }}
          >
            {cfg.icon} {cfg.label}
          </span>
        </div>

        {/* User details */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.6rem",
            marginBottom: "1.1rem",
            padding: "0.85rem",
            background: "#fafaf7",
            borderRadius: "10px",
            border: "1px solid #f0ead8",
          }}
        >
          {[
            { label: "Wallet", value: `₹${fmt(user.walletBalance)}` },
            { label: "Gold", value: `${user.goldBalance || 0}g` },
            { label: "Silver", value: `${user.silverBalance || 0}g` },
            { label: "Joined", value: fmtDate(user.createdAt) },
          ].map(({ label, value }) => (
            <div key={label}>
              <div
                style={{
                  fontSize: "0.62rem",
                  color: "#bbb",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  color: "#1a1200",
                  marginTop: "0.1rem",
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* KYC Action buttons */}
        <div style={{ marginBottom: "0.85rem" }}>
          <div
            style={{
              fontSize: "0.68rem",
              color: "#aaa",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: "0.5rem",
            }}
          >
            Update KYC Status
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["VERIFIED", "PENDING", "REJECTED"].map((status) => {
              const c = KYC_CONFIG[status];
              const active = selected === status;
              return (
                <button
                  key={status}
                  onClick={() => handleChange(status)}
                  style={{
                    flex: 1,
                    padding: "0.55rem 0.5rem",
                    borderRadius: "8px",
                    border: `1px solid ${active ? c.border : "#e5e0d0"}`,
                    background: active ? c.bg : "#fafaf7",
                    color: active ? c.color : "#aaa",
                    fontSize: "0.72rem",
                    fontWeight: active ? 700 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {c.icon} {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save button — only shows when changed */}
        {dirty && (
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.65rem",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg,#c9a84c,#e2c06a)",
              color: "#0a0800",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer",
              boxShadow: "0 2px 12px rgba(201,168,76,0.3)",
            }}
          >
            {loading ? "Saving..." : `Save → ${KYC_CONFIG[selected].label}`}
          </button>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   KYC MANAGEMENT PAGE
══════════════════════════════════════════ */
export default function KycManagement() {
  const dispatch = useDispatch();
  const { users, loading, error, successMessage } = useSelector((s) => s.admin);

  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleUpdate = (userId, kycStatus) => {
    dispatch(updateKycStatus({ userId, kycStatus }));
  };

  /* ── Filter ── */
  const filtered = (users || [])
    .filter((u) => filter === "ALL" || u.kycStatus === filter)
    .filter((u) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        u.userName?.toLowerCase().includes(s) ||
        u.email?.toLowerCase().includes(s)
      );
    });

  /* ── Stats ── */
  const total = (users || []).length;
  const verified = (users || []).filter(
    (u) => u.kycStatus === "VERIFIED",
  ).length;
  const pending = (users || []).filter((u) => u.kycStatus === "PENDING").length;
  const rejected = (users || []).filter(
    (u) => u.kycStatus === "REJECTED",
  ).length;

  return (
    <AdminLayout active="/admin/kyc">
      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.9rem",
            fontWeight: 700,
            color: "#1a1200",
            margin: 0,
          }}
        >
          KYC Management
        </h1>
        <p
          style={{ color: "#999", fontSize: "0.875rem", marginTop: "0.25rem" }}
        >
          Review and update KYC verification status for all users.
        </p>
      </div>

      {/* ── STATS ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {[
          {
            label: "Total Users",
            value: total,
            icon: "👥",
            color: "#1a1200",
            filter: "ALL",
          },
          {
            label: "Verified",
            value: verified,
            icon: "✅",
            color: "#16a34a",
            filter: "VERIFIED",
          },
          {
            label: "Pending",
            value: pending,
            icon: "⏳",
            color: "#854d0e",
            filter: "PENDING",
          },
          {
            label: "Rejected",
            value: rejected,
            icon: "❌",
            color: "#dc2626",
            filter: "REJECTED",
          },
        ].map(({ label, value, icon, color, filter: f }) => (
          <button
            key={label}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? "#1a1200" : "#fff",
              borderRadius: "14px",
              padding: "1.1rem 1.2rem",
              border: `1px solid ${filter === f ? "#1a1200" : "#ede8d8"}`,
              boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s",
            }}
          >
            <div style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>
              {icon}
            </div>
            <div
              style={{
                fontSize: "0.65rem",
                color: filter === f ? "rgba(255,255,255,0.5)" : "#aaa",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: "0.2rem",
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.6rem",
                fontWeight: 700,
                color: filter === f ? (f === "ALL" ? "#c9a84c" : color) : color,
              }}
            >
              {value}
            </div>
          </button>
        ))}
      </div>

      {/* Success / Error */}
      {successMessage && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.85rem 1rem",
            borderRadius: "10px",
            background: "#dcfce7",
            border: "1px solid #86efac",
            color: "#15803d",
            fontSize: "0.85rem",
            fontWeight: 500,
          }}
        >
          ✓ {successMessage}
        </div>
      )}
      {error && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.85rem 1rem",
            borderRadius: "10px",
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            color: "#dc2626",
            fontSize: "0.85rem",
          }}
        >
          {error}
        </div>
      )}

      {/* ── FILTERS BAR ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid #ede8d8",
          padding: "0.85rem 1.1rem",
          marginBottom: "1.25rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#bbb",
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.52rem 0.75rem 0.52rem 2.1rem",
              borderRadius: "8px",
              border: "1px solid #e5e0d0",
              fontSize: "0.85rem",
              color: "#1a1200",
              outline: "none",
              background: "#fafaf7",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Status filter pills */}
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {["ALL", "VERIFIED", "PENDING", "REJECTED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "0.38rem 0.85rem",
                borderRadius: "100px",
                border: "none",
                fontSize: "0.75rem",
                fontWeight: 500,
                cursor: "pointer",
                background: filter === f ? "#1a1200" : "#f5f0e8",
                color: filter === f ? "#c9a84c" : "#888",
                transition: "all 0.15s",
              }}
            >
              {f === "ALL"
                ? "All"
                : `${KYC_CONFIG[f].icon} ${KYC_CONFIG[f].label}`}
            </button>
          ))}
        </div>

        <span
          style={{ fontSize: "0.75rem", color: "#bbb", marginLeft: "auto" }}
        >
          {filtered.length} of {total} users
        </span>
      </div>

      {/* ── LOADING ── */}
      {loading && !users.length && (
        <div style={{ padding: "3rem", textAlign: "center" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "3px solid #c9a84c",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!loading && filtered.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            background: "#fff",
            borderRadius: "20px",
            border: "1px solid #ede8d8",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#1a1200",
              marginBottom: "0.4rem",
            }}
          >
            No users found
          </div>
          <div style={{ color: "#bbb", fontSize: "0.85rem" }}>
            Try adjusting your search or filter.
          </div>
        </div>
      )}

      {/* ── KYC CARDS GRID ── */}
      {!loading && filtered.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.1rem",
          }}
        >
          {filtered.map((user) => (
            <KycCard
              key={user._id}
              user={user}
              onUpdate={handleUpdate}
              loading={loading}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
