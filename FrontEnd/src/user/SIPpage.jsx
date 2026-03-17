import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMySips,
  createSip,
  pauseSip,
  resumeSip,
  deleteSip,
} from "../slice/Sipslice";
import { fetchWallet } from "../slice/Walletslice";
import UserLayout from "./userLayout";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const DAYS = Array.from({ length: 28 }, (_, i) => i + 1);
const ordinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/* ── SIP Card ── */
function SipCard({ sip, onPause, onResume, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const isActive = sip.status === "ACTIVE";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        border: `1px solid ${isActive ? "#ede8d8" : "#e5e5e5"}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        overflow: "hidden",
        opacity: isActive ? 1 : 0.75,
      }}
    >
      {/* Card top strip */}
      <div
        style={{
          height: "4px",
          background: isActive
            ? sip.asset === "GOLD"
              ? "linear-gradient(90deg, #c9a84c, #e2c06a)"
              : "linear-gradient(90deg, #64748b, #94a3b8)"
            : "#e5e5e5",
        }}
      />

      <div style={{ padding: "1.25rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1rem",
          }}
        >
          {/* Left: asset + amount */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background:
                  sip.asset === "GOLD"
                    ? "rgba(201,168,76,0.1)"
                    : "rgba(148,163,184,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
              }}
            >
              {sip.asset === "GOLD" ? "🟡" : "⚪"}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "#1a1200",
                }}
              >
                ₹{fmt(sip.amountPerMonth)}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#aaa" }}>
                per month · {sip.asset}
              </div>
            </div>
          </div>

          {/* Status badge */}
          <span
            style={{
              padding: "0.22rem 0.7rem",
              borderRadius: "100px",
              fontSize: "0.7rem",
              fontWeight: 600,
              background: isActive ? "#dcfce7" : "#f5f5f5",
              color: isActive ? "#16a34a" : "#888",
            }}
          >
            {isActive ? "● Active" : "⏸ Paused"}
          </span>
        </div>

        {/* Details row */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            padding: "0.75rem 0",
            borderTop: "1px solid #f5f0e8",
            borderBottom: "1px solid #f5f0e8",
            marginBottom: "1rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.65rem",
                color: "#bbb",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Debit Day
            </div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.88rem",
                color: "#1a1200",
                marginTop: "0.15rem",
              }}
            >
              {ordinal(sip.dayOfMonth)} of month
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "0.65rem",
                color: "#bbb",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Last Executed
            </div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.88rem",
                color: "#1a1200",
                marginTop: "0.15rem",
              }}
            >
              {sip.lastExecutedAt
                ? new Date(sip.lastExecutedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                : "Not yet"}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "0.65rem",
                color: "#bbb",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Created
            </div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.88rem",
                color: "#1a1200",
                marginTop: "0.15rem",
              }}
            >
              {new Date(sip.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.6rem" }}>
          {isActive ? (
            <button
              onClick={() => onPause(sip._id)}
              style={{
                flex: 1,
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #e5e0d0",
                background: "#fafaf7",
                color: "#888",
                fontSize: "0.8rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              ⏸ Pause
            </button>
          ) : (
            <button
              onClick={() => onResume(sip._id)}
              style={{
                flex: 1,
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid rgba(201,168,76,0.3)",
                background: "rgba(201,168,76,0.08)",
                color: "#c9a84c",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ▶ Resume
            </button>
          )}

          {confirming ? (
            <div style={{ display: "flex", gap: "0.4rem", flex: 1 }}>
              <button
                onClick={() => onDelete(sip._id)}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirming(false)}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #e5e0d0",
                  background: "#fff",
                  color: "#888",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              style={{
                padding: "0.5rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid #fca5a5",
                background: "#fff",
                color: "#dc2626",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              🗑
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SIP PAGE
══════════════════════════════════════════ */
export default function SipPage() {
  const dispatch = useDispatch();
  const { sips, loading, error, successMessage } = useSelector((s) => s.sip);
  const { walletBalance } = useSelector((s) => s.wallet);

  const [form, setForm] = useState({
    asset: "GOLD",
    amountPerMonth: "",
    dayOfMonth: 1,
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchMySips());
    dispatch(fetchWallet());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setForm({ asset: "GOLD", amountPerMonth: "", dayOfMonth: 1 });
      setShowForm(false);
    }
  }, [successMessage]);

  const handleCreate = () => {
    if (!form.amountPerMonth || parseFloat(form.amountPerMonth) <= 0) return;
    dispatch(
      createSip({
        asset: form.asset,
        amountPerMonth: parseFloat(form.amountPerMonth),
        dayOfMonth: parseInt(form.dayOfMonth),
      }),
    );
  };

  const activeSips = sips.filter((s) => s.status === "ACTIVE");
  const totalMonthly = activeSips.reduce((sum, s) => sum + s.amountPerMonth, 0);

  return (
    <UserLayout active="/user/sip">
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.75rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.9rem",
              fontWeight: 700,
              color: "#1a1200",
              margin: 0,
            }}
          >
            SIP Plans
          </h1>
          <p
            style={{
              color: "#999",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            Automate your monthly gold & silver investments.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "10px",
            border: "none",
            background: showForm
              ? "#f0ead8"
              : "linear-gradient(135deg,#c9a84c,#e2c06a)",
            color: showForm ? "#888" : "#0a0800",
            fontWeight: 600,
            fontSize: "0.88rem",
            cursor: "pointer",
            boxShadow: showForm ? "none" : "0 2px 12px rgba(201,168,76,0.3)",
          }}
        >
          {showForm ? "✕ Cancel" : "+ New SIP"}
        </button>
      </div>

      {/* ── SUMMARY STRIP ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {[
          {
            label: "Active SIPs",
            value: activeSips.length,
            icon: "🔄",
            color: "#16a34a",
          },
          {
            label: "Monthly Outflow",
            value: `₹${fmt(totalMonthly)}`,
            icon: "📅",
            color: "#c9a84c",
          },
          {
            label: "Total SIPs",
            value: sips.length,
            icon: "📋",
            color: "#1a1200",
          },
          {
            label: "Wallet Balance",
            value: `₹${fmt(walletBalance)}`,
            icon: "💰",
            color: "#1a1200",
          },
        ].map(({ label, value, icon, color }) => (
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
                marginBottom: "0.25rem",
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

      {/* ── CREATE SIP FORM ── */}
      {showForm && (
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            border: "1px solid rgba(201,168,76,0.2)",
            boxShadow: "0 4px 24px rgba(201,168,76,0.08)",
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
              marginTop: 0,
              marginBottom: "1.25rem",
            }}
          >
            Create New SIP
          </h2>

          {error && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.85rem",
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            {/* Asset */}
            <div>
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
                Asset
              </label>
              <div
                style={{
                  display: "flex",
                  background: "#f0ead8",
                  borderRadius: "10px",
                  padding: "3px",
                }}
              >
                {["GOLD", "SILVER"].map((a) => (
                  <button
                    key={a}
                    onClick={() => setForm((f) => ({ ...f, asset: a }))}
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: form.asset === a ? 600 : 400,
                      fontSize: "0.82rem",
                      background: form.asset === a ? "#fff" : "transparent",
                      color:
                        form.asset === a
                          ? a === "GOLD"
                            ? "#c9a84c"
                            : "#64748b"
                          : "#999",
                      boxShadow:
                        form.asset === a
                          ? "0 1px 4px rgba(0,0,0,0.06)"
                          : "none",
                    }}
                  >
                    {a === "GOLD" ? "🟡" : "⚪"} {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Debit day */}
            <div>
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
                Debit Day of Month
              </label>
              <select
                value={form.dayOfMonth}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    dayOfMonth: parseInt(e.target.value),
                  }))
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  border: "1px solid #e5e0d0",
                  fontSize: "0.88rem",
                  color: "#1a1200",
                  background: "#fafaf7",
                  outline: "none",
                }}
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {ordinal(d)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Monthly Amount */}
          <div style={{ marginBottom: "1.25rem" }}>
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
              Monthly Amount (₹)
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: form.amountPerMonth ? "#c9a84c" : "#ccc",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                ₹
              </span>
              <input
                type="number"
                min="100"
                value={form.amountPerMonth}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amountPerMonth: e.target.value }))
                }
                placeholder="e.g. 1000"
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem 0.85rem 2.2rem",
                  borderRadius: "10px",
                  border: `1px solid ${form.amountPerMonth ? "rgba(201,168,76,0.4)" : "#e5e0d0"}`,
                  fontSize: "1rem",
                  color: "#1a1200",
                  outline: "none",
                  background: "#fafaf7",
                  boxSizing: "border-box",
                }}
              />
            </div>
            {/* Quick amounts */}
            <div
              style={{
                display: "flex",
                gap: "0.4rem",
                marginTop: "0.6rem",
                flexWrap: "wrap",
              }}
            >
              {[500, 1000, 2000, 5000].map((a) => (
                <button
                  key={a}
                  onClick={() =>
                    setForm((f) => ({ ...f, amountPerMonth: String(a) }))
                  }
                  style={{
                    padding: "0.32rem 0.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${form.amountPerMonth == a ? "rgba(201,168,76,0.4)" : "#e5e0d0"}`,
                    background:
                      form.amountPerMonth == a
                        ? "rgba(201,168,76,0.08)"
                        : "#fafaf7",
                    color: form.amountPerMonth == a ? "#c9a84c" : "#888",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  ₹{a >= 1000 ? `${a / 1000}K` : a}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {form.amountPerMonth && parseFloat(form.amountPerMonth) > 0 && (
            <div
              style={{
                marginBottom: "1.25rem",
                padding: "0.9rem 1rem",
                background: "#fafaf7",
                borderRadius: "12px",
                border: "1px solid #f0ead8",
                fontSize: "0.83rem",
                color: "#666",
                lineHeight: 1.6,
              }}
            >
              On the{" "}
              <strong style={{ color: "#1a1200" }}>
                {ordinal(form.dayOfMonth)}
              </strong>{" "}
              of every month,{" "}
              <strong style={{ color: "#c9a84c" }}>
                ₹{fmt(parseFloat(form.amountPerMonth))}
              </strong>{" "}
              will be automatically invested in{" "}
              <strong style={{ color: "#1a1200" }}>
                {form.asset === "GOLD" ? "Gold 🟡" : "Silver ⚪"}
              </strong>{" "}
              at that day's live rate.
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={
              loading ||
              !form.amountPerMonth ||
              parseFloat(form.amountPerMonth) <= 0
            }
            style={{
              width: "100%",
              padding: "0.9rem",
              borderRadius: "10px",
              border: "none",
              background:
                form.amountPerMonth && parseFloat(form.amountPerMonth) > 0
                  ? "linear-gradient(135deg,#c9a84c,#e2c06a)"
                  : "#f0ead8",
              color:
                form.amountPerMonth && parseFloat(form.amountPerMonth) > 0
                  ? "#0a0800"
                  : "#bbb",
              fontWeight: 700,
              fontSize: "0.92rem",
              cursor: form.amountPerMonth ? "pointer" : "not-allowed",
              boxShadow: form.amountPerMonth
                ? "0 4px 16px rgba(201,168,76,0.3)"
                : "none",
            }}
          >
            {loading ? "Creating..." : "Create SIP →"}
          </button>
        </div>
      )}

      {/* ── SIP LIST ── */}
      {loading && !sips.length ? (
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
      ) : sips.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            background: "#fff",
            borderRadius: "20px",
            border: "1px solid #ede8d8",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔄</div>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "#1a1200",
              marginBottom: "0.5rem",
            }}
          >
            No SIPs yet
          </h3>
          <p
            style={{
              color: "#aaa",
              fontSize: "0.88rem",
              marginBottom: "1.5rem",
            }}
          >
            Set up a monthly SIP to invest automatically in gold or silver.
          </p>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: "0.7rem 1.8rem",
              background: "linear-gradient(135deg,#c9a84c,#e2c06a)",
              color: "#0a0800",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.88rem",
              cursor: "pointer",
            }}
          >
            Create Your First SIP →
          </button>
        </div>
      ) : (
        <>
          {successMessage && (
            <div
              style={{
                marginBottom: "1rem",
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {sips.map((sip) => (
              <SipCard
                key={sip._id}
                sip={sip}
                onPause={(id) => dispatch(pauseSip(id))}
                onResume={(id) => dispatch(resumeSip(id))}
                onDelete={(id) => dispatch(deleteSip(id))}
              />
            ))}
          </div>
        </>
      )}

      {/* How SIP works info box */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "1.25rem",
          background: "#fffbeb",
          borderRadius: "14px",
          border: "1px solid #fde68a",
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "#92400e",
            marginBottom: "0.5rem",
          }}
        >
          💡 How SIP works
        </div>
        <div style={{ fontSize: "0.8rem", color: "#a16207", lineHeight: 1.6 }}>
          Every month on your selected date, the SIP amount is automatically
          debited from your wallet and invested at that day's live gold/silver
          rate. Make sure your wallet has sufficient balance before the debit
          date.
        </div>
      </div>
    </UserLayout>
  );
}
