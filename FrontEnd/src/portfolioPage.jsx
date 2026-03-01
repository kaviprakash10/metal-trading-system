import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPortfolio } from "./slice/Portfolioslice";
import { fetchCurrentPrices } from "./slice/Priceslice";
import { fetchWallet } from "./slice/Walletslice";
import UserLayout from "./user/userLayout";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtG = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 4 });

/* ── Allocation Bar ── */
function AllocationBar({ goldValue, silverValue }) {
  const total = goldValue + silverValue;
  const goldPct = total > 0 ? ((goldValue / total) * 100).toFixed(1) : 50;
  const silverPct = total > 0 ? ((silverValue / total) * 100).toFixed(1) : 50;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        <span
          style={{
            fontSize: "0.72rem",
            color: "#aaa",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Allocation
        </span>
        <span style={{ fontSize: "0.72rem", color: "#aaa" }}>
          🟡 {goldPct}% &nbsp; ⚪ {silverPct}%
        </span>
      </div>
      <div
        style={{
          height: "8px",
          borderRadius: "100px",
          background: "#f0ead8",
          overflow: "hidden",
          display: "flex",
        }}
      >
        <div
          style={{
            width: `${goldPct}%`,
            background: "linear-gradient(90deg, #c9a84c, #e2c06a)",
            borderRadius: "100px 0 0 100px",
            transition: "width 0.6s ease",
          }}
        />
        <div
          style={{
            width: `${silverPct}%`,
            background: "linear-gradient(90deg, #94a3b8, #cbd5e1)",
            borderRadius: "0 100px 100px 0",
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

/* ── PnL Badge ── */
function PnLBadge({ value }) {
  const isPos = value >= 0;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.2rem",
        padding: "0.2rem 0.65rem",
        borderRadius: "100px",
        fontSize: "0.75rem",
        fontWeight: 600,
        background: isPos ? "#dcfce7" : "#fee2e2",
        color: isPos ? "#16a34a" : "#dc2626",
      }}
    >
      {isPos ? "▲" : "▼"} {isPos ? "+" : ""}
      {fmt(value)}
    </span>
  );
}

/* ── Metric Row ── */
function MetricRow({ label, value, highlight }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.6rem 0",
        borderBottom: "1px solid #f5f0e8",
      }}
    >
      <span style={{ fontSize: "0.82rem", color: "#888" }}>{label}</span>
      <span
        style={{
          fontSize: "0.88rem",
          fontWeight: highlight ? 700 : 500,
          color: highlight ? "#1a1200" : "#444",
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ── Asset Card ── */
function AssetCard({ asset, data, price, accentColor, icon, to }) {
  if (!data) return null;
  const isPos = data.pnl >= 0;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
        border: "1px solid #ede8d8",
        boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      {/* Card Header */}
      <div
        style={{
          background:
            asset === "GOLD"
              ? "linear-gradient(135deg, #0f0c00, #1a1200)"
              : "linear-gradient(135deg, #0f1117, #1a2030)",
          padding: "1.4rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.68rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "0.3rem",
              }}
            >
              {asset} Holdings
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2.2rem",
                fontWeight: 700,
                color: accentColor,
              }}
            >
              {fmtG(data.grams)}{" "}
              <span
                style={{ fontSize: "1rem", color: "rgba(255,255,255,0.3)" }}
              >
                grams
              </span>
            </div>
          </div>
          <div style={{ fontSize: "2rem" }}>{icon}</div>
        </div>

        <div
          style={{
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            gap: "1.5rem",
          }}
        >
          <div>
            <div
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Current Value
            </div>
            <div
              style={{
                color: "#fff",
                fontWeight: 600,
                fontSize: "1rem",
                marginTop: "0.2rem",
              }}
            >
              ₹{fmt(data.currentValue)}
            </div>
          </div>
          <div>
            <div
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Live Rate
            </div>
            <div
              style={{
                color: accentColor,
                fontWeight: 600,
                fontSize: "1rem",
                marginTop: "0.2rem",
              }}
            >
              ₹{fmt(price)}/g
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: "1.25rem" }}>
        <MetricRow label="Amount Invested" value={`₹${fmt(data.invested)}`} />
        <MetricRow label="Current Value" value={`₹${fmt(data.currentValue)}`} />
        <MetricRow label="P&L" value={<PnLBadge value={data.pnl} />} />
        <MetricRow
          label="Returns"
          value={
            <span
              style={{
                fontWeight: 700,
                color: isPos ? "#16a34a" : "#dc2626",
                fontSize: "0.88rem",
              }}
            >
              {isPos ? "+" : ""}
              {data.returnsPercent || 0}%
            </span>
          }
        />
        <div style={{ marginTop: "1.1rem" }}>
          <MetricRow
            label="Price per gram"
            value={`₹${fmt(price)}`}
            highlight
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.1rem" }}>
          <Link
            to={to.buy}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "0.6rem",
              borderRadius: "8px",
              textDecoration: "none",
              background:
                asset === "GOLD"
                  ? "linear-gradient(135deg, #c9a84c, #e2c06a)"
                  : "linear-gradient(135deg, #64748b, #94a3b8)",
              color: asset === "GOLD" ? "#0a0800" : "#fff",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            Buy More
          </Link>
          <Link
            to={to.sell}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "0.6rem",
              borderRadius: "8px",
              textDecoration: "none",
              background: "#f7f5f0",
              border: "1px solid #ede8d8",
              color: "#666",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            Sell
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PORTFOLIO PAGE
══════════════════════════════════════════ */
export default function PortfolioPage() {
  const dispatch = useDispatch();
  const { gold, silver, summary, loading } = useSelector((s) => s.portfolio);
  const { current } = useSelector((s) => s.price);
  const { walletBalance } = useSelector((s) => s.wallet);

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchCurrentPrices());
    dispatch(fetchWallet());
  }, [dispatch]);

  const goldPrice = current.gold?.pricePerGram ?? 0;
  const silverPrice = current.silver?.pricePerGram ?? 0;
  const totalPnL = summary?.totalPnL ?? 0;

  return (
    <UserLayout active="/user/portfolio">
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
          My Portfolio
        </h1>
        <p
          style={{ color: "#999", fontSize: "0.875rem", marginTop: "0.25rem" }}
        >
          Real-time view of your gold & silver holdings.
        </p>
      </div>

      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "4rem" }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              border: "3px solid #c9a84c",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          {/* ── SUMMARY BANNER ── */}
          <div
            style={{
              background: "linear-gradient(135deg, #0f0c00, #1a1200)",
              borderRadius: "20px",
              padding: "1.75rem",
              marginBottom: "1.5rem",
              border: "1px solid rgba(201,168,76,0.15)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {/* Total Value */}
              <div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.68rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "0.3rem",
                  }}
                >
                  Total Portfolio Value
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "#c9a84c",
                  }}
                >
                  ₹{fmt(summary?.totalCurrentValue)}
                </div>
              </div>

              {/* Invested */}
              <div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.68rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "0.3rem",
                  }}
                >
                  Total Invested
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  ₹{fmt(summary?.totalInvested)}
                </div>
              </div>

              {/* P&L */}
              <div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.68rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "0.3rem",
                  }}
                >
                  Overall P&L
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: totalPnL >= 0 ? "#4ade80" : "#f87171",
                  }}
                >
                  {totalPnL >= 0 ? "+" : ""}₹{fmt(totalPnL)}
                </div>
              </div>

              {/* Returns */}
              <div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.68rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "0.3rem",
                  }}
                >
                  Returns
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color:
                      (summary?.totalReturnsPercent ?? 0) >= 0
                        ? "#4ade80"
                        : "#f87171",
                  }}
                >
                  {(summary?.totalReturnsPercent ?? 0) >= 0 ? "+" : ""}
                  {summary?.totalReturnsPercent ?? 0}%
                </div>
              </div>

              {/* Wallet */}
              <div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.68rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "0.3rem",
                  }}
                >
                  Wallet Balance
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  ₹{fmt(walletBalance)}
                </div>
              </div>
            </div>

            {/* Allocation Bar */}
            <div
              style={{
                marginTop: "1.5rem",
                paddingTop: "1.25rem",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <AllocationBar
                goldValue={gold?.currentValue ?? 0}
                silverValue={silver?.currentValue ?? 0}
              />
            </div>
          </div>

          {/* ── ASSET CARDS ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1.25rem",
              marginBottom: "1.5rem",
            }}
          >
            <AssetCard
              asset="GOLD"
              data={gold}
              price={goldPrice}
              accentColor="#c9a84c"
              icon="🟡"
              to={{ buy: "/user/buy/gold", sell: "/user/sell/gold" }}
            />
            <AssetCard
              asset="SILVER"
              data={silver}
              price={silverPrice}
              accentColor="#94a3b8"
              icon="⚪"
              to={{ buy: "/user/buy/silver", sell: "/user/sell/silver" }}
            />
          </div>

          {/* ── EMPTY STATE ── */}
          {!gold?.grams && !silver?.grams && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                background: "#fff",
                borderRadius: "20px",
                border: "1px solid #ede8d8",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🪙</div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "#1a1200",
                  marginBottom: "0.5rem",
                }}
              >
                No holdings yet
              </h3>
              <p
                style={{
                  color: "#aaa",
                  fontSize: "0.88rem",
                  marginBottom: "1.5rem",
                }}
              >
                Start investing to see your portfolio here.
              </p>
              <Link
                to="/user/buy/gold"
                style={{
                  display: "inline-block",
                  padding: "0.7rem 1.8rem",
                  background: "linear-gradient(135deg, #c9a84c, #e2c06a)",
                  color: "#0a0800",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                }}
              >
                Buy Gold Now →
              </Link>
            </div>
          )}
        </>
      )}
    </UserLayout>
  );
}
