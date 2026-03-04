import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../slice/Transactionslice";
import UserLayout from "./userLayout";

const fmt    = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtG   = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 4 });
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = (d) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const TYPE_CONFIG = {
  BUY_GOLD:    { label: "Buy Gold",    icon: "🟡", color: "#c9a84c", bg: "#fffbeb", badge: "#dc2626", badgeBg: "#fee2e2" },
  SELL_GOLD:   { label: "Sell Gold",   icon: "🟡", color: "#c9a84c", bg: "#fffbeb", badge: "#16a34a", badgeBg: "#dcfce7" },
  BUY_SILVER:  { label: "Buy Silver",  icon: "⚪", color: "#94a3b8", bg: "#f8fafc", badge: "#dc2626", badgeBg: "#fee2e2" },
  SELL_SILVER: { label: "Sell Silver", icon: "⚪", color: "#94a3b8", bg: "#f8fafc", badge: "#16a34a", badgeBg: "#dcfce7" },
};

const FILTERS = ["All", "Buy Gold", "Sell Gold", "Buy Silver", "Sell Silver"];

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((s) => s.transaction);

  const [filter, setFilter]   = useState("All");
  const [search, setSearch]   = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  /* ── Filter + Search + Sort ── */
  const filtered = transactions
    .filter((tx) => {
      if (filter === "All") return true;
      return TYPE_CONFIG[tx.type]?.label === filter;
    })
    .filter((tx) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        tx.type.toLowerCase().includes(s) ||
        tx.asset?.toLowerCase().includes(s) ||
        String(tx.amount).includes(s)
      );
    })
    .sort((a, b) =>
      sortDesc
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  /* ── Summary Stats ── */
  const totalBought = transactions
    .filter((tx) => tx.type.startsWith("BUY"))
    .reduce((s, tx) => s + (tx.amount || 0), 0);

  const totalSold = transactions
    .filter((tx) => tx.type.startsWith("SELL"))
    .reduce((s, tx) => s + (tx.amount || 0), 0);

  const goldTx   = transactions.filter((tx) => tx.asset === "GOLD").length;
  const silverTx = transactions.filter((tx) => tx.asset === "SILVER").length;

  return (
    <UserLayout active="/user/transactions">
      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.9rem", fontWeight: 700, color: "#1a1200", margin: 0 }}>
          Transactions
        </h1>
        <p style={{ color: "#999", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          Complete history of all your gold & silver trades.
        </p>
      </div>

      {/* ── STATS ROW ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Trades",     value: transactions.length,     icon: "📋", color: "#1a1200" },
          { label: "Total Invested",   value: `₹${fmt(totalBought)}`,  icon: "📥", color: "#dc2626" },
          { label: "Total Sold",       value: `₹${fmt(totalSold)}`,    icon: "📤", color: "#16a34a" },
          { label: "Gold Trades",      value: goldTx,                   icon: "🟡", color: "#c9a84c" },
          { label: "Silver Trades",    value: silverTx,                 icon: "⚪", color: "#64748b" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} style={{ background: "#fff", borderRadius: "14px", padding: "1.1rem 1.2rem", border: "1px solid #ede8d8", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>{icon}</div>
            <div style={{ fontSize: "0.65rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.25rem" }}>{label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── FILTERS + SEARCH ── */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #ede8d8", padding: "1.1rem 1.25rem", marginBottom: "1.25rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>

        {/* Search */}
        <div style={{ position: "relative", flex: "1", minWidth: "180px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#bbb", fontSize: "0.9rem" }}>🔍</span>
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "0.55rem 0.75rem 0.55rem 2.1rem", borderRadius: "8px", border: "1px solid #e5e0d0", fontSize: "0.85rem", color: "#1a1200", outline: "none", background: "#fafaf7", boxSizing: "border-box" }}
          />
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: "0.4rem 0.85rem", borderRadius: "100px", border: "none",
                fontSize: "0.78rem", fontWeight: 500, cursor: "pointer",
                transition: "all 0.15s",
                background: filter === f ? "#1a1200" : "#f5f0e8",
                color: filter === f ? "#c9a84c" : "#888",
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Sort toggle */}
        <button onClick={() => setSortDesc((v) => !v)}
          style={{ padding: "0.4rem 0.85rem", borderRadius: "8px", border: "1px solid #e5e0d0", background: "#fafaf7", color: "#888", fontSize: "0.78rem", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
          {sortDesc ? "↓ Newest First" : "↑ Oldest First"}
        </button>
      </div>

      {/* ── TRANSACTION LIST ── */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #ede8d8", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>

        {/* Table Head */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "0", padding: "0.75rem 1.25rem", background: "#fafaf7", borderBottom: "1px solid #f0ead8" }}>
          {["Transaction", "Asset", "Quantity", "Price/g", "Amount"].map((h) => (
            <div key={h} style={{ fontSize: "0.65rem", fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</div>
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
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📭</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 700, color: "#1a1200", marginBottom: "0.4rem" }}>
              {search || filter !== "All" ? "No matching transactions" : "No transactions yet"}
            </div>
            <div style={{ color: "#bbb", fontSize: "0.85rem" }}>
              {search || filter !== "All" ? "Try adjusting your filters." : "Start trading to see your history here."}
            </div>
          </div>
        )}

        {/* Rows */}
        {!loading && filtered.map((tx, i) => {
          const cfg    = TYPE_CONFIG[tx.type] || TYPE_CONFIG.BUY_GOLD;
          const isBuy  = tx.type.startsWith("BUY");
          return (
            <div key={tx._id}
              style={{
                display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                gap: "0", padding: "0.95rem 1.25rem",
                borderBottom: i < filtered.length - 1 ? "1px solid #f5f0e8" : "none",
                transition: "background 0.15s",
                background: "transparent",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#fafaf7"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              {/* Transaction type + date */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "10px",
                  background: cfg.bg, border: `1px solid ${isBuy ? "#fde68a" : "#bbf7d0"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem", flexShrink: 0,
                }}>
                  {cfg.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a1200" }}>{cfg.label}</div>
                  <div style={{ fontSize: "0.7rem", color: "#bbb", marginTop: "0.1rem" }}>
                    {fmtDate(tx.createdAt)} · {fmtTime(tx.createdAt)}
                  </div>
                </div>
              </div>

              {/* Asset */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{
                  padding: "0.2rem 0.65rem", borderRadius: "100px",
                  fontSize: "0.72rem", fontWeight: 600,
                  background: tx.asset === "GOLD" ? "#fffbeb" : "#f8fafc",
                  color: tx.asset === "GOLD" ? "#c9a84c" : "#64748b",
                  border: `1px solid ${tx.asset === "GOLD" ? "#fde68a" : "#e2e8f0"}`,
                }}>
                  {tx.asset}
                </span>
              </div>

              {/* Grams */}
              <div style={{ display: "flex", alignItems: "center", fontSize: "0.85rem", color: "#444", fontWeight: 500 }}>
                {fmtG(tx.grams)}g
              </div>

              {/* Price per gram */}
              <div style={{ display: "flex", alignItems: "center", fontSize: "0.85rem", color: "#444" }}>
                ₹{fmt(tx.pricePerGram)}
              </div>

              {/* Amount */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "0.9rem", color: isBuy ? "#dc2626" : "#16a34a" }}>
                  {isBuy ? "−" : "+"}₹{fmt(tx.amount)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div style={{ padding: "0.75rem 1.25rem", background: "#fafaf7", borderTop: "1px solid #f0ead8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "#bbb" }}>
              Showing {filtered.length} of {transactions.length} transactions
            </span>
            {filter !== "All" || search ? (
              <button onClick={() => { setFilter("All"); setSearch(""); }}
                style={{ fontSize: "0.75rem", color: "#c9a84c", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
                Clear filters
              </button>
            ) : null}
          </div>
        )}
      </div>
    </UserLayout>
  );
}