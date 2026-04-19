import Razorpay from "razorpay";
import crypto from "crypto";
import Transaction from "../models/Transaction.js";
import User from "../models/UserModel.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const RazorpayController = {};

// ── Create Order ──
RazorpayController.createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees

    if (!amount || amount < 10) {
      return res.status(400).json({ message: "Minimum amount is ₹10" });
    }

    const options = {
      amount: amount * 100, // Razorpay expects paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// ── Verify Payment & Add Money ──
RazorpayController.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Payment successful → Add money to wallet
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.walletBalance += Number(amount);
    await user.save();

    // Record transaction
    await Transaction.create({
      user: user._id,
      type: "WALLET_ADD",
      asset: "WALLET",
      amount: Number(amount),
      status: "SUCCESS",
    });

    res.status(200).json({
      success: true,
      message: `₹${amount} added to wallet successfully`,
      newBalance: user.walletBalance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

export default RazorpayController;
