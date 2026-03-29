import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../slice/Authslice";
import UserLayout from "./userLayout";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

/* ── Input Field Component ── */
function Field({ label, icon, name, value, onChange, type = "text", placeholder, disabled, hint }) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label style={{ display: "block", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#aaa", marginBottom: "0.45rem", fontWeight: 500 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", fontSize: "1rem", pointerEvents: "none" }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: "100%",
            padding: icon ? "0.8rem 1rem 0.8rem 2.4rem" : "0.8rem 1rem",
            borderRadius: "10px",
            border: `1px solid ${disabled ? "#f0ead8" : value ? "rgba(201,168,76,0.35)" : "#e5e0d0"}`,
            fontSize: "0.88rem",
            color: disabled ? "#bbb" : "#1a1200",
            outline: "none",
            background: disabled ? "#fafaf7" : "#fff",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
      </div>
      {hint && <div style={{ fontSize: "0.7rem", color: "#bbb", marginTop: "0.3rem" }}>{hint}</div>}
    </div>
  );
}

/* ── Section Card ── */
function Section({ title, subtitle, icon, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: "18px", border: "1px solid #ede8d8", boxShadow: "0 2px 16px rgba(0,0,0,0.04)", marginBottom: "1.5rem", overflow: "hidden" }}>
      <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f5f0e8", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a1200" }}>{title}</div>
          {subtitle && <div style={{ fontSize: "0.72rem", color: "#aaa", marginTop: "0.1rem" }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ padding: "1.4rem 1.5rem" }}>
        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ACCOUNT PAGE
══════════════════════════════════════════ */
export default function AccountPage() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((s) => s.auth);

  const [paymentTab, setPaymentTab] = useState("UPI"); // UPI | BANK
  const [saved,      setSaved]      = useState(false);

  const [form, setForm] = useState({
    userName:    "",
    email:       "",
    phone:       "",
    address:     "",
    city:        "",
    state:       "",
    pincode:     "",
    // UPI
    upiId:       "",
    // Bank
    accountName:   "",
    accountNumber: "",
    ifscCode:      "",
    bankName:      "",
  });

  // Pre-fill from Redux user
  useEffect(() => {
    if (user) {
      setForm({
        userName:      user.userName      || "",
        email:         user.email         || "",
        phone:         user.phone         || "",
        address:       user.address       || "",
        city:          user.city          || "",
        state:         user.state         || "",
        pincode:       user.pincode       || "",
        upiId:         user.upiId         || "",
        accountName:   user.accountName   || "",
        accountNumber: user.accountNumber || "",
        ifscCode:      user.ifscCode      || "",
        bankName:      user.bankName      || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateProfile(form)).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  const kycColor = {
    VERIFIED: { bg: "#dcfce7", color: "#16a34a", label: "Verified ✅" },
    PENDING:  { bg: "#fef9c3", color: "#854d0e", label: "Pending ⏳"  },
    REJECTED: { bg: "#fee2e2", color: "#dc2626", label: "Rejected ❌" },
  }[user?.kycStatus || "PENDING"];

  return (
    <UserLayout active="/user/account">
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: "1.75rem" }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.9rem", fontWeight: 700, color: "#1a1200", margin: 0 }}>
            My Account
          </h1>
          <p style={{ color: "#999", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Manage your personal details and payment information.
          </p>
        </div>

        {/* ── PROFILE BANNER ── */}
        <div style={{
          background: "linear-gradient(135deg,#0f0c00,#1a1200)",
          borderRadius: "20px", padding: "1.5rem",
          marginBottom: "1.5rem",
          border: "1px solid rgba(201,168,76,0.15)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          display: "flex", alignItems: "center", gap: "1.25rem",
        }}>
          {/* Avatar */}
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg,#c9a84c,#e2c06a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0800", fontWeight: 700, fontSize: "1.6rem", flexShrink: 0 }}>
            {user?.userName?.[0]?.toUpperCase() || "U"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 700, color: "#fff" }}>
              {user?.userName || "User"}
            </div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", marginTop: "0.15rem" }}>{user?.email}</div>
            <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <span style={{ padding: "0.2rem 0.65rem", borderRadius: "100px", fontSize: "0.7rem", fontWeight: 600, background: kycColor?.bg, color: kycColor?.color }}>
                KYC {kycColor?.label}
              </span>
              <span style={{ padding: "0.2rem 0.65rem", borderRadius: "100px", fontSize: "0.7rem", fontWeight: 600, background: "rgba(201,168,76,0.15)", color: "#c9a84c" }}>
                {user?.role?.toUpperCase() || "USER"}
              </span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Wallet</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 700, color: "#c9a84c" }}>₹{fmt(user?.walletBalance)}</div>
          </div>
        </div>

        {/* Success / Error */}
        {saved && (
          <div style={{ marginBottom: "1.25rem", padding: "0.9rem 1rem", borderRadius: "10px", background: "#dcfce7", border: "1px solid #86efac", color: "#15803d", fontSize: "0.85rem", fontWeight: 500 }}>
            ✓ Profile updated successfully!
          </div>
        )}
        {error && (
          <div style={{ marginBottom: "1.25rem", padding: "0.9rem 1rem", borderRadius: "10px", background: "#fee2e2", border: "1px solid #fca5a5", color: "#dc2626", fontSize: "0.85rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSave}>

          {/* ── PERSONAL INFORMATION ── */}
          <Section title="Personal Information" subtitle="Your basic account details" icon="👤">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
              <Field label="Username"      icon="👤" name="userName" value={form.userName} onChange={handleChange} placeholder="Your display name" />
              <Field label="Email Address" icon="📧" name="email"    value={form.email}    onChange={handleChange} type="email" placeholder="your@email.com" disabled hint="Contact support to change email" />
              <Field label="Phone Number"  icon="📱" name="phone"    value={form.phone}    onChange={handleChange} type="tel"  placeholder="+91 98765 43210" />
            </div>
          </Section>

          {/* ── ADDRESS ── */}
          <Section title="Address" subtitle="Your residential address" icon="🏠">
            <Field label="Street Address" icon="📍" name="address" value={form.address} onChange={handleChange} placeholder="House No, Street, Area" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 1rem" }}>
              <Field label="City"    name="city"    value={form.city}    onChange={handleChange} placeholder="Chennai"    icon="🏙️" />
              <Field label="State"   name="state"   value={form.state}   onChange={handleChange} placeholder="Tamil Nadu" icon="🗺️" />
              <Field label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} placeholder="600001"    icon="📮" type="number" />
            </div>
          </Section>

          {/* ── PAYMENT DETAILS ── */}
          <Section title="Payment Details" subtitle="For withdrawals and payouts" icon="💳">

            {/* UPI / Bank Toggle */}
            <div style={{ display: "flex", background: "#f0ead8", borderRadius: "10px", padding: "3px", marginBottom: "1.25rem" }}>
              {[
                { id: "UPI",  label: "UPI ID",       icon: "📲" },
                { id: "BANK", label: "Bank Account",  icon: "🏦" },
              ].map(({ id, label, icon }) => (
                <button key={id} type="button" onClick={() => setPaymentTab(id)}
                  style={{ flex: 1, padding: "0.55rem", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: paymentTab === id ? 600 : 400, fontSize: "0.85rem", transition: "all 0.15s", background: paymentTab === id ? "#fff" : "transparent", color: paymentTab === id ? "#c9a84c" : "#999", boxShadow: paymentTab === id ? "0 1px 4px rgba(0,0,0,0.06)" : "none" }}>
                  {icon} {label}
                </button>
              ))}
            </div>

            {/* UPI Tab */}
            {paymentTab === "UPI" && (
              <div>
                <Field
                  label="UPI ID"
                  icon="📲"
                  name="upiId"
                  value={form.upiId}
                  onChange={handleChange}
                  placeholder="yourname@upi or yourname@okaxis"
                  hint="e.g. 9876543210@paytm · kaviprakash@upi · name@ybl"
                />
                {form.upiId && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "-0.5rem", marginBottom: "0.75rem", padding: "0.65rem 0.85rem", background: "#fffbeb", borderRadius: "8px", border: "1px solid #fde68a", fontSize: "0.78rem", color: "#92400e" }}>
                    ⚠️ Make sure your UPI ID is correct. Wrong ID may result in failed transfers.
                  </div>
                )}
              </div>
            )}

            {/* Bank Tab */}
            {paymentTab === "BANK" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
                  <Field label="Account Holder Name" icon="👤" name="accountName"   value={form.accountName}   onChange={handleChange} placeholder="Full name as per bank" />
                  <Field label="Bank Name"           icon="🏦" name="bankName"      value={form.bankName}      onChange={handleChange} placeholder="Name of your bank" />
                  <Field label="Account Number"      icon="🔢" name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="Account Number" type="password" hint="Stored securely" />
                  <Field label="IFSC Code"           icon="🔑" name="ifscCode"      value={form.ifscCode}      onChange={handleChange} placeholder="IFSC Code" />
                </div>
                <div style={{ padding: "0.75rem 1rem", background: "#f0f9ff", borderRadius: "10px", border: "1px solid #bae6fd", fontSize: "0.78rem", color: "#0369a1", lineHeight: 1.6 }}>
                  🔒 Your bank details are encrypted and stored securely. They are only used for withdrawal processing.
                </div>
              </div>
            )}
          </Section>

          {/* ── SAVE BUTTON ── */}
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#c9a84c,#e2c06a)", color: "#0a0800", fontWeight: 700, fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 20px rgba(201,168,76,0.3)", opacity: loading ? 0.7 : 1, transition: "all 0.2s", marginBottom: "1.5rem" }}>
            {loading ? "Saving..." : "Save Changes →"}
          </button>

        </form>

        {/* ── DANGER ZONE ── */}
        <div style={{ background: "#fff", borderRadius: "18px", border: "1px solid #fca5a5", padding: "1.25rem 1.5rem" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 700, color: "#dc2626", marginBottom: "0.5rem" }}>⚠️ Danger Zone</div>
          <p style={{ color: "#888", fontSize: "0.82rem", marginBottom: "0.85rem", lineHeight: 1.6 }}>
            Permanently delete your account and all associated data. This action cannot be undone. Your wallet balance and holdings will be forfeited.
          </p>
          <button type="button"
            style={{ padding: "0.6rem 1.25rem", borderRadius: "8px", border: "1px solid #fca5a5", background: "#fff", color: "#dc2626", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}>
            Delete Account
          </button>
        </div>

      </div>
    </UserLayout>
  );
}