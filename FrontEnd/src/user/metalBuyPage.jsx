import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  buyGold,
  buySilver,
  clearAssetMessages,
} from "../slice/AssetSlice";
import { fetchCurrentPrices } from "../slice/Priceslice";
import { fetchWallet } from "../slice/Walletslice";
import { fetchPortfolio } from "../slice/Portfolioslice";
import UserLayout from "./userLayout";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtG = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 6 });

const GST_RATE = 0.03;

export default function BuyPage() {
  const dispatch = useDispatch();
  const location = useLocation();

  // Detect tab from URL
  const [tab, setTab] = useState(
    location.pathname.includes("silver") ? "SILVER" : "GOLD",
  );
  const [mode, setMode] = useState("amount"); // "amount" | "grams"
  const [inputVal, setInputVal] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const { current } = useSelector((s) => s.price);
  const { walletBalance } = useSelector((s) => s.wallet);
  const { loading, error, successMessage } = useSelector((s) => s.asset);

  const pricePerGram =
    tab === "GOLD"
      ? (current.gold?.pricePerGram ?? 0)
      : (current.silver?.pricePerGram ?? 0);

  // ── Derived values ──
  const parsed = parseFloat(inputVal) || 0;
  const baseAmount =
    mode === "amount" ? parsed : parseFloat((parsed * pricePerGram).toFixed(2));

  const gramsYouGet =
    mode === "amount" ? parseFloat((parsed / pricePerGram).toFixed(6)) : parsed;

  const gstAmount = parseFloat((baseAmount * GST_RATE).toFixed(2));
  const totalCost = parseFloat((baseAmount + gstAmount).toFixed(2));
  const insufficient = totalCost > walletBalance;

  const isGold = tab === "GOLD";
  const accent = isGold ? "#c9a84c" : "#94a3b8";
  const accentLight = isGold ? "rgba(201,168,76,0.1)" : "rgba(148,163,184,0.1)";
  const accentBorder = isGold
    ? "rgba(201,168,76,0.25)"
    : "rgba(148,163,184,0.25)";

  useEffect(() => {
    dispatch(fetchCurrentPrices());
    dispatch(fetchWallet());
    dispatch(clearAssetMessages());
  }, [dispatch]);

  useEffect(() => {
    setInputVal("");
    setConfirmed(false);
    dispatch(clearAssetMessages());
  }, [tab, mode]);

  useEffect(() => {
    if (successMessage) {
      dispatch(fetchWallet());
      dispatch(fetchPortfolio());
      setInputVal("");
      setConfirmed(false);
    }
  }, [successMessage]);

  const handleBuy = () => {
    if (!inputVal || parsed <= 0 || !pricePerGram) return;

    const payload = {
      pricePerGram,
      ...(mode === "amount"
        ? { amount: parsed } // send ₹ amount → backend calculates grams
        : { grams: parsed }), // send grams → backend calculates amount
    };

    const action = isGold ? buyGold : buySilver;
    dispatch(action(payload));
  };

  // Quick options change based on mode
  const quickOptions =
    mode === "amount"
      ? [100, 500, 1000, 2000, 5000, 10000]
      : isGold
        ? [0.5, 1, 2, 5]
        : [5, 10, 25, 50];

  const canSubmit =
    confirmed && !insufficient && inputVal && parsed > 0 && pricePerGram > 0;

  return (
    <UserLayout active={isGold ? "/user/buy/gold" : "/user/buy/silver"}>
      <div style={{ maxWidth: "540px", margin: "0 auto" }}>
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

        {/* Gold / Silver Tab */}
        <div
          style={{
            display: "flex",
            background: "#f0ead8",
            borderRadius: "12px",
            padding: "4px",
            marginBottom: "1.25rem",
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

        {/* Amount / Grams Mode Toggle */}
        <div
          style={{
            display: "flex",
            background: "#f0ead8",
            borderRadius: "10px",
            padding: "3px",
            marginBottom: "1.5rem",
          }}
        >
          {[
            { id: "amount", label: "By Amount (₹)" },
            { id: "grams", label: "By Grams (g)" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              style={{
                flex: 1,
                padding: "0.5rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: mode === id ? 600 : 400,
                fontSize: "0.82rem",
                transition: "all 0.15s",
                background: mode === id ? "#fff" : "transparent",
                color: mode === id ? accent : "#999",
                boxShadow: mode === id ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {label}
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
          {/* Dark Header */}
          <div
            style={{
              background: isGold
                ? "linear-gradient(135deg,#0f0c00,#1a1200)"
                : "linear-gradient(135deg,#0f1117,#1e2433)",
              padding: "1.5rem",
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
                  marginBottom: "1.1rem",
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
                  marginBottom: "1.1rem",
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

            {/* Input */}
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
                {mode === "amount"
                  ? "Enter Amount (₹)"
                  : "Enter Quantity (grams)"}
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: inputVal ? accent : "#ccc",
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  {mode === "amount" ? "₹" : "g"}
                </span>
                <input
                  type="number"
                  min="0.01"
                  step={mode === "amount" ? "1" : "0.01"}
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    setConfirmed(false);
                  }}
                  placeholder={mode === "amount" ? "e.g. 3000" : "e.g. 1.5"}
                  style={{
                    width: "100%",
                    padding: "0.9rem 1rem 0.9rem 2.2rem",
                    borderRadius: "10px",
                    border: `1px solid ${inputVal ? accentBorder : "#e5e0d0"}`,
                    fontSize: "1rem",
                    color: "#1a1200",
                    outline: "none",
                    background: "#fafaf7",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Quick Options */}
            <div style={{ marginBottom: "1.1rem" }}>
              <div
                style={{
                  fontSize: "0.68rem",
                  color: "#bbb",
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Quick Select
              </div>
              <div
                style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}
              >
                {quickOptions.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInputVal(String(q));
                      setConfirmed(false);
                    }}
                    style={{
                      padding: "0.38rem 0.85rem",
                      borderRadius: "8px",
                      border: `1px solid ${inputVal == q ? accent : "#e5e0d0"}`,
                      background: inputVal == q ? accentLight : "#fafaf7",
                      color: inputVal == q ? accent : "#888",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {mode === "amount"
                      ? `₹${q >= 1000 ? `${q / 1000}K` : q}`
                      : `${q}g`}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            {inputVal && parsed > 0 && pricePerGram > 0 && (
              <div
                style={{
                  marginBottom: "1.1rem",
                  padding: "1rem",
                  background: "#fafaf7",
                  borderRadius: "12px",
                  border: "1px solid #f0ead8",
                }}
              >
                <div
                  style={{
                    fontSize: "0.68rem",
                    color: "#aaa",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.75rem",
                  }}
                >
                  Order Summary
                </div>
                {[
                  ["You invest", `₹${fmt(baseAmount)}`],
                  ["GST (3%)", `₹${fmt(gstAmount)}`],
                  ["Total Deducted", `₹${fmt(totalCost)}`],
                  [
                    isGold ? "Gold you get" : "Silver you get",
                    `${fmtG(gramsYouGet)}g`,
                  ],
                ].map(([k, v], i) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.28rem 0",
                      borderTop: i === 2 ? "1px solid #ede8d8" : "none",
                      marginTop: i === 2 ? "0.4rem" : 0,
                      paddingTop: i === 2 ? "0.55rem" : "0.28rem",
                    }}
                  >
                    <span style={{ fontSize: "0.82rem", color: "#888" }}>
                      {k}
                    </span>
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: i >= 2 ? 700 : 500,
                        color: i === 2 ? "#1a1200" : i === 3 ? accent : "#444",
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
                    ⚠ Insufficient wallet balance. Add more funds first.
                  </div>
                )}
                {totalCost > 0 && walletBalance > 0 && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.72rem",
                      color: "#bbb",
                    }}
                  >
                    Balance after: ₹{fmt(walletBalance - totalCost)}
                  </div>
                )}
              </div>
            )}

            {/* Confirm Checkbox */}
            {inputVal && parsed > 0 && !insufficient && (
              <div
                style={{
                  marginBottom: "1.1rem",
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
                  I confirm buying{" "}
                  <strong style={{ color: "#1a1200" }}>
                    {fmtG(gramsYouGet)}g of {tab}
                  </strong>{" "}
                  for a total of{" "}
                  <strong style={{ color: accent }}>₹{fmt(totalCost)}</strong>{" "}
                  (incl. 3% GST)
                </label>
              </div>
            )}

            {/* Buy Button */}
            <button
              onClick={handleBuy}
              disabled={!canSubmit || loading}
              style={{
                width: "100%",
                padding: "0.95rem",
                borderRadius: "10px",
                border: "none",
                background: canSubmit
                  ? `linear-gradient(135deg, ${isGold ? "#c9a84c, #e2c06a" : "#64748b, #94a3b8"})`
                  : "#f0ead8",
                color: canSubmit ? (isGold ? "#0a0800" : "#fff") : "#bbb",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: canSubmit ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                boxShadow: canSubmit
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
              Price validated at server. GST of 3% applies on all purchases.
            </p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
