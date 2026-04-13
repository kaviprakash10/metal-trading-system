import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import UserLayout from "./userLayout";
import { TrendingUp, TrendingDown, Info, ChevronRight, Sparkles } from "lucide-react";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const METALS = [
    {
        id: "gold",
        name: "Gold",
        symbol: "Au",
        purity: "24 Karat",
        purityLabel: "999.9 Fine",
        tagline: "The eternal store of wealth",
        description: "Physical gold, digitally held. Invest in 24-karat 999.9 purity gold, stored securely in insured vaults. Start with as little as ₹10.",
        color: "#c9a84c",
        colorLight: "#fffbeb",
        colorBorder: "#fde68a",
        gradient: "linear-gradient(135deg, #c9a84c 0%, #e2c06a 40%, #f5d78e 70%, #c9a84c 100%)",
        shimmer: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
        priceKey: "gold",
        buyTo: "/user/buy/gold",
        sellTo: "/user/sell/gold",
        facts: [
            { label: "Purity", value: "999.9 Fine" },
            { label: "Storage", value: "Insured Vault" },
            { label: "Min Buy", value: "₹10" },
            { label: "Delivery", value: "Available" },
        ],
        benefits: ["Hedge against inflation", "High liquidity", "Digital & physical", "No making charges"],
        history: "Gold has served as currency, store of value and symbol of prosperity for over 5,000 years. Today it remains the world's most trusted safe-haven asset.",
        icon: "🟡",
    },
    {
        id: "silver",
        name: "Silver",
        symbol: "Ag",
        purity: "999 Fine",
        purityLabel: "Sterling Plus",
        tagline: "The affordable precious metal",
        description: "Industrial demand meets precious metal investing. 999 fine silver stored in secure vaults. More affordable than gold with strong long-term potential.",
        color: "#6b7280",
        colorLight: "#f8fafc",
        colorBorder: "#e2e8f0",
        gradient: "linear-gradient(135deg, #94a3b8 0%, #cbd5e1 40%, #f1f5f9 70%, #94a3b8 100%)",
        shimmer: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)",
        priceKey: "silver",
        buyTo: "/user/buy/silver",
        sellTo: "/user/sell/silver",
        facts: [
            { label: "Purity", value: "999 Fine" },
            { label: "Storage", value: "Secure Vault" },
            { label: "Min Buy", value: "₹1" },
            { label: "Delivery", value: "Available" },
        ],
        benefits: ["Industrial demand", "More affordable", "Higher volatility", "Portfolio diversifier"],
        history: "Silver's dual role as both a monetary metal and industrial commodity makes it uniquely positioned. Used in solar panels, electronics, and medicine worldwide.",
        icon: "⚪",
    },
];

/* ─────────────────────────────────────────────
   COIN COMPONENT – animated bullion coin
───────────────────────────────────────────── */
function BullionCoin({ metal, size = 180 }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%",
            background: metal.gradient,
            boxShadow: metal.id === "gold"
                ? "0 8px 40px rgba(201,168,76,0.45), inset 0 2px 8px rgba(255,255,255,0.3), inset 0 -4px 8px rgba(0,0,0,0.15)"
                : "0 8px 40px rgba(148,163,184,0.35), inset 0 2px 8px rgba(255,255,255,0.5), inset 0 -4px 8px rgba(0,0,0,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: "4px",
            position: "relative", overflow: "hidden",
            animation: "coinFloat 3.5s ease-in-out infinite",
            cursor: "default",
        }}>
            {/* Shine sweep */}
            <div style={{
                position: "absolute", inset: 0,
                background: metal.shimmer,
                backgroundSize: "200% 100%",
                animation: "coinShine 2.5s ease-in-out infinite",
                borderRadius: "50%",
            }} />
            {/* Inner ring */}
            <div style={{
                position: "absolute", inset: "12px",
                borderRadius: "50%",
                border: `2px solid rgba(255,255,255,0.25)`,
                pointerEvents: "none",
            }} />
            <span style={{ fontSize: size * 0.28, lineHeight: 1, zIndex: 1 }}>
                {metal.id === "gold" ? "⚜️" : "✦"}
            </span>
            <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: size * 0.13,
                fontWeight: 700,
                color: metal.id === "gold" ? "#7a5c1e" : "#334155",
                letterSpacing: "0.1em",
                zIndex: 1,
            }}>
                {metal.symbol}
            </span>
            <span style={{ fontSize: size * 0.065, color: metal.id === "gold" ? "rgba(122,92,30,0.7)" : "rgba(51,65,85,0.6)", letterSpacing: "0.08em", zIndex: 1 }}>
                {metal.purityLabel}
            </span>
            <style>{`
        @keyframes coinFloat {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes coinShine {
          0%   { background-position: -100% 0; }
          50%, 100% { background-position: 200% 0; }
        }
      `}</style>
        </div>
    );
}

/* ─────────────────────────────────────────────
   METAL CARD
───────────────────────────────────────────── */
function MetalCard({ metal, price, onSelect, selected }) {
    const change = price?.change24h || 2.4;
    const isUp = change >= 0;

    return (
        <div
            onClick={() => onSelect(metal.id)}
            style={{
                background: "#fff",
                borderRadius: "24px",
                border: `2px solid ${selected ? metal.color : "#ede8d8"}`,
                padding: "28px",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                boxShadow: selected
                    ? `0 8px 40px ${metal.id === "gold" ? "rgba(201,168,76,0.2)" : "rgba(148,163,184,0.2)"}`
                    : "0 2px 12px rgba(0,0,0,0.04)",
                transform: selected ? "translateY(-4px)" : "translateY(0)",
                display: "flex", flexDirection: "column", gap: "20px",
            }}
        >
            {/* Top row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <span style={{ fontSize: "1.3rem" }}>{metal.icon}</span>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a1200" }}>{metal.name}</span>
                        <span style={{ padding: "2px 8px", borderRadius: "100px", background: metal.colorLight, color: metal.color, fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", border: `1px solid ${metal.colorBorder}` }}>
                            {metal.purity}
                        </span>
                    </div>
                    <p style={{ color: "#999", fontSize: "12px", fontStyle: "italic" }}>{metal.tagline}</p>
                </div>
                {selected && (
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: metal.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>✓</div>
                )}
            </div>

            {/* Price */}
            <div>
                <div style={{ fontSize: "10px", color: "#bbb", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Price per gram</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 700, color: metal.color }}>
                        ₹{fmt(price?.pricePerGram)}
                    </span>
                    <span style={{
                        display: "flex", alignItems: "center", gap: "3px",
                        padding: "2px 8px", borderRadius: "100px", fontSize: "11px", fontWeight: 600,
                        background: isUp ? "#dcfce7" : "#fee2e2",
                        color: isUp ? "#16a34a" : "#dc2626",
                    }}>
                        {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {isUp ? "+" : ""}{change?.toFixed(2)}%
                    </span>
                </div>
            </div>

            {/* Facts grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {metal.facts.map(f => (
                    <div key={f.label} style={{ background: metal.colorLight, borderRadius: "10px", padding: "10px 12px", border: `1px solid ${metal.colorBorder}` }}>
                        <div style={{ fontSize: "10px", color: "#bbb", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "3px" }}>{f.label}</div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#1a1200" }}>{f.value}</div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div style={{ display: "flex", gap: "8px" }}>
                <Link
                    to={metal.buyTo}
                    onClick={e => e.stopPropagation()}
                    style={{
                        flex: 1, padding: "10px", borderRadius: "10px", border: "none",
                        background: `linear-gradient(135deg,${metal.color},${metal.id === "gold" ? "#e2c06a" : "#cbd5e1"})`,
                        color: metal.id === "gold" ? "#0a0800" : "#0f172a",
                        fontWeight: 700, fontSize: "13px", textAlign: "center",
                        cursor: "pointer", textDecoration: "none",
                        boxShadow: `0 4px 14px ${metal.id === "gold" ? "rgba(201,168,76,0.3)" : "rgba(148,163,184,0.25)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                        transition: "opacity 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                    <TrendingUp size={13} /> Buy {metal.name}
                </Link>
                <Link
                    to={metal.sellTo}
                    onClick={e => e.stopPropagation()}
                    style={{
                        flex: 1, padding: "10px", borderRadius: "10px",
                        border: `1px solid ${metal.colorBorder}`,
                        background: "#fff", color: "#555",
                        fontWeight: 600, fontSize: "13px", textAlign: "center",
                        cursor: "pointer", textDecoration: "none",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                        transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = metal.colorLight}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                    <TrendingDown size={13} /> Sell
                </Link>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   DETAIL PANEL
───────────────────────────────────────────── */
function MetalDetail({ metal, price }) {
    return (
        <div style={{
            background: "#fff", borderRadius: "24px",
            border: `1px solid ${metal.colorBorder}`,
            padding: "36px 32px",
            boxShadow: `0 8px 40px ${metal.id === "gold" ? "rgba(201,168,76,0.12)" : "rgba(148,163,184,0.12)"}`,
            display: "flex", flexDirection: "column", gap: "28px",
        }}>

            {/* Coin + tagline */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px" }}>
                <BullionCoin metal={metal} size={160} />
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 700, color: "#1a1200" }}>{metal.name}</div>
                    <div style={{ color: "#999", fontSize: "13px", fontStyle: "italic", marginTop: "4px" }}>{metal.tagline}</div>
                </div>
            </div>

            {/* Price strip */}
            <div style={{ background: `linear-gradient(135deg, #1a1200, #0f0c00)`, borderRadius: "16px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Current Price</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 700, color: metal.color }}>₹{fmt(price?.pricePerGram)}<span style={{ fontSize: "0.9rem", opacity: 0.6 }}>/g</span></div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Per 10g</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff" }}>₹{fmt((price?.pricePerGram || 0) * 10)}</div>
                </div>
            </div>

            {/* Benefits */}
            <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Why {metal.name}?</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {metal.benefits.map(b => (
                        <div key={b} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ width: "18px", height: "18px", borderRadius: "50%", background: metal.colorLight, border: `1px solid ${metal.colorBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", flexShrink: 0, color: metal.color }}>✓</span>
                            <span style={{ fontSize: "13px", color: "#444" }}>{b}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* History note */}
            <div style={{ background: metal.colorLight, borderRadius: "14px", padding: "16px", border: `1px solid ${metal.colorBorder}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                    <Info size={13} style={{ color: metal.color }} />
                    <span style={{ fontSize: "10px", fontWeight: 700, color: metal.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>Did you know?</span>
                </div>
                <p style={{ fontSize: "12.5px", color: "#555", lineHeight: 1.65, margin: 0 }}>{metal.history}</p>
            </div>

            {/* Big CTA */}
            <Link
                to={metal.buyTo}
                style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    padding: "14px", borderRadius: "14px",
                    background: `linear-gradient(135deg,${metal.color},${metal.id === "gold" ? "#e2c06a" : "#cbd5e1"})`,
                    color: metal.id === "gold" ? "#0a0800" : "#0f172a",
                    fontWeight: 700, fontSize: "15px", textDecoration: "none",
                    boxShadow: `0 6px 20px ${metal.id === "gold" ? "rgba(201,168,76,0.35)" : "rgba(148,163,184,0.3)"}`,
                    transition: "opacity 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
                <Sparkles size={15} />
                Start Investing in {metal.name}
                <ChevronRight size={15} />
            </Link>
        </div>
    );
}

/* ─────────────────────────────────────────────
   GALLERY PAGE
───────────────────────────────────────────── */
export default function GalleryPage() {
    const { current: currentPrices } = useSelector((s) => s.price);
    const [selected, setSelected] = useState("gold");
    const selectedMetal = METALS.find(m => m.id === selected);

    return (
        <UserLayout active="/user/gallery">
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

                {/* Header */}
                <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 14px", borderRadius: "100px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", marginBottom: "12px" }}>
                        <Sparkles size={12} style={{ color: "#c9a84c" }} />
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#c9a84c", letterSpacing: "0.1em", textTransform: "uppercase" }}>Metal Gallery</span>
                    </div>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: "#1a1200", margin: "0 0 8px" }}>
                        Precious Metals Collection
                    </h1>
                    <p style={{ color: "#999", fontSize: "15px", maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
                        Invest in real, physical precious metals — stored securely in insured vaults and accessible anytime.
                    </p>
                </div>

                {/* Live price ticker */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "24px",
                    marginBottom: "2.5rem", padding: "14px 28px",
                    background: "#1a1200", borderRadius: "16px",
                    border: "1px solid rgba(201,168,76,0.15)",
                    flexWrap: "wrap",
                }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Live Prices</span>
                    {METALS.map(m => (
                        <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "1rem" }}>{m.icon}</span>
                            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 600 }}>{m.name}</span>
                            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 700, color: m.color }}>
                                ₹{fmt(currentPrices?.[m.priceKey]?.pricePerGram)}/g
                            </span>
                        </div>
                    ))}
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>• Updated live</span>
                </div>

                {/* Main grid: cards + detail */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 380px", gap: "20px", alignItems: "start" }}>

                    {/* Metal cards */}
                    {METALS.map(m => (
                        <MetalCard
                            key={m.id}
                            metal={m}
                            price={currentPrices?.[m.priceKey]}
                            onSelect={setSelected}
                            selected={selected === m.id}
                        />
                    ))}

                    {/* Detail panel */}
                    <MetalDetail
                        metal={selectedMetal}
                        price={currentPrices?.[selectedMetal.priceKey]}
                    />
                </div>

                {/* Bottom comparison strip */}
                <div style={{ marginTop: "2rem", background: "#fff", borderRadius: "20px", border: "1px solid #ede8d8", padding: "24px 28px" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 700, color: "#1a1200", marginBottom: "16px" }}>Gold vs Silver — At a Glance</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
                        {[
                            { label: "Purity", gold: "999.9 Fine", silver: "999 Fine" },
                            { label: "Min Investment", gold: "₹10", silver: "₹1" },
                            { label: "Volatility", gold: "Low–Medium", silver: "Medium–High" },
                            { label: "Industrial Use", gold: "Limited", silver: "High (solar, tech)" },
                            { label: "Liquidity", gold: "Very High", silver: "High" },
                            { label: "Delivery", gold: "Available", silver: "Available" },
                        ].map(row => (
                            <div key={row.label} style={{ background: "#fafaf7", borderRadius: "12px", padding: "12px 14px", border: "1px solid #f0ead8" }}>
                                <div style={{ fontSize: "10px", fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>{row.label}</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <span style={{ fontSize: "10px" }}>🟡</span>
                                        <span style={{ fontSize: "12px", color: "#c9a84c", fontWeight: 600 }}>{row.gold}</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <span style={{ fontSize: "10px" }}>⚪</span>
                                        <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>{row.silver}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </UserLayout>
    );
}