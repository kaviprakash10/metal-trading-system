import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { buyGold, buySilver, clearAssetMessages } from "../slice/Assetslice";
import { fetchCurrentPrices } from "../slice/Priceslice";
import { fetchWallet } from "../slice/Walletslice";
import { fetchPortfolio } from "../slice/Portfolioslice";

/* ── Sidebar shared layout ── */
import UserLayout from "./userLayout";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

export default function BuyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tab, setTab] = useState("GOLD"); // GOLD | SILVER
  const [grams, setGrams] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const { current } = useSelector((s) => s.price);
  const { walletBalance } = useSelector((s) => s.wallet);
  const { loading, error, successMessage } = useSelector((s) => s.asset);

  const pricePerGram =
    tab === "GOLD"
      ? (current.gold?.pricePerGram ?? 0)
      : (current.silver?.pricePerGram ?? 0);

  const totalCost =
    grams && pricePerGram ? (parseFloat(grams) * pricePerGram).toFixed(2) : 0;
  const insufficient = parseFloat(totalCost) > walletBalance;

  useEffect(() => {
    dispatch(fetchCurrentPrices());
    dispatch(fetchWallet());
    dispatch(clearAssetMessages());
  }, [dispatch]);

  // Reset form on tab switch
  useEffect(() => {
    setGrams("");
    setConfirmed(false);
    dispatch(clearAssetMessages());
  }, [tab]);

  // On success refresh wallet + portfolio
  useEffect(() => {
    if (successMessage) {
      dispatch(fetchWallet());
      dispatch(fetchPortfolio());
      setGrams("");
      setConfirmed(false);
    }
  }, [successMessage]);

  const handleBuy = () => {
    if (!grams || parseFloat(grams) <= 0 || !pricePerGram) return;
    const action = tab === "GOLD" ? buyGold : buySilver;
    dispatch(action({ grams: parseFloat(grams), pricePerGram }));
  };

  const isGold = tab === "GOLD";
  const accent = isGold ? "#c9a84c" : "#94a3b8";
  const accentLight = isGold ? "rgba(201,168,76,0.1)" : "rgba(148,163,184,0.1)";
  const accentBorder = isGold
    ? "rgba(201,168,76,0.25)"
    : "rgba(148,163,184,0.25)";

  return (
    <UserLayout active={isGold ? "/user/buy/gold" : "/user/buy/silver"}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        {/* Page Title */}
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
            Buy Metals
          </h1>
          <p
            style={{
              color: "#999",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            Purchase at live market rates. Instant delivery to your account.
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "flex",
            background: "#f0ead8",
            borderRadius: "12px",
            padding: "4px",
            marginBottom: "1.75rem",
          }}
        >
          {["GOLD", "SILVER"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: "0.6rem",
                borderRadius: "9px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.88rem",
                transition: "all 0.2s",
                background: tab === t ? "#fff" : "transparent",
                color:
                  tab === t ? (t === "GOLD" ? "#c9a84c" : "#64748b") : "#999",
                boxShadow: tab === t ? "0 1px 6px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {t === "GOLD" ? "🟡" : "⚪"} {t}
            </button>
          ))}
        </div>

        {/* Main Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            border: `1px solid ${accentBorder}`,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          {/* Card Header */}
          <div
            style={{
              background: isGold
                ? "linear-gradient(135deg, #0f0c00, #1a1200)"
                : "linear-gradient(135deg, #0f1117, #1e2433)",
              padding: "1.5rem",
              borderBottom: `1px solid ${accentBorder}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "0.3rem",
                  }}
                >
                  Live Price
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: accent,
                  }}
                >
                  ₹{fmt(pricePerGram)}
                  <span
                    style={{ fontSize: "1rem", color: "rgba(255,255,255,0.3)" }}
                  >
                    /g
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: accentLight,
                  border: `1px solid ${accentBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.6rem",
                }}
              >
                {isGold ? "🟡" : "⚪"}
              </div>
            </div>

            {/* Wallet Balance */}
            <div
              style={{
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}
              >
                Wallet Balance
              </span>
              <span
                style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}
              >
                ₹{fmt(walletBalance)}
              </span>
            </div>
          </div>

          {/* Form */}
          <div style={{ padding: "1.5rem" }}>
            {/* Success */}
            {successMessage && (
              <div
                style={{
                  marginBottom: "1.25rem",
                  padding: "0.9rem 1rem",
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
                  marginBottom: "1.25rem",
                  padding: "0.9rem 1rem",
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

            {/* Grams Input */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#aaa",
                  marginBottom: "0.5rem",
                }}
              >
                Quantity (grams)
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={grams}
                  onChange={(e) => {
                    setGrams(e.target.value);
                    setConfirmed(false);
                  }}
                  placeholder="e.g. 1.5"
                  style={{
                    width: "100%",
                    padding: "0.9rem 3.5rem 0.9rem 1rem",
                    borderRadius: "10px",
                    border: `1px solid ${grams ? accentBorder : "#e5e0d0"}`,
                    fontSize: "1rem",
                    color: "#1a1200",
                    outline: "none",
                    background: "#fafaf7",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#aaa",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                  }}
                >
                  g
                </span>
              </div>
            </div>

            {/* Quick amounts */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#bbb",
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Quick select
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {(isGold ? [0.5, 1, 2, 5] : [5, 10, 25, 50]).map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setGrams(String(g));
                      setConfirmed(false);
                    }}
                    style={{
                      padding: "0.4rem 0.9rem",
                      borderRadius: "8px",
                      border: `1px solid ${grams == g ? accent : "#e5e0d0"}`,
                      background: grams == g ? accentLight : "#fafaf7",
                      color: grams == g ? accent : "#888",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {g}g
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            {grams && parseFloat(grams) > 0 && (
              <div
                style={{
                  marginBottom: "1.25rem",
                  padding: "1rem",
                  background: "#fafaf7",
                  borderRadius: "12px",
                  border: "1px solid #f0ead8",
                }}
              >
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "#aaa",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.75rem",
                  }}
                >
                  Order Summary
                </div>
                {[
                  ["Quantity", `${grams} grams`],
                  ["Price per gram", `₹${fmt(pricePerGram)}`],
                  ["Total Cost", `₹${fmt(totalCost)}`],
                  [
                    "After Balance",
                    `₹${fmt(walletBalance - parseFloat(totalCost))}`,
                  ],
                ].map(([k, v], i) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.3rem 0",
                      borderTop: i === 2 ? "1px solid #ede8d8" : "none",
                      marginTop: i === 2 ? "0.4rem" : 0,
                      paddingTop: i === 2 ? "0.6rem" : "0.3rem",
                    }}
                  >
                    <span style={{ fontSize: "0.82rem", color: "#888" }}>
                      {k}
                    </span>
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: i === 2 ? 700 : 500,
                        color:
                          i === 2
                            ? "#1a1200"
                            : i === 3 && insufficient
                              ? "#dc2626"
                              : "#1a1200",
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
                {insufficient && (
                  <div
                    style={{
                      marginTop: "0.6rem",
                      padding: "0.5rem 0.75rem",
                      background: "#fee2e2",
                      borderRadius: "8px",
                      color: "#dc2626",
                      fontSize: "0.78rem",
                    }}
                  >
                    ⚠ Insufficient wallet balance
                  </div>
                )}
              </div>
            )}

            {/* Confirm checkbox */}
            {grams && parseFloat(grams) > 0 && !insufficient && (
              <div
                style={{
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.6rem",
                }}
              >
                <input
                  type="checkbox"
                  id="confirm"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  style={{
                    marginTop: "2px",
                    accentColor: accent,
                    cursor: "pointer",
                  }}
                />
                <label
                  htmlFor="confirm"
                  style={{
                    fontSize: "0.82rem",
                    color: "#888",
                    cursor: "pointer",
                    lineHeight: 1.5,
                  }}
                >
                  I confirm the purchase of{" "}
                  <strong style={{ color: "#1a1200" }}>
                    {grams}g of {tab}
                  </strong>{" "}
                  at{" "}
                  <strong style={{ color: "#1a1200" }}>
                    ₹{fmt(pricePerGram)}/g
                  </strong>{" "}
                  for a total of{" "}
                  <strong style={{ color: accent }}>₹{fmt(totalCost)}</strong>.
                </label>
              </div>
            )}

            {/* Buy Button */}
            <button
              onClick={handleBuy}
              disabled={!confirmed || loading || insufficient || !grams}
              style={{
                width: "100%",
                padding: "0.95rem",
                borderRadius: "10px",
                border: "none",
                background:
                  confirmed && !insufficient && grams
                    ? `linear-gradient(135deg, ${isGold ? "#c9a84c, #e2c06a" : "#64748b, #94a3b8"})`
                    : "#f0ead8",
                color:
                  confirmed && !insufficient && grams
                    ? isGold
                      ? "#0a0800"
                      : "#fff"
                    : "#bbb",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor:
                  confirmed && !insufficient && grams
                    ? "pointer"
                    : "not-allowed",
                transition: "all 0.2s",
                boxShadow:
                  confirmed && !insufficient && grams
                    ? `0 4px 16px ${isGold ? "rgba(201,168,76,0.35)" : "rgba(100,116,139,0.3)"}`
                    : "none",
              }}
            >
              {loading ? "Processing..." : `Buy ${tab} →`}
            </button>

            <p
              style={{
                textAlign: "center",
                color: "#ccc",
                fontSize: "0.72rem",
                marginTop: "0.75rem",
              }}
            >
              Live price may change. Transaction uses latest server price.
            </p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
