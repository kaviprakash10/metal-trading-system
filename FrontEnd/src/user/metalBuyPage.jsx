import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import {
  buyGold,
  buySilver,
  clearAssetMessages,
} from "../slice/Assetslice";
import { fetchCurrentPrices } from "../slice/Priceslice";
import { fetchWallet } from "../slice/Walletslice";
import { fetchPortfolio } from "../slice/Portfolioslice";
import UserLayout from "./userLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Wallet, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ShieldCheck,
  RefreshCcw,
  Plus,
  ArrowLeft,
  ChevronRight,
  LayoutGrid,
  
} from "lucide-react";

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
    mode === "amount" ? parseFloat((parsed / (pricePerGram * (1 + GST_RATE))).toFixed(6)) : parsed;

  const gstAmount = parseFloat((baseAmount * GST_RATE).toFixed(2));
  const totalCost = mode === "amount" ? parsed : parseFloat((baseAmount + gstAmount).toFixed(2));
  
  // Recalculate if mode is amount: amount includes GST
  const actualBase = mode === "amount" ? parseFloat((parsed / (1 + GST_RATE)).toFixed(2)) : baseAmount;
  const actualGst = mode === "amount" ? parseFloat((parsed - actualBase).toFixed(2)) : gstAmount;

  const insufficient = totalCost > walletBalance;

  const isGold = tab === "GOLD";
  
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
        ? { amount: parsed } 
        : { grams: parsed }),
    };

    const action = isGold ? buyGold : buySilver;
    dispatch(action(payload));
  };

  const quickOptions =
    mode === "amount"
      ? [1000, 2000, 5000, 10000, 25000, 50000]
      : isGold
        ? [0.5, 1, 2, 5, 10]
        : [5, 10, 25, 50, 100];

  const canSubmit =
    confirmed && !insufficient && inputVal && parsed > 0 && pricePerGram > 0;

  return (
    <UserLayout active={isGold ? "/user/buy/gold" : "/user/buy/silver"}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className={isGold ? "text-[#c9a84c]" : "text-[#94a3b8]"} size={20} />
              <span className={`${isGold ? "text-[#c9a84c]" : "text-[#94a3b8]"} font-bold text-xs uppercase tracking-[0.2em]`}>Market Purchase</span>
            </div>
            <h1 className="font-serif text-5xl font-bold text-[#1a1200] tracking-tight">Buy {isGold ? "Gold" : "Silver"}</h1>
            <p className="text-[#88857F] text-lg font-medium opacity-80 mt-2">Secure 24K pure assets at real-time market rates.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Controls */}
          <div className="lg:col-span-7 space-y-8">
            {/* Metal Selector */}
            <div className="bg-white p-2 rounded-3xl border border-[#ede8d8] shadow-sm flex">
              {["GOLD", "SILVER"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-3
                    ${tab === t 
                      ? (t === "GOLD" ? "bg-[#c9a84c] text-white shadow-xl shadow-yellow-500/20" : "bg-[#94a3b8] text-white shadow-xl shadow-slate-500/20") 
                      : "text-[#A3A09A] hover:text-[#1a1200]"}`}
                >
                  <span className="text-xl">{t === "GOLD" ? "🟡" : "⚪"}</span>
                  {t}
                </button>
              ))}
            </div>

            {/* Input Card */}
            <div className="bg-white rounded-[3rem] border border-[#ede8d8] shadow-sm overflow-hidden">
              <div className="p-1.5 bg-[#FDFBF7] flex border-b border-[#F7F5F0]">
                {[
                  { id: "amount", label: "By Amount (₹)", icon: Wallet },
                  { id: "grams", label: "By Quantity (g)", icon: Plus },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setMode(id)}
                    className={`flex-1 py-4 rounded-[1.25rem] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300
                      ${mode === id ? "bg-white text-[#1a1200] shadow-sm border border-[#ede8d8]" : "text-[#A3A09A] hover:text-[#1a1200]"}`}
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>

              <div className="p-8 lg:p-10 space-y-8">
                <div className="relative">
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 font-serif text-5xl font-bold opacity-20 ${isGold ? "text-[#c9a84c]" : "text-[#94a3b8]"}`}>
                    {mode === "amount" ? "₹" : "g"}
                  </div>
                  <input
                    type="number"
                    value={inputVal}
                    onChange={(e) => {
                      setInputVal(e.target.value);
                      setConfirmed(false);
                    }}
                    placeholder="0.00"
                    className="w-full bg-transparent border-none py-10 pl-12 pr-4 font-serif text-6xl font-bold text-[#14120D] outline-none placeholder:opacity-10"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {quickOptions.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInputVal(String(q));
                        setConfirmed(false);
                      }}
                      className={`px-6 py-3 rounded-2xl text-xs font-bold border transition-all duration-300
                        ${Number(inputVal) === q 
                          ? "bg-[#1a1200] text-white border-[#1a1200] shadow-lg" 
                          : "bg-white text-[#A3A09A] border-[#ede8d8] hover:border-[#BA943A] hover:text-[#BA943A]"}`}
                    >
                      {mode === "amount" ? `₹${fmt(q)}` : `${q}g`}
                    </button>
                  ))}
                </div>

                <div className="flex items-start gap-4 p-6 bg-yellow-50/50 rounded-3xl border border-yellow-100/50">
                  <ShieldCheck className="text-[#BA943A] shrink-0" size={24} />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-[#BA943A] uppercase tracking-widest">Secure Transaction</p>
                    <p className="text-sm font-medium text-[#88857F] leading-relaxed">
                      This purchase is locked at the current live rate. Your assets will be instantly credited to your secure vaulted account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Side */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              {/* Live Price Widget */}
              <div className={`rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl ${isGold ? "bg-[#100C04]" : "bg-[#1e2433]"}`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl" />
                <div className="relative z-10">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Live Market Rate</p>
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className={`font-serif text-5xl font-bold ${isGold ? "text-[#c9a84c]" : "text-[#94a3b8]"}`}>₹{fmt(pricePerGram)}</span>
                    <span className="text-xl text-white/30 font-medium">/gram</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-t border-white/5">
                    <span className="text-white/40 text-xs font-medium">Wallet Balance</span>
                    <span className="text-white font-bold">₹{fmt(walletBalance)}</span>
                  </div>
                </div>
              </div>

              {/* Order Summary Card */}
              <AnimatePresence>
                {inputVal && parsed > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[2.5rem] border border-[#ede8d8] shadow-sm p-8"
                  >
                    <h3 className="font-serif text-xl font-bold text-[#1a1200] mb-6">Order Summary</h3>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#A3A09A] font-medium">Base Price</span>
                        <span className="text-[#1a1200] font-bold">₹{fmt(actualBase)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#A3A09A] font-medium">GST (3.0%)</span>
                        <span className="text-[#1a1200] font-bold">₹{fmt(actualGst)}</span>
                      </div>
                      <div className="pt-4 border-t border-[#F7F5F0] flex justify-between items-end">
                        <span className="text-[#1a1200] font-bold text-base">Total Cost</span>
                        <span className={`font-serif text-3xl font-bold ${insufficient ? "text-red-500" : "text-[#1a1200]"}`}>₹{fmt(totalCost)}</span>
                      </div>
                    </div>

                    <div className="bg-[#FDFBF7] p-6 rounded-[2rem] border border-[#ede8d8] mb-8 text-center">
                      <p className="text-[10px] font-bold text-[#A3A09A] uppercase tracking-widest mb-1">Asset Delivery</p>
                      <p className={`font-serif text-4xl font-bold ${isGold ? "text-[#c9a84c]" : "text-[#94a3b8]"}`}>{fmtG(gramsYouGet)}g</p>
                    </div>

                    {insufficient ? (
                      <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3 text-[11px] font-bold animate-shake">
                        <AlertCircle size={16} />
                        Insufficient balance! You need ₹{fmt(totalCost - walletBalance)} more.
                      </div>
                    ) : (
                      <div className="mb-6 flex items-start gap-3 group cursor-pointer" onClick={() => setConfirmed(!confirmed)}>
                        <div className={`mt-0.5 w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center shrink-0
                          ${confirmed ? (isGold ? "bg-[#c9a84c] border-[#c9a84c]" : "bg-[#94a3b8] border-[#94a3b8]") : "border-[#ede8d8]"}`}>
                          {confirmed && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                        <p className="text-xs text-[#88857F] font-medium leading-relaxed group-hover:text-[#1a1200]">
                          I confirm purchasing {fmtG(gramsYouGet)}g of {isGold ? "24K Gold" : "999 Silver"} and agree to the transaction terms.
                        </p>
                      </div>
                    )}

                    <button
                      onClick={handleBuy}
                      disabled={!canSubmit || loading}
                      className={`w-full py-5 rounded-[2rem] font-bold text-lg shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98]
                        ${canSubmit 
                          ? (isGold ? "bg-[#c9a84c] text-white shadow-yellow-500/20" : "bg-[#94a3b8] text-white shadow-slate-500/20") 
                          : "bg-gray-100 text-[#bbb] shadow-none cursor-not-allowed"}`}
                    >
                      {loading ? <RefreshCcw size={22} className="animate-spin" /> : <>Complete Purchase <ChevronRight size={20} /></>}
                    </button>

                    <p className="mt-4 text-center text-[10px] text-[#A3A09A] font-bold uppercase tracking-widest">
                      Live Rate valid for 30s
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Back Link */}
              <Link to="/user/dashboard" className="flex items-center justify-center gap-2 text-[#A3A09A] hover:text-[#BA943A] transition-colors text-sm font-bold">
                <ArrowLeft size={16} /> Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
