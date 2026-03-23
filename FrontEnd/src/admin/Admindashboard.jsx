import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStats } from "../slice/Adminslice";
import AdminLayout from "./adminLayout";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
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

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, recentTrades, loading, error } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const overviewStats = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: "👥", color: "#1a1200" },
    { label: "Total Trades", value: stats?.totalTransactions || 0, icon: "📋", color: "#16a34a" },
    { label: "Gold Buys", value: stats?.breakdown?.buyGold || 0, icon: "🟡", color: "#c9a84c" },
    { label: "Gold Sells", value: stats?.breakdown?.sellGold || 0, icon: "🟢", color: "#16a34a" },
    { label: "Silver Buys", value: stats?.breakdown?.buySilver || 0, icon: "⚪", color: "#64748b" },
    { label: "Silver Sells", value: stats?.breakdown?.sellSilver || 0, icon: "🔘", color: "#475569" },
  ];

  return (
    <AdminLayout active="/admin/dashboard">
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
          Overview
        </h1>
        <p style={{ color: "#999", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          Key metrics and recent platform activity.
        </p>
      </div>

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

      {loading ? (
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
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {overviewStats.map(({ label, value, icon, color }) => (
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
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "#1a1200",
                marginBottom: "1rem",
              }}
            >
              Recent Transactions
            </h2>
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #ede8d8",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 1.5fr 1fr 1fr 1fr 1fr",
                  padding: "0.7rem 1.25rem",
                  background: "#fafaf7",
                  borderBottom: "1px solid #f0ead8",
                }}
              >
                {["User", "Type", "Asset", "Amount", "Status", "Time"].map((h) => (
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
              {recentTrades?.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "#888" }}>
                  No recent transactions.
                </div>
              ) : (
                recentTrades?.map((tx, i) => (
                  <div
                    key={tx._id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.8fr 1.5fr 1fr 1fr 1fr 1fr",
                      padding: "0.9rem 1.25rem",
                      borderBottom:
                        i < recentTrades.length - 1 ? "1px solid #f5f0e8" : "none",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a1200" }}>
                      {tx.user?.userName || "Unknown"}
                    </div>
                    <div>
                      <span
                        style={{
                          padding: "0.2rem 0.6rem",
                          borderRadius: "100px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          background: tx.type.startsWith("BUY") ? "#fee2e2" : "#dcfce7",
                          color: tx.type.startsWith("BUY") ? "#dc2626" : "#16a34a",
                        }}
                      >
                        {tx.type}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>{tx.asset}</div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a1200" }}>
                      ₹{fmt(tx.amount)}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: tx.status === "SUCCESS" ? "#16a34a" : "#ca8a04" }}>
                      {tx.status || "SUCCESS"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#888" }}>
                      {fmtDate(tx.createdAt)} {fmtTime(tx.createdAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
