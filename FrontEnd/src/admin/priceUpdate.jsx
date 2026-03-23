import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGoldPrice, setSilverPrice } from "../slice/Adminslice";
import { fetchCurrentPrices, fetchPriceHistory } from "../slice/Priceslice";
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

export default function PriceManagement() {
  const dispatch = useDispatch();

  const { current, history } = useSelector((s) => s.price);
  const { loading, error, successMessage } = useSelector((s) => s.admin);

  const [goldInput, setGoldInput] = useState("");
  const [silverInput, setSilverInput] = useState("");
  const [goldConfirm, setGoldConfirm] = useState(false);
  const [silverConfirm, setSilverConfirm] = useState(false);
  const [activeHistory, setActiveHistory] = useState("GOLD"); // GOLD | SILVER

  useEffect(() => {
    dispatch(fetchCurrentPrices());
    dispatch(fetchPriceHistory({ asset: "GOLD", limit: 10 }));
    dispatch(fetchPriceHistory({ asset: "SILVER", limit: 10 }));
  }, [dispatch]);

  // Reset confirm when input changes
  const handleGoldInput = (v) => {
    setGoldInput(v);
    setGoldConfirm(false);
  };
  const handleSilverInput = (v) => {
    setSilverInput(v);
    setSilverConfirm(false);
  };

  const handleSetGold = () => {
    if (!goldInput || parseFloat(goldInput) <= 0) return;
    dispatch(setGoldPrice({ pricePerGram: parseFloat(goldInput) }));
    setGoldInput("");
    setGoldConfirm(false);
  };

  const handleSetSilver = () => {
    if (!silverInput || parseFloat(silverInput) <= 0) return;
    dispatch(setSilverPrice({ pricePerGram: parseFloat(silverInput) }));
    setSilverInput("");
    setSilverConfirm(false);
  };

  const currentGold = current.gold?.pricePerGram ?? 0;
  const currentSilver = current.silver?.pricePerGram ?? 0;

  // Calculate % change from input vs current
  const goldChange =
    goldInput && currentGold
      ? (((parseFloat(goldInput) - currentGold) / currentGold) * 100).toFixed(2)
      : null;
  const silverChange =
    silverInput && currentSilver
      ? (
          ((parseFloat(silverInput) - currentSilver) / currentSilver) *
          100
        ).toFixed(2)
      : null;

  const historyData =
    activeHistory === "GOLD" ? history.gold || [] : history.silver || [];

  return (
    <AdminLayout active="/admin/prices">
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
          Price Control
        </h1>
        <p
          style={{ color: "#999", fontSize: "0.875rem", marginTop: "0.25rem" }}
        >
          Manually override live gold & silver prices per gram.
        </p>
      </div>

      {/* Success / Error */}
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

      {/* ── CURRENT PRICE BANNERS ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        {[
          {
            label: "Current Gold Price",
            value: currentGold,
            color: "#c9a84c",
            icon: "🟡",
            sub: current.gold?.updatedAt
              ? `Updated: ${fmtDate(current.gold.updatedAt)} ${fmtTime(current.gold.updatedAt)}`
              : "Auto-fetched",
          },
          {
            label: "Current Silver Price",
            value: currentSilver,
            color: "#94a3b8",
            icon: "⚪",
            sub: current.silver?.updatedAt
              ? `Updated: ${fmtDate(current.silver.updatedAt)} ${fmtTime(current.silver.updatedAt)}`
              : "Auto-fetched",
          },
        ].map(({ label, value, color, icon, sub }) => (
          <div
            key={label}
            style={{
              background: "linear-gradient(135deg,#0f0c00,#1a1200)",
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
                right: "-50px",
                top: "-50px",
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                border: "1px solid rgba(201,168,76,0.05)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: "0.5rem",
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2.8rem",
                fontWeight: 700,
                color,
                lineHeight: 1,
              }}
            >
              {icon} ₹{fmt(value)}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.72rem",
                marginTop: "0.75rem",
              }}
            >
              per gram · {sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── UPDATE PRICE CARDS ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* ── GOLD ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            border: "1px solid #ede8d8",
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            padding: "1.75rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "rgba(201,168,76,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.3rem",
              }}
            >
              🟡
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#1a1200",
                }}
              >
                Set Gold Price
              </div>
              <div style={{ fontSize: "0.72rem", color: "#aaa" }}>
                Current: ₹{fmt(currentGold)}/g
              </div>
            </div>
          </div>

          {/* Input */}
          <div style={{ marginBottom: "1rem" }}>
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
              New Price per Gram (₹)
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: goldInput ? "#c9a84c" : "#ccc",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                }}
              >
                ₹
              </span>
              <input
                type="number"
                min="1"
                value={goldInput}
                onChange={(e) => handleGoldInput(e.target.value)}
                placeholder={`e.g. ${Math.round(currentGold)}`}
                style={{
                  width: "100%",
                  padding: "0.9rem 1rem 0.9rem 2.2rem",
                  borderRadius: "10px",
                  border: `1.5px solid ${goldInput ? "rgba(201,168,76,0.4)" : "#e5e0d0"}`,
                  fontSize: "1rem",
                  color: "#1a1200",
                  outline: "none",
                  background: "#fafaf7",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
          </div>

          {/* Change preview */}
          {goldChange !== null && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.75rem 1rem",
                background: parseFloat(goldChange) >= 0 ? "#f0fdf4" : "#fff1f2",
                borderRadius: "10px",
                border: `1px solid ${parseFloat(goldChange) >= 0 ? "#bbf7d0" : "#fecdd3"}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "0.82rem", color: "#888" }}>
                Change from current
              </span>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: parseFloat(goldChange) >= 0 ? "#16a34a" : "#dc2626",
                }}
              >
                {parseFloat(goldChange) >= 0 ? "▲ +" : "▼ "}
                {goldChange}%
              </span>
            </div>
          )}

          {/* Confirm checkbox */}
          {goldInput && parseFloat(goldInput) > 0 && (
            <div
              style={{
                marginBottom: "1rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.6rem",
              }}
            >
              <input
                type="checkbox"
                id="goldConfirm"
                checked={goldConfirm}
                onChange={(e) => setGoldConfirm(e.target.checked)}
                style={{
                  marginTop: "2px",
                  accentColor: "#c9a84c",
                  cursor: "pointer",
                }}
              />
              <label
                htmlFor="goldConfirm"
                style={{
                  fontSize: "0.82rem",
                  color: "#888",
                  cursor: "pointer",
                  lineHeight: 1.5,
                }}
              >
                I confirm setting Gold price to{" "}
                <strong style={{ color: "#c9a84c" }}>
                  ₹{fmt(parseFloat(goldInput))}/g
                </strong>
                . This will affect all future trades immediately.
              </label>
            </div>
          )}

          <button
            onClick={handleSetGold}
            disabled={
              !goldConfirm ||
              loading ||
              !goldInput ||
              parseFloat(goldInput) <= 0
            }
            style={{
              width: "100%",
              padding: "0.9rem",
              borderRadius: "10px",
              border: "none",
              background:
                goldConfirm && goldInput
                  ? "linear-gradient(135deg,#c9a84c,#e2c06a)"
                  : "#f0ead8",
              color: goldConfirm && goldInput ? "#0a0800" : "#bbb",
              fontWeight: 700,
              fontSize: "0.92rem",
              cursor: goldConfirm && goldInput ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow:
                goldConfirm && goldInput
                  ? "0 4px 16px rgba(201,168,76,0.3)"
                  : "none",
            }}
          >
            {loading ? "Updating..." : "Update Gold Price →"}
          </button>
        </div>

        {/* ── SILVER ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            border: "1px solid #ede8d8",
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            padding: "1.75rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "rgba(148,163,184,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.3rem",
              }}
            >
              ⚪
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#1a1200",
                }}
              >
                Set Silver Price
              </div>
              <div style={{ fontSize: "0.72rem", color: "#aaa" }}>
                Current: ₹{fmt(currentSilver)}/g
              </div>
            </div>
          </div>

          {/* Input */}
          <div style={{ marginBottom: "1rem" }}>
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
              New Price per Gram (₹)
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: silverInput ? "#94a3b8" : "#ccc",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                }}
              >
                ₹
              </span>
              <input
                type="number"
                min="1"
                value={silverInput}
                onChange={(e) => handleSilverInput(e.target.value)}
                placeholder={`e.g. ${Math.round(currentSilver)}`}
                style={{
                  width: "100%",
                  padding: "0.9rem 1rem 0.9rem 2.2rem",
                  borderRadius: "10px",
                  border: `1.5px solid ${silverInput ? "rgba(148,163,184,0.4)" : "#e5e0d0"}`,
                  fontSize: "1rem",
                  color: "#1a1200",
                  outline: "none",
                  background: "#fafaf7",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
          </div>

          {/* Change preview */}
          {silverChange !== null && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.75rem 1rem",
                background:
                  parseFloat(silverChange) >= 0 ? "#f0fdf4" : "#fff1f2",
                borderRadius: "10px",
                border: `1px solid ${parseFloat(silverChange) >= 0 ? "#bbf7d0" : "#fecdd3"}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "0.82rem", color: "#888" }}>
                Change from current
              </span>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: parseFloat(silverChange) >= 0 ? "#16a34a" : "#dc2626",
                }}
              >
                {parseFloat(silverChange) >= 0 ? "▲ +" : "▼ "}
                {silverChange}%
              </span>
            </div>
          )}

          {/* Confirm checkbox */}
          {silverInput && parseFloat(silverInput) > 0 && (
            <div
              style={{
                marginBottom: "1rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.6rem",
              }}
            >
              <input
                type="checkbox"
                id="silverConfirm"
                checked={silverConfirm}
                onChange={(e) => setSilverConfirm(e.target.checked)}
                style={{
                  marginTop: "2px",
                  accentColor: "#94a3b8",
                  cursor: "pointer",
                }}
              />
              <label
                htmlFor="silverConfirm"
                style={{
                  fontSize: "0.82rem",
                  color: "#888",
                  cursor: "pointer",
                  lineHeight: 1.5,
                }}
              >
                I confirm setting Silver price to{" "}
                <strong style={{ color: "#64748b" }}>
                  ₹{fmt(parseFloat(silverInput))}/g
                </strong>
                . This will affect all future trades immediately.
              </label>
            </div>
          )}

          <button
            onClick={handleSetSilver}
            disabled={
              !silverConfirm ||
              loading ||
              !silverInput ||
              parseFloat(silverInput) <= 0
            }
            style={{
              width: "100%",
              padding: "0.9rem",
              borderRadius: "10px",
              border: "none",
              background:
                silverConfirm && silverInput
                  ? "linear-gradient(135deg,#64748b,#94a3b8)"
                  : "#f0ead8",
              color: silverConfirm && silverInput ? "#fff" : "#bbb",
              fontWeight: 700,
              fontSize: "0.92rem",
              cursor: silverConfirm && silverInput ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow:
                silverConfirm && silverInput
                  ? "0 4px 16px rgba(100,116,139,0.3)"
                  : "none",
            }}
          >
            {loading ? "Updating..." : "Update Silver Price →"}
          </button>
        </div>
      </div>

      {/* ── WARNING BOX ── */}
      <div
        style={{
          marginBottom: "1.5rem",
          padding: "1.1rem 1.25rem",
          background: "#fff7ed",
          borderRadius: "14px",
          border: "1px solid #fed7aa",
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "#9a3412",
            marginBottom: "0.4rem",
          }}
        >
          ⚠️ Important Notice
        </div>
        <div style={{ fontSize: "0.8rem", color: "#c2410c", lineHeight: 1.7 }}>
          Manually set prices{" "}
          <strong>override the auto-fetched live prices</strong> immediately and
          affect all new trades. The cron job runs every{" "}
          <strong>2 hours</strong> and will overwrite this with the latest
          market price. Use this only when the live price feed is unavailable or
          incorrect.
        </div>
      </div>

      {/* ── PRICE HISTORY ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #ede8d8",
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        {/* History Header with tab toggle */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderBottom: "1px solid #f0ead8",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "#1a1200",
            }}
          >
            Price History
          </div>
          <div
            style={{
              display: "flex",
              background: "#f0ead8",
              borderRadius: "8px",
              padding: "3px",
            }}
          >
            {["GOLD", "SILVER"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveHistory(t)}
                style={{
                  padding: "0.35rem 0.9rem",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "0.78rem",
                  fontWeight: activeHistory === t ? 600 : 400,
                  cursor: "pointer",
                  background: activeHistory === t ? "#fff" : "transparent",
                  color:
                    activeHistory === t
                      ? t === "GOLD"
                        ? "#c9a84c"
                        : "#64748b"
                      : "#999",
                  boxShadow:
                    activeHistory === t ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                  transition: "all 0.15s",
                }}
              >
                {t === "GOLD" ? "🟡" : "⚪"} {t}
              </button>
            ))}
          </div>
        </div>

        {/* History Table */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            padding: "0.65rem 1.25rem",
            background: "#fafaf7",
            borderBottom: "1px solid #f0ead8",
          }}
        >
          {["Price per Gram", "Date", "Time"].map((h) => (
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

        {historyData.length === 0 ? (
          <div
            style={{
              padding: "2.5rem",
              textAlign: "center",
              color: "#bbb",
              fontSize: "0.85rem",
            }}
          >
            No price history available yet.
          </div>
        ) : (
          historyData.map((entry, i) => (
            <div
              key={entry._id || i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                padding: "0.85rem 1.25rem",
                borderBottom:
                  i < historyData.length - 1 ? "1px solid #f5f0e8" : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fafaf7")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: activeHistory === "GOLD" ? "#c9a84c" : "#64748b",
                }}
              >
                ₹{fmt(entry.pricePerGram)}/g
              </div>
              <div
                style={{
                  fontSize: "0.83rem",
                  color: "#888",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {fmtDate(entry.createdAt)}
              </div>
              <div
                style={{
                  fontSize: "0.83rem",
                  color: "#bbb",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {fmtTime(entry.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
