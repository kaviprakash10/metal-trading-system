import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchWallet, addMoney } from "./slice/Walletslice";
import { fetchPortfolio } from "./slice/Portfolioslice";
import UserLayout from "./user/userLayout";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 25000];

export default function WalletPage() {
  const dispatch = useDispatch();

  const {
    walletBalance,
    goldBalance,
    silverBalance,
    loading,
    error,
    successMessage,
  } = useSelector((s) => s.wallet);
  const { gold, silver } = useSelector((s) => s.portfolio);

  const [amount, setAmount] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(fetchPortfolio());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setAmount("");
      setAdding(false);
    }
  }, [successMessage]);

  const handleAdd = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    dispatch(addMoney({ amount: val }));
  };

  const totalAssetValue =
    (gold?.currentValue ?? 0) + (silver?.currentValue ?? 0);
  const totalNetWorth = walletBalance + totalAssetValue;

  return (
    <UserLayout active="/user/wallet">
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        {/* Title */}
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
            My Wallet
          </h1>
          <p
            style={{
              color: "#999",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            Manage your funds. Add money to start investing in gold & silver.
          </p>
        </div>

        {/* ── BALANCE CARDS ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {/* Wallet Balance */}
          <div
            style={{
              gridColumn: "1 / -1",
              background: "linear-gradient(135deg, #0f0c00, #1a1200)",
              borderRadius: "20px",
              padding: "1.75rem",
              border: "1px solid rgba(201,168,76,0.15)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative ring */}
            <div
              style={{
                position: "absolute",
                right: "-60px",
                top: "-60px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                border: "1px solid rgba(201,168,76,0.06)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: "-90px",
                top: "-90px",
                width: "280px",
                height: "280px",
                borderRadius: "50%",
                border: "1px solid rgba(201,168,76,0.04)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              💰 Available Wallet Balance
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "3rem",
                fontWeight: 700,
                color: "#c9a84c",
                lineHeight: 1,
              }}
            >
              ₹{fmt(walletBalance)}
            </div>
            <div
              style={{
                marginTop: "1.25rem",
                paddingTop: "1.25rem",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                gap: "2rem",
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
                  Gold Value
                </div>
                <div
                  style={{
                    color: "#c9a84c",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    marginTop: "0.2rem",
                  }}
                >
                  ₹{fmt(gold?.currentValue)}
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
                  Silver Value
                </div>
                <div
                  style={{
                    color: "#94a3b8",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    marginTop: "0.2rem",
                  }}
                >
                  ₹{fmt(silver?.currentValue)}
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
                  Total Net Worth
                </div>
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    marginTop: "0.2rem",
                  }}
                >
                  ₹{fmt(totalNetWorth)}
                </div>
              </div>
            </div>
          </div>

          {/* Holdings chips */}
          {[
            {
              label: "Gold Holdings",
              value: `${fmt(gold?.grams ?? 0)}g`,
              sub: `₹${fmt(gold?.currentValue)}`,
              color: "#c9a84c",
              icon: "🟡",
            },
            {
              label: "Silver Holdings",
              value: `${fmt(silver?.grams ?? 0)}g`,
              sub: `₹${fmt(silver?.currentValue)}`,
              color: "#94a3b8",
              icon: "⚪",
            },
            {
              label: "Net Worth",
              value: `₹${fmt(totalNetWorth)}`,
              sub: "wallet + metals",
              color: "#1a1200",
              icon: "📊",
            },
          ].map(({ label, value, sub, color, icon }) => (
            <div
              key={label}
              style={{
                background: "#fff",
                borderRadius: "14px",
                padding: "1.1rem",
                border: "1px solid #ede8d8",
                boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                {icon}
              </div>
              <div
                style={{
                  fontSize: "0.68rem",
                  color: "#aaa",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.3rem",
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
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "#bbb",
                  marginTop: "0.15rem",
                }}
              >
                {sub}
              </div>
            </div>
          ))}
        </div>

        {/* ── ADD MONEY CARD ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            border: "1px solid #ede8d8",
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            padding: "1.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#1a1200",
              marginBottom: "1.25rem",
              marginTop: 0,
            }}
          >
            Add Money
          </h2>

          {/* Success */}
          {successMessage && (
            <div
              style={{
                marginBottom: "1.1rem",
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

          {/* Error */}
          {error && (
            <div
              style={{
                marginBottom: "1.1rem",
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

          {/* Amount Input */}
          <div style={{ marginBottom: "1.1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.7rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#aaa",
                marginBottom: "0.5rem",
              }}
            >
              Enter Amount
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.2rem",
                  color: amount ? "#c9a84c" : "#ccc",
                  fontWeight: 600,
                }}
              >
                ₹
              </span>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                style={{
                  width: "100%",
                  padding: "0.9rem 1rem 0.9rem 2.2rem",
                  borderRadius: "12px",
                  border: `1.5px solid ${amount ? "rgba(201,168,76,0.4)" : "#e5e0d0"}`,
                  fontSize: "1.2rem",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  color: "#1a1200",
                  outline: "none",
                  background: "#fafaf7",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
          </div>

          {/* Quick Amounts */}
          <div style={{ marginBottom: "1.4rem" }}>
            <div
              style={{
                fontSize: "0.68rem",
                color: "#bbb",
                marginBottom: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Quick Add
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {QUICK_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(String(a))}
                  style={{
                    padding: "0.45rem 1rem",
                    borderRadius: "8px",
                    border: `1px solid ${amount == a ? "rgba(201,168,76,0.4)" : "#e5e0d0"}`,
                    background:
                      amount == a ? "rgba(201,168,76,0.08)" : "#fafaf7",
                    color: amount == a ? "#c9a84c" : "#888",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  ₹{a >= 1000 ? `${a / 1000}K` : a}
                </button>
              ))}
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            disabled={loading || !amount || parseFloat(amount) <= 0}
            style={{
              width: "100%",
              padding: "0.95rem",
              borderRadius: "12px",
              border: "none",
              background:
                amount && parseFloat(amount) > 0
                  ? "linear-gradient(135deg, #c9a84c, #e2c06a)"
                  : "#f0ead8",
              color: amount && parseFloat(amount) > 0 ? "#0a0800" : "#bbb",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor:
                amount && parseFloat(amount) > 0 ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow:
                amount && parseFloat(amount) > 0
                  ? "0 4px 16px rgba(201,168,76,0.3)"
                  : "none",
            }}
          >
            {loading
              ? "Adding..."
              : `Add ₹${amount ? fmt(parseFloat(amount)) : "0"} to Wallet`}
          </button>

          <p
            style={{
              textAlign: "center",
              color: "#ccc",
              fontSize: "0.72rem",
              marginTop: "0.75rem",
            }}
          >
            This is a simulated platform. No real money is involved.
          </p>
        </div>

        {/* ── QUICK INVEST ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            border: "1px solid #ede8d8",
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#1a1200",
              marginBottom: "1rem",
              marginTop: 0,
            }}
          >
            Ready to Invest?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.85rem",
            }}
          >
            {[
              {
                icon: "🟡",
                label: "Buy Gold",
                sub: "24K pure gold",
                to: "/user/buy/gold",
                bg: "linear-gradient(135deg,#c9a84c,#e2c06a)",
                color: "#0a0800",
              },
              {
                icon: "⚪",
                label: "Buy Silver",
                sub: "99.9% pure",
                to: "/user/buy/silver",
                bg: "linear-gradient(135deg,#64748b,#94a3b8)",
                color: "#fff",
              },
              {
                icon: "↗️",
                label: "Sell Gold",
                sub: "Instant credit",
                to: "/user/sell/gold",
                bg: "#f7f5f0",
                color: "#1a1200",
                border: "1px solid #ede8d8",
              },
              {
                icon: "📋",
                label: "Transactions",
                sub: "View history",
                to: "/user/transactions",
                bg: "#f7f5f0",
                color: "#1a1200",
                border: "1px solid #ede8d8",
              },
            ].map(({ icon, label, sub, to, bg, color, border }) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.9rem 1rem",
                  borderRadius: "12px",
                  background: bg,
                  border: border || "none",
                  textDecoration: "none",
                  color,
                  transition: "opacity 0.15s",
                }}
              >
                <span style={{ fontSize: "1.4rem" }}>{icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                    {label}
                  </div>
                  <div style={{ fontSize: "0.72rem", opacity: 0.65 }}>
                    {sub}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
