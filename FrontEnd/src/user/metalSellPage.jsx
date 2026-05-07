import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  sellGold,
  sellSilver,
  clearAssetMessages,
} from "../slice/Assetslice";
import { fetchCurrentPrices } from "../slice/Priceslice";
import { fetchWallet } from "../slice/Walletslice";
import { fetchPortfolio } from "../slice/Portfolioslice";
import UserLayout from "./userLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingDown, 
  Wallet, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ShieldCheck,
  RefreshCcw,
  Minus,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  LayoutGrid
} from "lucide-react";

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

  const canSubmit = confirmed && !insufficient && grams && parseFloat(grams) > 0;

  return (
    <UserLayout active={isGold ? "/user/sell/gold" : "/user/sell/silver"}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className={isGold ? "text-[#c9a84c]" : "text-[#94a3b8]"} size={20} />
              <span className={`${isGold ? "text-[#c9a84c]" : "text-[#94a3b8]"} font-bold text-xs uppercase tracking-[0.2em]`}>Asset Liquidation</span>
            </div>
            <h1 className="font-serif text-5xl font-bold text-[#1a1200] tracking-tight">Sell {isGold ? "Gold" : "Silver"}</h1>
            <p className="text-[#88857F] text-lg font-medium opacity-80 mt-2">Liquidate your digital holdings instantly into your wallet.</p>
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
                <div className="flex-1 py-4 flex items-center justify-center gap-2 text-[#1a1200] font-bold text-xs uppercase tracking-widest">
                  <LayoutGrid size={14} /> Sell Quantity (Grams)
                </div>
              </div>

              <div className="p-8 lg:p-10 space-y-8">
                <div className="relative">
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 font-serif text-5xl font-bold opacity-20 ${isGold ? "text-[#c9a84c]" : "text-[#94a3b8]"}`}>
                    g
                  </div>
                  <input
                    type="number"
                    value={grams}
                    onChange={(e) => {
                      setGrams(e.target.value);
                      setConfirmed(false);
                    }}
                    placeholder="0.0000"
                    className="w-full bg-transparent border-none py-10 pl-12 pr-4 font-serif text-6xl font-bold text-[#14120D] outline-none placeholder:opacity-10"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => {
                      setGrams(String(maxGrams));
                      setConfirmed(false);
                    }}
                    className={`px-6 py-3 rounded-2xl text-xs font-bold border transition-all duration-300
                      ${Number(grams) === maxGrams && maxGrams > 0
                        ? "bg-[#1a1200] text-white border-[#1a1200] shadow-lg" 
                        : "bg-white text-[#BA943A] border-[#BA943A]/20 hover:bg-yellow-50"}`}
                  >
                    Sell Maximum ({fmt(maxGrams)}g)
                  </button>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[#A3A09A] uppercase tracking-widest">Total Available</p>
                    <p className="font-serif text-xl font-bold text-[#14120D]">{fmt(maxGrams)} g</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                  <ShieldCheck className="text-blue-500 shrink-0" size={24} />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Secure Liquidation</p>
                    <p className="text-sm font-medium text-[#88857F] leading-relaxed">
                      Funds will be instantly credited to your wallet balance. You can withdraw these funds to your bank account anytime.
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
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl" />
                <div className="relative z-10">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Sell Valuation Rate</p>
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className={`font-serif text-5xl font-bold ${isGold ? "text-[#c9a84c]" : "text-[#94a3b8]"}`}>₹{fmtCur(pricePerGram)}</span>
                    <span className="text-xl text-white/30 font-medium">/gram</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-t border-white/5">
                    <span className="text-white/40 text-xs font-medium">Available to Sell</span>
                    <span className="text-white font-bold">{fmt(maxGrams)} g</span>
                  </div>
                </div>
              </div>

              {/* Order Summary Card */}
              <AnimatePresence>
                {grams && parseFloat(grams) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[2.5rem] border border-[#ede8d8] shadow-sm p-8"
                  >
                    <h3 className="font-serif text-xl font-bold text-[#1a1200] mb-6">Valuation Summary</h3>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#A3A09A] font-medium">Sell Quantity</span>
                        <span className="text-[#1a1200] font-bold">{grams} g</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#A3A09A] font-medium">Market Rate</span>
                        <span className="text-[#1a1200] font-bold">₹{fmtCur(pricePerGram)}/g</span>
                      </div>
                      <div className="pt-4 border-t border-[#F7F5F0] flex justify-between items-end">
                        <span className="text-[#1a1200] font-bold text-base">You Receive</span>
                        <span className="font-serif text-3xl font-bold text-green-600">₹{fmtCur(totalEarnings)}</span>
                      </div>
                    </div>

                    {insufficient ? (
                      <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3 text-[11px] font-bold animate-shake">
                        <AlertCircle size={16} />
                        You only have {fmt(maxGrams)}g available to sell.
                      </div>
                    ) : (
                      <div className="mb-6 flex items-start gap-3 group cursor-pointer" onClick={() => setConfirmed(!confirmed)}>
                        <div className={`mt-0.5 w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center shrink-0
                          ${confirmed ? "bg-green-600 border-green-600" : "border-[#ede8d8]"}`}>
                          {confirmed && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                        <p className="text-xs text-[#88857F] font-medium leading-relaxed group-hover:text-[#1a1200]">
                          I confirm selling {grams}g of {isGold ? "24K Gold" : "999 Silver"} at the current market rate for instant wallet credit.
                        </p>
                      </div>
                    )}

                    {successMessage && (
                      <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 flex items-center gap-3 text-[11px] font-bold">
                        <CheckCircle2 size={16} />
                        {successMessage}
                      </div>
                    )}
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-3 text-[11px] font-bold">
                        <AlertCircle size={16} />
                        {error}
                      </div>
                    )}

                    <button
                      onClick={handleSell}
                      disabled={!canSubmit || loading}
                      className={`w-full py-5 rounded-[2rem] font-bold text-lg shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98]
                        ${canSubmit 
                          ? "bg-green-600 text-white shadow-green-500/20" 
                          : "bg-gray-100 text-[#bbb] shadow-none cursor-not-allowed"}`}
                    >
                      {loading ? <RefreshCcw size={22} className="animate-spin" /> : <>Liquidate Assets <ChevronRight size={20} /></>}
                    </button>

                    <p className="mt-4 text-center text-[10px] text-[#A3A09A] font-bold uppercase tracking-widest">
                      Live Valuation valid for 30s
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Back Link */}
              <div className="flex flex-col gap-4">
                <Link to="/user/dashboard" className="flex items-center justify-center gap-2 text-[#A3A09A] hover:text-[#BA943A] transition-colors text-sm font-bold">
                  <ArrowLeft size={16} /> Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
