import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sellGold,
  sellSilver,
  clearAssetMessages,
} from "../slice/Assetslice";
import { fetchCurrentPrices } from "../slice/Priceslice";
import { fetchWallet } from "../slice/Walletslice";
import { fetchPortfolio } from "../slice/Portfolioslice";
import UserLayout from "./userLayout";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 4 });
const fmtCur = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

export default function SellPage() {
  const dispatch = useDispatch();

  const [tab, setTab] = useState("GOLD");
  const [grams, setGrams] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const { current } = useSelector((s) => s.price);
  const { gold, silver } = useSelector((s) => s.portfolio);
  const { loading, error, successMessage } = useSelector((s) => s.asset);

  const pricePerGram =
    tab === "GOLD"
      ? (current.gold?.pricePerGram ?? 0)
      : (current.silver?.pricePerGram ?? 0);

  const maxGrams = tab === "GOLD" ? (gold?.grams ?? 0) : (silver?.grams ?? 0);
  const totalEarnings =
    grams && pricePerGram ? (parseFloat(grams) * pricePerGram).toFixed(2) : 0;
  const insufficient = parseFloat(grams) > maxGrams;

  const isGold = tab === "GOLD";
  const accent = isGold ? "#c9a84c" : "#94a3b8";
  const accentLight = isGold ? "rgba(201,168,76,0.1)" : "rgba(148,163,184,0.1)";
  const accentBorder = isGold
    ? "rgba(201,168,76,0.25)"
    : "rgba(148,163,184,0.25)";

  useEffect(() => {
    dispatch(fetchCurrentPrices());
    dispatch(fetchPortfolio());
    dispatch(clearAssetMessages());
  }, [dispatch]);

  useEffect(() => {
    setGrams("");
    setConfirmed(false);
    dispatch(clearAssetMessages());
  }, [tab]);

  useEffect(() => {
    if (successMessage) {
      dispatch(fetchWallet());
      dispatch(fetchPortfolio());
      setGrams("");
      setConfirmed(false);
    }
  }, [successMessage]);

  const handleSell = () => {
    if (!grams || parseFloat(grams) <= 0 || !pricePerGram) return;
    const action = tab === "GOLD" ? sellGold : sellSilver;
    dispatch(action({ grams: parseFloat(grams), pricePerGram }));
  };

  return (
    <UserLayout active={isGold ? "/user/sell/gold" : "/user/sell/silver"}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
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
            Sell Metals
          </h1>
          <p
            style={{
              color: "#999",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            Sell your holdings at live market rates. Credited to wallet
            instantly.
          </p>
        </div>

        {/* Tab */}
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

        {/* Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            border: `1px solid ${accentBorder}`,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
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
                  Sell Price
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: accent,
                  }}
                >
                  ₹{fmtCur(pricePerGram)}
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
            <div
              style={{
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}
              >
                Available to Sell
              </span>
              <span
                style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}
              >
                {fmt(maxGrams)} g
              </span>
            </div>
          </div>

          {/* Form */}
          <div style={{ padding: "1.5rem" }}>
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

            {/* Grams input */}
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
                  placeholder={`Max ${fmt(maxGrams)}g`}
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
                  }}
                >
                  g
                </span>
              </div>
            </div>

            {/* Sell All button */}
            {maxGrams > 0 && (
              <button
                onClick={() => {
                  setGrams(String(maxGrams));
                  setConfirmed(false);
                }}
                style={{
                  marginBottom: "1.25rem",
                  padding: "0.4rem 0.9rem",
                  borderRadius: "8px",
                  border: `1px solid ${accentBorder}`,
                  background: accentLight,
                  color: accent,
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Sell All ({fmt(maxGrams)}g)
              </button>
            )}

            {/* Summary */}
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
                  ["Price per gram", `₹${fmtCur(pricePerGram)}`],
                  ["You will receive", `₹${fmtCur(totalEarnings)}`],
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
                        color: i === 2 ? "#16a34a" : "#1a1200",
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
                    ⚠ You only have {fmt(maxGrams)}g available
                  </div>
                )}
              </div>
            )}

            {/* Confirm */}
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
                  I confirm selling{" "}
                  <strong style={{ color: "#1a1200" }}>
                    {grams}g of {tab}
                  </strong>{" "}
                  at{" "}
                  <strong style={{ color: "#1a1200" }}>
                    ₹{fmtCur(pricePerGram)}/g
                  </strong>{" "}
                  to receive{" "}
                  <strong style={{ color: "#16a34a" }}>
                    ₹{fmtCur(totalEarnings)}
                  </strong>
                  .
                </label>
              </div>
            )}

            {/* Sell Button */}
            <button
              onClick={handleSell}
              disabled={!confirmed || loading || insufficient || !grams}
              style={{
                width: "100%",
                padding: "0.95rem",
                borderRadius: "10px",
                border: "none",
                background:
                  confirmed && !insufficient && grams
                    ? "linear-gradient(135deg, #16a34a, #22c55e)"
                    : "#f0ead8",
                color: confirmed && !insufficient && grams ? "#fff" : "#bbb",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor:
                  confirmed && !insufficient && grams
                    ? "pointer"
                    : "not-allowed",
                transition: "all 0.2s",
                boxShadow:
                  confirmed && !insufficient && grams
                    ? "0 4px 16px rgba(22,163,74,0.3)"
                    : "none",
              }}
            >
              {loading ? "Processing..." : `Sell ${tab} →`}
            </button>

            <p
              style={{
                textAlign: "center",
                color: "#ccc",
                fontSize: "0.72rem",
                marginTop: "0.75rem",
              }}
            >
              Amount will be credited to your wallet instantly.
            </p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
