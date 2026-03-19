import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTransactions } from "../slice/Adminslice";
import AdminLayout from "./adminLayout";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtG = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 4 });
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const fmtTime = (d) =>
  new Date(d).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const TYPE_CONFIG = {
  BUY_GOLD: {
    label: "Buy Gold",
    icon: "🟡",
    buyBg: "#fee2e2",
    buyColor: "#dc2626",
  },
  SELL_GOLD: {
    label: "Sell Gold",
    icon: "🟡",
    buyBg: "#dcfce7",
    buyColor: "#16a34a",
  },
  BUY_SILVER: {
    label: "Buy Silver",
    icon: "⚪",
    buyBg: "#fee2e2",
    buyColor: "#dc2626",
  },
  SELL_SILVER: {
    label: "Sell Silver",
    icon: "⚪",
    buyBg: "#dcfce7",
    buyColor: "#16a34a",
  },
};

const FILTERS = ["All", "BUY_GOLD", "SELL_GOLD", "BUY_SILVER", "SELL_SILVER"];
const FILTER_LABELS = {
  All: "All",
  BUY_GOLD: "Buy Gold",
  SELL_GOLD: "Sell Gold",
  BUY_SILVER: "Buy Silver",
  SELL_SILVER: "Sell Silver",
};

export default function AllTransactions() {
  const dispatch = useDispatch();
  const { transactions, loading, error } = useSelector((s) => s.admin);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [assetFilter, setAssetFilter] = useState("All");
  const [sortDesc, setSortDesc] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    dispatch(fetchAllTransactions());
  }, [dispatch]);

  /* ── Filter + Search + Sort ── */
  const filtered = (transactions || [])
    .filter((tx) => {
      if (typeFilter !== "All" && tx.type !== typeFilter) return false;
      if (assetFilter !== "All" && tx.asset !== assetFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          tx.user?.userName?.toLowerCase().includes(s) ||
          tx.user?.email?.toLowerCase().includes(s) ||
          tx.type?.toLowerCase().includes(s) ||
          tx.asset?.toLowerCase().includes(s)
        );
      }
      return true;
    })
    .sort((a, b) =>
      sortDesc
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt),
    );

  /* ── Summary Stats ── */
  const txList = transactions || [];
  const totalBuys = txList.filter((t) => t.type.startsWith("BUY"));
  const totalSells = txList.filter((t) => t.type.startsWith("SELL"));
  const totalGst = txList.reduce((s, t) => s + (t.gstAmount || 0), 0);
  const totalVol = txList.reduce(
    (s, t) => s + (t.totalAmount || t.amount || 0),
    0,
  );

  const stats = [
    {
      label: "Total Transactions",
      value: txList.length,
      icon: "📋",
      color: "#1a1200",
    },
    {
      label: "Total Buys",
      value: totalBuys.length,
      icon: "📥",
      color: "#dc2626",
    },
    {
      label: "Total Sells",
      value: totalSells.length,
      icon: "📤",
      color: "#16a34a",
    },
    {
      label: "Total Volume",
      value: `₹${fmt(totalVol)}`,
      icon: "💰",
      color: "#c9a84c",
    },
    {
      label: "Total GST Collected",
      value: `₹${fmt(totalGst)}`,
      icon: "🏛️",
      color: "#7c3aed",
    },
  ];

  return (
    <AdminLayout active="/admin/transactions">
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
          All Transactions
        </h1>
        <p
          style={{ color: "#999", fontSize: "0.875rem", marginTop: "0.25rem" }}
        >
          Full platform audit trail — all buys, sells and GST collected.
        </p>
      </div>

      {/* ── STATS ROW ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {stats.map(({ label, value, icon, color }) => (
          <div
            key={label}
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "1.1rem 1.2rem",
              border: "1px solid #ede8d8",
              boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>
              {icon}
            </div>
            <div
              style={{
                fontSize: "0.65rem",
                color: "#aaa",
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
                fontSize: "1.5rem",
                fontWeight: 700,
                color,
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Error */}
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
          padding: "1rem 1.25rem",
          marginBottom: "1.25rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
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
            placeholder="Search by user, type or asset..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.55rem 0.75rem 0.55rem 2.1rem",
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

        {/* Type filter */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              style={{
                padding: "0.38rem 0.8rem",
                borderRadius: "100px",
                border: "none",
                fontSize: "0.75rem",
                fontWeight: 500,
                cursor: "pointer",
                background: typeFilter === f ? "#1a1200" : "#f5f0e8",
                color: typeFilter === f ? "#c9a84c" : "#888",
              }}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>

        {/* Asset filter */}
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {["All", "GOLD", "SILVER"].map((f) => (
            <button
              key={f}
              onClick={() => setAssetFilter(f)}
              style={{
                padding: "0.38rem 0.8rem",
                borderRadius: "100px",
                border: "none",
                fontSize: "0.75rem",
                fontWeight: 500,
                cursor: "pointer",
                background: assetFilter === f ? "#0a0a0a" : "#f5f0e8",
                color: assetFilter === f ? "#fff" : "#888",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sort */}
        <button
          onClick={() => setSortDesc((v) => !v)}
          style={{
            padding: "0.4rem 0.85rem",
            borderRadius: "8px",
            border: "1px solid #e5e0d0",
            background: "#fafaf7",
            color: "#888",
            fontSize: "0.78rem",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {sortDesc ? "↓ Newest First" : "↑ Oldest First"}
        </button>
      </div>

      {/* ── TABLE ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #ede8d8",
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        {/* Head */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1.2fr",
            padding: "0.7rem 1.25rem",
            background: "#fafaf7",
            borderBottom: "1px solid #f0ead8",
          }}
        >
          {[
            "User",
            "Type",
            "Asset",
            "Grams",
            "Base Amt",
            "GST",
            "Total",
            "Date & Time",
          ].map((h) => (
            <div
              key={h}
              style={{
                fontSize: "0.62rem",
                fontWeight: 600,
                color: "#bbb",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
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

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
              📭
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "#1a1200",
                marginBottom: "0.4rem",
              }}
            >
              {search || typeFilter !== "All" || assetFilter !== "All"
                ? "No matching transactions"
                : "No transactions yet"}
            </div>
            <div style={{ color: "#bbb", fontSize: "0.85rem" }}>
              Try adjusting your filters.
            </div>
          </div>
        )}

        {/* Rows */}
        {!loading &&
          filtered.map((tx, i) => {
            const cfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG.BUY_GOLD;
            const isBuy = tx.type.startsWith("BUY");
            const isOpen = expanded === tx._id;

            return (
              <div key={tx._id}>
                {/* Main Row */}
                <div
                  onClick={() => setExpanded(isOpen ? null : tx._id)}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1.8fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1.2fr",
                    padding: "0.9rem 1.25rem",
                    borderBottom: "1px solid #f5f0e8",
                    cursor: "pointer",
                    background: isOpen ? "#fffbeb" : "transparent",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isOpen) e.currentTarget.style.background = "#fafaf7";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isOpen
                      ? "#fffbeb"
                      : "transparent";
                  }}
                >
                  {/* User */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#c9a84c,#e2c06a)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#0a0800",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        flexShrink: 0,
                      }}
                    >
                      {tx.user?.userName?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "0.82rem",
                          color: "#1a1200",
                        }}
                      >
                        {tx.user?.userName || "Unknown"}
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "#bbb" }}>
                        {tx.user?.email || "—"}
                      </div>
                    </div>
                  </div>

                  {/* Type badge */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        padding: "0.2rem 0.6rem",
                        borderRadius: "100px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        background: cfg.buyBg,
                        color: cfg.buyColor,
                      }}
                    >
                      {cfg.icon} {cfg.label}
                    </span>
                  </div>

                  {/* Asset */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        padding: "0.2rem 0.6rem",
                        borderRadius: "100px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        background: tx.asset === "GOLD" ? "#fffbeb" : "#f8fafc",
                        color: tx.asset === "GOLD" ? "#c9a84c" : "#64748b",
                        border: `1px solid ${tx.asset === "GOLD" ? "#fde68a" : "#e2e8f0"}`,
                      }}
                    >
                      {tx.asset}
                    </span>
                  </div>

                  {/* Grams */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "0.83rem",
                      fontWeight: 500,
                      color: "#444",
                    }}
                  >
                    {fmtG(tx.grams)}g
                  </div>

                  {/* Base Amount */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "0.83rem",
                      color: "#444",
                    }}
                  >
                    ₹{fmt(tx.amount)}
                  </div>

                  {/* GST */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "0.83rem",
                      color: tx.gstAmount > 0 ? "#f59e0b" : "#bbb",
                      fontWeight: tx.gstAmount > 0 ? 500 : 400,
                    }}
                  >
                    {tx.gstAmount > 0 ? `₹${fmt(tx.gstAmount)}` : "—"}
                  </div>

                  {/* Total */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        color: isBuy ? "#dc2626" : "#16a34a",
                      }}
                    >
                      {isBuy ? "−" : "+"}₹{fmt(tx.totalAmount || tx.amount)}
                    </span>
                  </div>

                  {/* Date */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "#888" }}>
                        {fmtDate(tx.createdAt)}
                      </div>
                      <div style={{ fontSize: "0.68rem", color: "#bbb" }}>
                        {fmtTime(tx.createdAt)}
                      </div>
                    </div>
                    <span
                      style={{
                        color: "#bbb",
                        fontSize: "0.7rem",
                        marginLeft: "auto",
                      }}
                    >
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {/* Expanded Detail Row */}
                {isOpen && (
                  <div
                    style={{
                      padding: "1rem 1.25rem 1.1rem",
                      background: "#fffbeb",
                      borderBottom: "1px solid #f0ead8",
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: "0.85rem",
                    }}
                  >
                    {[
                      { label: "Transaction ID", value: tx._id },
                      { label: "User", value: tx.user?.userName || "—" },
                      {
                        label: "Price per gram",
                        value: `₹${fmt(tx.pricePerGram)}/g`,
                      },
                      { label: "Base Amount", value: `₹${fmt(tx.amount)}` },
                      {
                        label: "GST (3%)",
                        value:
                          tx.gstAmount > 0
                            ? `₹${fmt(tx.gstAmount)}`
                            : "No GST (Sell)",
                      },
                      {
                        label: "Total Deducted",
                        value: `₹${fmt(tx.totalAmount || tx.amount)}`,
                      },
                      { label: "Status", value: tx.status || "SUCCESS" },
                      {
                        label: "Date & Time",
                        value: `${fmtDate(tx.createdAt)} ${fmtTime(tx.createdAt)}`,
                      },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div
                          style={{
                            fontSize: "0.62rem",
                            color: "#bbb",
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                            marginBottom: "0.2rem",
                          }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            fontWeight: 500,
                            fontSize: "0.8rem",
                            color: "#1a1200",
                            wordBreak: "break-all",
                          }}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div
            style={{
              padding: "0.7rem 1.25rem",
              background: "#fafaf7",
              borderTop: "1px solid #f0ead8",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "#bbb" }}>
              Showing {filtered.length} of {txList.length} transactions
            </span>
            {(search || typeFilter !== "All" || assetFilter !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setTypeFilter("All");
                  setAssetFilter("All");
                }}
                style={{
                  fontSize: "0.75rem",
                  color: "#c9a84c",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
