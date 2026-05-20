import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../slice/authSlice";
import UserLayout from "./userLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ShieldCheck,
  Wallet,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Save,
  Building2,
  Smartphone,
  Hash,
  ArrowRight,
  AlertTriangle,
  Info,
  Key,
  Database,
  Lock,
  Globe,
  RefreshCcw,
  Clock,
  ShieldPlus,
  Activity,
  Fingerprint,
  Cpu,
  Scan
} from "lucide-react";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

/* ── Simple Field Component ── */
function Field({ label, icon: Icon, name, value, onChange, type = "text", placeholder, disabled, hint }) {
  return (
    <div className="flex flex-col gap-2 mb-8">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#BA943A] transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full py-4 rounded-[1.25rem] text-[13px] font-extrabold transition-all outline-none border
            ${Icon ? "pl-14 pr-6" : "px-6"}
            ${disabled
              ? "bg-slate-50 text-slate-400 border-dashed border-slate-200 cursor-not-allowed"
              : "bg-slate-50 border-slate-100 text-slate-900 focus:bg-white focus:border-[#BA943A]/40 transition-all shadow-sm"}`}
        />
      </div>
      {hint && <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest ml-1 flex items-center gap-2 opacity-60"><Info size={12} /> {hint}</p>}
    </div>
  );
}

/* ── Simple Section Component ── */
function Section({ title, subtitle, icon: Icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-10"
    >
      <div className="px-8 py-8 border-b border-slate-50 flex items-center justify-between bg-white group hover:bg-slate-50/30 transition-colors">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#BA943A] shadow-inner transition-transform group-hover:scale-105">
            <Icon size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
            {subtitle && <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="p-8">
        {children}
      </div>
    </motion.div>
  );
}

export default function AccountPage() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((s) => s.auth);

  const [paymentTab, setPaymentTab] = useState("UPI");
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    userName: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
    upiId: "", accountName: "", accountNumber: "", ifscCode: "", bankName: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        userName: user.userName || "", email: user.email || "", phone: user.phone || "",
        address: user.address || "", city: user.city || "", state: user.state || "", pincode: user.pincode || "",
        upiId: user.upiId || "", accountName: user.accountName || "", accountNumber: user.accountNumber || "",
        ifscCode: user.ifscCode || "", bankName: user.bankName || "",
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
      setTimeout(() => setSaved(false), 4000);
    });
  };

  const kycStatus = user?.kycStatus || "PENDING";
  const kycConfig = {
    VERIFIED: { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", label: "Identity Verified", icon: ShieldCheck },
    PENDING: { color: "text-[#BA943A]", bg: "bg-yellow-50", border: "border-yellow-100", label: "Awaiting Verification", icon: Clock },
    REJECTED: { color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", label: "Verification Failed", icon: AlertTriangle },
  }[kycStatus];

  return (
    <UserLayout active="/user/account">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Header Section (Staff-Matched) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight leading-none mb-3">
              My Identity<span className="text-amber-500">.</span>
            </h1>
            <p className="text-slate-500 font-medium flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-[#BA943A]" />
              Profile Security
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-2" />
              <Database size={16} className="text-slate-400" />
              Layer-3 Authorized
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 bg-white p-3 rounded-[1.5rem] border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
              <Lock size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Access Node</p>
              <p className="text-sm font-black text-slate-900">Verified Personnel</p>
            </div>
          </motion.div>
        </div>

        {/* Profile Card (Simplified Digital ID) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-slate-900 text-white rounded-[2.5rem] p-10 overflow-hidden shadow-2xl border border-white/5"
        >
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="relative">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#BA943A] to-[#E2C06A] flex items-center justify-center text-[#100C04] font-serif text-5xl font-black shadow-xl">
                {user?.userName?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border-4 border-slate-900 flex items-center justify-center text-emerald-500 shadow-lg">
                <ShieldCheck size={14} strokeWidth={3} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h2 className="font-serif text-4xl font-black text-white tracking-tighter leading-none mb-3">{user?.userName || "Investor Member"}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
                  <div className="flex items-center gap-2 text-white/50 text-[11px] font-black tracking-widest uppercase">
                    <Mail size={14} className="text-[#BA943A]" /> {user?.email}
                  </div>
                  <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${kycConfig.bg} ${kycConfig.color} ${kycConfig.border} shadow-lg shadow-black/20`}>
                    <kycConfig.icon size={12} strokeWidth={3} /> {kycConfig.label}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 min-w-[200px] text-center backdrop-blur-xl">
              <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-4">Total Liquidity</p>
              <p className="font-serif text-3xl font-black text-[#D8B452]">₹{fmt(user?.walletBalance)}</p>
            </div>
          </div>
        </motion.div>

        {/* Sync Success Banner */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 bg-emerald-600 text-white rounded-3xl shadow-xl flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <CheckCircle2 size={20} strokeWidth={3} />
              </div>
              <p className="font-black text-xs uppercase tracking-widest">Personnel Synchronized</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSave} className="space-y-10">
          <Section title="Identity Details" subtitle="Core Personnel Parameters" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
              <Field label="Full Name" icon={User} name="userName" value={form.userName} onChange={handleChange} placeholder="As per documents" />
              <Field label="Email" icon={Mail} name="email" value={form.email} onChange={handleChange} type="email" disabled hint="Primary authenticated node" />
              <Field label="Phone Number" icon={Smartphone} name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="Contact number" hint="Changing this will require OTP verification on your next login" />
              <div className="flex flex-col justify-center">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                  <ShieldPlus size={18} className="text-[#BA943A]" strokeWidth={3} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Identity verified against high-grade data nodes.</p>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Residency & Distribution" subtitle="Authorized Distribution Hub" icon={MapPin}>
            <Field label="Delivery Address Line" icon={MapPin} name="address" value={form.address} onChange={handleChange} placeholder="Full street coordinates" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
              <Field label="City" icon={Building2} name="city" value={form.city} onChange={handleChange} placeholder="City name" />
              <Field label="State" icon={Globe} name="state" value={form.state} onChange={handleChange} placeholder="State name" />
              <Field label="Pin Code" icon={Hash} name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pin code" type="number" />
            </div>
          </Section>

          <Section title="Withdrawal Method" subtitle="Liquidity Extraction Configuration" icon={Lock}>
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 mb-10 max-w-sm mx-auto shadow-inner">
              {["UPI", "BANK"].map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPaymentTab(id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all
                    ${paymentTab === id ? "bg-slate-900 text-[#BA943A] shadow-lg" : "text-slate-400 hover:text-slate-900"}`}
                >
                  {id === "UPI" ? <Smartphone size={14} /> : <Building2 size={14} />} {id === "UPI" ? "UPI Node" : "Bank Wire"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {paymentTab === "UPI" ? (
                <motion.div key="upi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <Field label="VPA Node ID" icon={Smartphone} name="upiId" value={form.upiId} onChange={handleChange} placeholder="id@sovereign" hint="Instant settlement active" />
                </motion.div>
              ) : (
                <motion.div key="bank" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                    <Field label="Account Holder Name" icon={User} name="accountName" value={form.accountName} onChange={handleChange} placeholder="Account name" />
                    <Field label="Bank Name" icon={Building2} name="bankName" value={form.bankName} onChange={handleChange} placeholder="Bank Name" />
                    <Field label="Account Number" icon={Lock} name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="Account Number" type="password" />
                    <Field label="IFSC Code" icon={ShieldCheck} name="ifscCode" value={form.ifscCode} onChange={handleChange} placeholder="IFSC Code" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Section>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-[#BA943A] py-6 rounded-[2rem] font-black text-lg shadow-xl hover:bg-black transition-all flex items-center justify-center gap-4 disabled:opacity-50 tracking-widest uppercase"
          >
            {loading ? <RefreshCcw className="animate-spin" size={24} /> : <><Save size={20} /> Update</>}
          </motion.button>
        </form>

        {/* Node Dissolution (Action Center) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 bg-rose-50/50 rounded-[3rem] border border-rose-100 p-10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm"
        >
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <AlertTriangle className="text-rose-500" size={20} strokeWidth={3} />
              <span className="text-rose-500 font-black text-[10px] uppercase tracking-widest">Critical Protocol</span>
            </div>
            <h3 className="font-serif text-3xl font-black text-slate-900 tracking-tight leading-none">Deactivate Account</h3>
            <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-xl italic">
              Permanently deactivate your account access and liquidate all holdings. This action is non-reversible.
            </p>
          </div>

          <button className="px-8 py-4 rounded-2xl border-2 border-rose-500 text-rose-500 font-black text-[11px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all active:scale-95 whitespace-nowrap">
            Deactivate Account
          </button>
        </motion.div>
      </div>
    </UserLayout>
  );
}