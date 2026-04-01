import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTransactions } from "../slice/Adminslice";
import StaffLayout from "./StaffLayout";

const fmt     = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtG    = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 4 });
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = (d) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const TYPE_CONFIG = {
  BUY_GOLD:    { label: "Buy Gold",    icon: "🟡", bg: "#fee2e2", color: "#dc2626" },
  SELL_GOLD:   { label: "Sell Gold",   icon: "🟡", bg: "#dcfce7", color: "#16a34a" },
  BUY_SILVER:  { label: "Buy Silver",  icon: "⚪", bg: "#fee2e2", color: "#dc2626" },
  SELL_SILVER: { label: "Sell Silver", icon: "⚪", bg: "#dcfce7", color: "#16a34a" },
};

const FILTERS = { All:"All", BUY_GOLD:"Buy Gold", SELL_GOLD:"Sell Gold", BUY_SILVER:"Buy Silver", SELL_SILVER:"Sell Silver" };

export default function StaffTransactions() {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((s) => s.admin);

  const [search,      setSearch]      = useState("");
  const [typeFilter,  setTypeFilter]  = useState("All");
  const [assetFilter, setAssetFilter] = useState("All");
  const [sortDesc,    setSortDesc]    = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [expanded,    setExpanded]    = useState(null);

  useEffect(() => {
    dispatch(fetchAllTransactions());
  }, [dispatch]);

  const txList = transactions || [];

  /* ── Get Unique Users for the List ── */
  const uniqueUsers = Array.from(new Set((transactions || []).map(tx => tx.user?._id)))
    .map(id => (transactions || []).find(tx => tx.user?._id === id)?.user)
    .filter(u => u && u.userName)
    .sort((a,b) => a.userName.localeCompare(b.userName));

  const filtered = txList
    .filter((tx) => !selectedUser || tx.user?._id === selectedUser._id)
    .filter((tx) => typeFilter  === "All" || tx.type  === typeFilter)
    .filter((tx) => assetFilter === "All" || tx.asset === assetFilter)
    .filter((tx) => {
      if (!search) return true;
      const s = search.toLowerCase();
      if (!selectedUser) {
          return tx.user?.userName?.toLowerCase().includes(s) || tx.user?.email?.toLowerCase().includes(s);
      }
      return tx.user?.userName?.toLowerCase().includes(s) || tx.type?.toLowerCase().includes(s);
    })
    .sort((a, b) => sortDesc
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
    );

  const totalVol = txList.reduce((s, t) => s + (t.totalAmount || t.amount || 0), 0);
  const totalGst = txList.reduce((s, t) => s + (t.gstAmount || 0), 0);

  return (
    <StaffLayout active="/staff/transactions">

      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.9rem", fontWeight: 700, color: "#1a1200", margin: 0 }}>All Transactions</h1>
        <p style={{ color: "#999", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          {selectedUser 
            ? `Audit trail for ${selectedUser.userName}` 
            : "Platform-wide transaction history grouped by user."}
        </p>
      </div>

      {selectedUser && (
        <button
          onClick={() => setSelectedUser(null)}
          style={{
            marginBottom: "1.5rem",
            padding: "0.45rem 0.9rem",
            borderRadius: "8px",
            background: "#0f1623",
            color: "#63b3ed",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.82rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          ← Back to User List
        </button>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Trades",    value: txList.length,                                     icon: "📋", color: "#1a1200" },
          { label: "Total Buys",      value: txList.filter((t) => t.type?.startsWith("BUY")).length, icon: "📥", color: "#dc2626" },
          { label: "Total Sells",     value: txList.filter((t) => t.type?.startsWith("SELL")).length, icon: "📤", color: "#16a34a" },
          { label: "Total Volume",    value: `₹${fmt(totalVol)}`,                               icon: "💰", color: "#c9a84c" },
          { label: "GST Collected",   value: `₹${fmt(totalGst)}`,                               icon: "🏛️", color: "#7c3aed" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} style={{ background: "#fff", borderRadius: "14px", padding: "1.1rem 1.2rem", border: "1px solid #e2e8f0", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>{icon}</div>
            <div style={{ fontSize: "0.65rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.2rem" }}>{label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.45rem", fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "0.85rem 1.1rem", marginBottom: "1.1rem", display: "flex", gap: "0.85rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
          <span style={{ position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)", color: "#bbb" }}>🔍</span>
          <input type="text" placeholder="Search by user or type..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "0.5rem 0.7rem 0.5rem 2rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.82rem", color: "#1a1200", outline: "none", background: "#f8fafc", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          {Object.entries(FILTERS).map(([key, label]) => (
            <button key={key} onClick={() => setTypeFilter(key)}
              style={{ padding: "0.35rem 0.75rem", borderRadius: "100px", border: "none", fontSize: "0.72rem", fontWeight: 500, cursor: "pointer", background: typeFilter === key ? "#0f1623" : "#f1f5f9", color: typeFilter === key ? "#63b3ed" : "#888" }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {["All", "GOLD", "SILVER"].map((f) => (
            <button key={f} onClick={() => setAssetFilter(f)}
              style={{ padding: "0.35rem 0.75rem", borderRadius: "100px", border: "none", fontSize: "0.72rem", fontWeight: 500, cursor: "pointer", background: assetFilter === f ? "#1a1200" : "#f1f5f9", color: assetFilter === f ? "#fff" : "#888" }}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => setSortDesc((v) => !v)}
          style={{ padding: "0.38rem 0.8rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#888", fontSize: "0.75rem", cursor: "pointer", whiteSpace: "nowrap" }}>
          {sortDesc ? "↓ Newest" : "↑ Oldest"}
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        {/* Head */}
        {!selectedUser ? (
           <div
            style={{
              padding: "0.85rem 1.1rem",
              background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              fontSize: "0.6rem",
              fontWeight: 600,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Registered Users with Activity
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1.2fr", padding: "0.65rem 1.1rem", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            {["User", "Type", "Asset", "Grams", "Base Amt", "GST", "Total", "Date & Time"].map((h) => (
              <div key={h} style={{ fontSize: "0.6rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</div>
            ))}
          </div>
        )}

        {loading && (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <div style={{ width: "28px", height: "28px", border: "3px solid #63b3ed", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Rows */}
        {!loading && !selectedUser && (
           <div style={{ display: "flex", flexDirection: "column" }}>
              {uniqueUsers.filter(u => {
                 if(!search) return true;
                 const s = search.toLowerCase();
                 return u.userName.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
              }).map(u => (
                 <div
                    key={u._id}
                    onClick={() => setSelectedUser(u)}
                    style={{
                       display: "flex",
                       alignItems: "center",
                       justifyContent: "space-between",
                       padding: "1rem 1.25rem",
                       borderBottom: "1px solid #f1f5f9",
                       cursor: "pointer",
                       transition: "background 0.15s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                 >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                       <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "linear-gradient(135deg,#63b3ed,#90cdf4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f1623", fontWeight: 700 }}>
                          {u.userName[0].toUpperCase()}
                       </div>
                       <div>
                          <div style={{ fontWeight: 600, color: "#1a1200", fontSize: "0.9rem" }}>{u.userName}</div>
                          <div style={{ fontSize: "0.72rem", color: "#bbb" }}>{u.email}</div>
                       </div>
                    </div>
                    <div style={{ color: "#63b3ed", fontWeight: 600, fontSize: "0.8rem" }}>
                       View Transactions →
                    </div>
                 </div>
              ))}
              {uniqueUsers.length === 0 && (
                 <div style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8", fontSize: "0.88rem" }}>No user activity found.</div>
              )}
           </div>
        )}

        {!loading && selectedUser && filtered.map((tx, i) => {
          const cfg   = TYPE_CONFIG[tx.type] || TYPE_CONFIG.BUY_GOLD;
          const isBuy = tx.type?.startsWith("BUY");
          const isOpen = expanded === tx._id;
          return (
            <div key={tx._id}>
              <div onClick={() => setExpanded(isOpen ? null : tx._id)}
                style={{ display: "grid", gridTemplateColumns: "1.8fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1.2fr", padding: "0.82rem 1.1rem", borderBottom: "1px solid #f1f5f9", cursor: "pointer", background: isOpen ? "#f0f9ff" : "transparent", transition: "background 0.15s" }}
                onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.background = "#f8fafc"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isOpen ? "#f0f9ff" : "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg,#63b3ed,#90cdf4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f1623", fontWeight: 700, fontSize: "0.65rem", flexShrink: 0 }}>
                    {tx.user?.userName?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "#1a1200" }}>{tx.user?.userName || "—"}</div>
                    <div style={{ fontSize: "0.63rem", color: "#bbb" }}>{tx.user?.email || "—"}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ padding: "0.15rem 0.5rem", borderRadius: "100px", fontSize: "0.68rem", fontWeight: 600, background: cfg.bg, color: cfg.color }}>{cfg.icon} {cfg.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ padding: "0.15rem 0.5rem", borderRadius: "100px", fontSize: "0.68rem", fontWeight: 600, background: tx.asset === "GOLD" ? "#fffbeb" : "#f8fafc", color: tx.asset === "GOLD" ? "#c9a84c" : "#64748b", border: `1px solid ${tx.asset === "GOLD" ? "#fde68a" : "#e2e8f0"}` }}>{tx.asset}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", fontSize: "0.8rem", fontWeight: 500, color: "#444" }}>{fmtG(tx.grams)}g</div>
                <div style={{ display: "flex", alignItems: "center", fontSize: "0.8rem", color: "#444" }}>₹{fmt(tx.amount)}</div>
                <div style={{ display: "flex", alignItems: "center", fontSize: "0.8rem", color: tx.gstAmount > 0 ? "#f59e0b" : "#bbb" }}>{tx.gstAmount > 0 ? `₹${fmt(tx.gstAmount)}` : "—"}</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.85rem", color: isBuy ? "#dc2626" : "#16a34a" }}>
                    {isBuy ? "−" : "+"}₹{fmt(tx.totalAmount || tx.amount)}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "#888" }}>{fmtDate(tx.createdAt)}</div>
                    <div style={{ fontSize: "0.65rem", color: "#bbb" }}>{fmtTime(tx.createdAt)}</div>
                  </div>
                  <span style={{ color: "#bbb", fontSize: "0.65rem" }}>{isOpen ? "▲" : "▼"}</span>
                </div>
              </div>

              {isOpen && (
                <div style={{ padding: "0.85rem 1.1rem", background: "#f0f9ff", borderBottom: "1px solid #bae6fd", display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: "0.75rem" }}>
                  {[
                    { label: "TX ID",       value: tx._id?.slice(-8) + "..." },
                    { label: "User",        value: tx.user?.userName || "—"  },
                    { label: "Price/gram",  value: `₹${fmt(tx.pricePerGram)}/g` },
                    { label: "Base Amount", value: `₹${fmt(tx.amount)}`      },
                    { label: "GST",         value: tx.gstAmount > 0 ? `₹${fmt(tx.gstAmount)}` : "No GST (Sell)" },
                    { label: "Total",       value: `₹${fmt(tx.totalAmount || tx.amount)}` },
                    { label: "Status",      value: tx.status || "SUCCESS"    },
                    { label: "Date & Time", value: `${fmtDate(tx.createdAt)} ${fmtTime(tx.createdAt)}` },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontSize: "0.58rem", color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.18rem" }}>{label}</div>
                      <div style={{ fontWeight: 500, fontSize: "0.76rem", color: "#1e3a5f", wordBreak: "break-all" }}>{value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {!loading && filtered.length > 0 && (
          <div style={{ padding: "0.65rem 1.1rem", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Showing {filtered.length} of {txList.length} transactions</span>
            {(search || typeFilter !== "All" || assetFilter !== "All") && (
              <button onClick={() => { setSearch(""); setTypeFilter("All"); setAssetFilter("All"); }} style={{ fontSize: "0.72rem", color: "#63b3ed", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>Clear filters</button>
            )}
          </div>
        )}
      </div>

    </StaffLayout>
  );
}
