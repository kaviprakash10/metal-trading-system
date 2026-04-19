import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWallet } from "../slice/Walletslice";
import { fetchTransactions } from "../slice/Transactionslice";
import UserLayout from "./userLayout";
import axios from "../config/axios";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

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
    if (!amt || amt < 10) {
      alert("Minimum amount is ₹10");
      return;
    }

    setIsProcessing(true);

    try {
      // Note: axios baseURL already includes '/api'
      const orderRes = await axios.post("/wallet/create-order",
        { amount: amt },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const { orderId, key } = orderRes.data;

      const options = {
        key,
        amount: amt * 100,
        currency: "INR",
        name: "Luna Gold",
        description: `Add ₹${amt} to Wallet`,
        order_id: orderId,
        handler: async function (response) {
          await axios.post("/wallet/verify-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amt,
            },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );

          alert(`₹${amt} added successfully!`);
          dispatch(fetchWallet());
          dispatch(fetchTransactions());
          setAmount("");
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
        },
        theme: { color: "#c9a84c" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <UserLayout active="/user/wallet">
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.9rem", fontWeight: 700, color: "#1a1200" }}>
          My Wallet
        </h1>

        <div style={{ background: "linear-gradient(135deg,#0f0c00,#1a1200)", borderRadius: "20px", padding: "1.75rem", margin: "1.5rem 0", color: "#fff" }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>AVAILABLE BALANCE</div>
          <div style={{ fontSize: "2.8rem", fontWeight: 700, color: "#c9a84c" }}>₹{fmt(walletBalance)}</div>
        </div>

        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #ede8d8", padding: "1.75rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1rem" }}>Add Money</h2>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Minimum ₹10"
            style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid #ddd", fontSize: "1.1rem", marginBottom: "1rem" }}
          />

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            {QUICK_AMOUNTS.map((a) => (
              <button key={a} onClick={() => setAmount(a)} style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #ddd" }}>
                ₹{a}
              </button>
            ))}
          </div>

          <button
            onClick={handleRazorpayPayment}
            disabled={isProcessing || !amount || parseFloat(amount) < 10}
            style={{ width: "100%", padding: "1rem", background: "#22c55e", color: "white", border: "none", borderRadius: "12px", fontWeight: 700 }}
          >
            {isProcessing ? "Processing..." : `Pay ₹${amount || 0} via Razorpay`}
          </button>

          {/* <div style={{ marginTop: "1rem", padding: "1rem", background: "#fffbeb", borderRadius: "10px", fontSize: "0.82rem", color: "#92400e", border: "1px solid #fde68a" }}>
            <strong>Test Mode:</strong><br />
            Card: <strong>4000 0000 0000 0002</strong><br />
            Expiry: 12/28 | CVV: 123<br />
            OTP: Any 6 digits (e.g. 123456)
          </div> */}
        </div>

        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #ede8d8", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "1rem" }}>Recent Deposits</h2>
          {addMoneyTx.length === 0 ? (
            <p style={{ color: "#888", textAlign: "center", padding: "2rem" }}>No deposits yet</p>
          ) : (
            addMoneyTx.map((tx) => (
              <div key={tx._id} style={{ display: "flex", justifyContent: "space-between", padding: "1rem 0", borderBottom: "1px solid #f0ead8" }}>
                <div>
                  <div>Added Money</div>
                  <div style={{ fontSize: "0.8rem", color: "#888" }}>
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ color: "#16a34a", fontWeight: 700 }}>+₹{fmt(tx.amount)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </UserLayout>
  );
}