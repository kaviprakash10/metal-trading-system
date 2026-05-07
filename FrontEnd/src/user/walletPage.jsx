import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWallet } from "../slice/Walletslice";
import { fetchTransactions } from "../slice/Transactionslice";
import UserLayout from "./userLayout";
import axios from "../config/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Wallet,
  Plus,
  Zap,
  CreditCard,
  History,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  RefreshCcw,
  ShieldPlus,
  ArrowRight,
  CheckCircle2,
  Lock,
  ArrowRightCircle,
  Clock,
  Activity
} from "lucide-react";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const QUICK_AMOUNTS = [100, 500, 1000, 2000, 5000, 10000];

export default function WalletPage() {
  const dispatch = useDispatch();
  const { walletBalance } = useSelector((s) => s.wallet);
  const { transactions } = useSelector((s) => s.transaction);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const addMoneyTx = transactions
    .filter((tx) => tx.type === "WALLET_ADD")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleRazorpayPayment = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt < 10) { alert("Minimum amount is ₹10"); return; }
    setIsProcessing(true);
    try {
      const orderRes = await axios.post("/wallet/create-order",
        { amount: amt },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const { orderId, key } = orderRes.data;
      const options = {
        key, amount: amt * 100, currency: "INR",
        name: "Luna Gold", description: `Add ₹${amt} to Wallet`, order_id: orderId,
        handler: async (response) => {
          await axios.post("/wallet/verify-payment",
            { ...response, amount: amt },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          dispatch(fetchWallet());
          dispatch(fetchTransactions());
          setAmount("");
        },
        prefill: { name: localStorage.getItem("name"), email: localStorage.getItem("email") },
        theme: { color: "#c9a84c" },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const canPay = !isProcessing && amount && parseFloat(amount) >= 10;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <UserLayout active="/user/wallet">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header Section (Staff-Matched) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight leading-none mb-3">
              Wallet Hub<span className="text-amber-500">.</span>
            </h1>
            <p className="text-slate-500 font-medium flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-[#BA943A]" />
              Liquidity Node Active
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-2" />
              <Activity size={16} className="text-emerald-500" />
              Sync Real-time
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Session Epoch</p>
              <p className="text-sm font-black text-slate-900">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long" })}</p>
            </div>
          </motion.div>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-12">

          {/* Liquidity Matrix (Staff-Matched Board) */}
          <motion.div variants={item} className="relative bg-slate-900 text-white rounded-[2.5rem] p-10 overflow-hidden shadow-2xl group border border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#BA943A]/20 border border-[#BA943A]/20 flex items-center justify-center text-[#BA943A]">
                    <Wallet size={20} />
                  </div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Available Capital</p>
                </div>
                <h3 className="font-serif text-6xl font-black text-[#D8B452] tracking-tighter mb-4 leading-none">
                  ₹{fmt(walletBalance)}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-emerald-400 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 size={12} /> Sync Online
                  </div>
                  <span className="text-slate-600 font-black text-[9px] uppercase tracking-widest">Node ID: LN-4920</span>
                </div>
              </div>
              <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
                <TrendingUp size={32} className="text-[#BA943A]" />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Capital Injection Terminal */}
            <motion.div variants={item} className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm flex flex-col h-full group">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-12 h-12 rounded-[1.25rem] bg-slate-900 flex items-center justify-center text-[#BA943A] shadow-lg group-hover:scale-110 transition-transform">
                  <Plus size={24} strokeWidth={3} />
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Liquidity Feed</h2>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Add New Personnel Capital</p>
                </div>
              </div>

              <div className="relative mb-8">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#BA943A] font-serif text-4xl font-black">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-16 pr-8 py-6 rounded-[1.5rem] border-2 border-slate-50 text-slate-900 text-4xl font-serif font-black bg-slate-50 outline-none focus:bg-white focus:border-[#BA943A]/40 transition-all shadow-inner placeholder:opacity-20"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-10">
                {QUICK_AMOUNTS.map((a) => (
                  <button key={a} onClick={() => setAmount(a)}
                    className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all
                      ${String(amount) === String(a)
                        ? "bg-slate-900 text-[#BA943A] border-slate-900 shadow-xl"
                        : "bg-white text-slate-400 border-slate-100 hover:border-[#BA943A] hover:text-[#BA943A]"}`}>
                    ₹{a.toLocaleString()}
                  </button>
                ))}
              </div>

              <button
                onClick={handleRazorpayPayment}
                disabled={!canPay}
                className={`w-full py-6 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl active:scale-95
                  ${canPay
                    ? "bg-slate-900 text-[#BA943A] hover:bg-black"
                    : "bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100"}`}
              >
                {isProcessing ? (
                  <RefreshCcw className="animate-spin" size={24} />
                ) : (
                  <><Zap size={18} fill="currentColor" /> Initiate Deposit Node</>
                )}
              </button>
            </motion.div>

            {/* Insight Matrix (Staff Style) */}
            <div className="space-y-8 flex flex-col h-full">
              <motion.div variants={item} className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden group flex-1">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-8 shadow-inner">
                  <CreditCard size={24} />
                </div>
                <h4 className="font-serif text-3xl font-black mb-3 tracking-tight">Withdrawal Gate</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed italic max-w-xs">Liquidate physical assets and withdraw capital directly to your verified institution node.</p>
                <button className="mt-10 flex items-center gap-3 text-[#BA943A] font-black text-[10px] uppercase tracking-widest hover:gap-5 transition-all">
                  Configure Node <ArrowRight size={14} />
                </button>
              </motion.div>

              <motion.div variants={item} className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm flex-1 group">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100 shadow-inner">
                    <ShieldPlus size={20} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="font-serif text-2xl font-black text-slate-900 tracking-tight">Security Audit</h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Operations Audited</p>
                  </div>
                </div>
                <p className="text-slate-500 text-[11px] font-medium leading-relaxed italic">All capital injections are audited through our primary settlement gateway. Deployment typically occurs within 1-3 epoch cycles.</p>
              </motion.div>
            </div>
          </div>

          {/* Activity Ledger (Staff Table) */}
          <motion.div variants={item} className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-xl shadow-black/[0.01]">
            <div className="px-10 py-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h2 className="font-serif text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Injection Ledger</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified capital records</p>
              </div>
              <Link to="/user/transactions" className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 hover:bg-slate-900 hover:text-[#BA943A] transition-all">
                <History size={24} />
              </Link>
            </div>

            <div className="divide-y divide-slate-50">
              {addMoneyTx.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                  <History size={40} className="mb-4 text-slate-300" strokeWidth={1} />
                  <p className="font-black text-[9px] uppercase tracking-widest">Void Ledger Records</p>
                </div>
              ) : (
                addMoneyTx.map((tx, i) => (
                  <div key={tx._id} className="flex items-center justify-between px-10 py-8 hover:bg-slate-50/50 transition-all group cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#BA943A] shadow-inner group-hover:scale-110 transition-transform">
                        <Plus size={20} strokeWidth={3} />
                      </div>
                      <div>
                        <div className="font-black text-slate-900 uppercase tracking-widest text-xs">Capital Injection</div>
                        <div className="text-[9px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">
                          {fmtDate(tx.createdAt)} &bull; Node {tx._id.slice(-6)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-serif text-2xl font-black text-emerald-600 tracking-tighter leading-none">+₹{fmt(tx.amount)}</p>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest mt-1 border border-emerald-100">
                          <CheckCircle2 size={10} /> Confirmed
                        </div>
                      </div>
                      <ChevronRight className="text-slate-200 group-hover:text-[#BA943A] transition-colors" size={20} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </UserLayout>
  );
}