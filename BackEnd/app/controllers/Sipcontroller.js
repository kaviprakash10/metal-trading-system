import SIP from "../models/Sipmodel.js";
import User from "../models/UserModel.js";
import GoldPrice from "../models/GoldPriceModel.js";
import SilverPrice from "../models/SilverPriceModel.js";
import Transaction from "../models/Transaction.js";

const SipController = {};

/* ================= CREATE SIP ================= */

SipController.createSip = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { asset, amountPerMonth, dayOfMonth } = req.body;

    if (!["GOLD", "SILVER"].includes(asset)) {
      return res.status(400).json({ message: "Asset must be GOLD or SILVER" });
    }

    if (!amountPerMonth || amountPerMonth <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (!dayOfMonth || dayOfMonth < 1 || dayOfMonth > 28) {
      return res
        .status(400)
        .json({ message: "Day of month must be between 1 and 28" });
    }

    // Check if active SIP already exists for this asset
    const existing = await SIP.findOne({
      user: userId,
      asset,
      status: "ACTIVE",
    });

    if (existing) {
      return res.status(400).json({
        message: `An active SIP for ${asset} already exists. Pause it before creating a new one.`,
      });
    }

    const sip = await SIP.create({
      user: userId,
      asset,
      amountPerMonth,
      dayOfMonth,
    });

    res.status(201).json({ message: "SIP created successfully", sip });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create SIP" });
  }
};

/* ================= GET MY SIPs ================= */

SipController.getMySips = async (req, res) => {
  try {
    const userId = req.user.userId;
    const sips = await SIP.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ total: sips.length, sips });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch SIPs" });
  }
};

/* ================= PAUSE SIP ================= */

SipController.pauseSip = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sipId } = req.params;

    const sip = await SIP.findOne({ _id: sipId, user: userId });
    if (!sip) return res.status(404).json({ message: "SIP not found" });

    if (sip.status === "PAUSED") {
      return res.status(400).json({ message: "SIP is already paused" });
    }

    sip.status = "PAUSED";
    await sip.save();

    res.status(200).json({ message: "SIP paused successfully", sip });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to pause SIP" });
  }
};

/* ================= RESUME SIP ================= */

SipController.resumeSip = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sipId } = req.params;

    const sip = await SIP.findOne({ _id: sipId, user: userId });
    if (!sip) return res.status(404).json({ message: "SIP not found" });

    if (sip.status === "ACTIVE") {
      return res.status(400).json({ message: "SIP is already active" });
    }

    sip.status = "ACTIVE";
    await sip.save();

    res.status(200).json({ message: "SIP resumed successfully", sip });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to resume SIP" });
  }
};

/* ================= DELETE SIP ================= */

SipController.deleteSip = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sipId } = req.params;

    const sip = await SIP.findOneAndDelete({ _id: sipId, user: userId });
    if (!sip) return res.status(404).json({ message: "SIP not found" });

    res.status(200).json({ message: "SIP deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete SIP" });
  }
};

/* ================= SIP EXECUTOR (called by cron) ================= */

export const executeSips = async () => {
  try {
    const today = new Date().getDate(); // day of month (1-28)

    // Find all active SIPs due today
    const dueSips = await SIP.find({ status: "ACTIVE", dayOfMonth: today });

    if (dueSips.length === 0) {
      console.log("⏰ SIP Cron: No SIPs due today.");
      return;
    }

    console.log(`⏰ SIP Cron: Processing ${dueSips.length} SIP(s)...`);

    const goldPrice = await GoldPrice.findOne().sort({ createdAt: -1 });
    const silverPrice = await SilverPrice.findOne().sort({ createdAt: -1 });

    for (const sip of dueSips) {
      try {
        const user = await User.findById(sip.user);
        if (!user) continue;

        // Skip if already executed this month
        if (sip.lastExecutedAt) {
          const lastExec = new Date(sip.lastExecutedAt);
          const now = new Date();
          if (
            lastExec.getMonth() === now.getMonth() &&
            lastExec.getFullYear() === now.getFullYear()
          ) {
            console.log(`⏭️  SIP ${sip._id} already executed this month.`);
            continue;
          }
        }

        const pricePerGram =
          sip.asset === "GOLD"
            ? goldPrice?.pricePerGram
            : silverPrice?.pricePerGram;

        if (!pricePerGram || pricePerGram <= 0) {
          console.log(`❌ SIP ${sip._id}: No price available for ${sip.asset}`);
          continue;
        }

        const amount = sip.amountPerMonth;

        // Check wallet balance
        if (user.walletBalance < amount) {
          console.log(`❌ SIP ${sip._id}: Insufficient balance for user ${user._id}`);
          await Transaction.create({
            user: user._id,
            type: sip.asset === "GOLD" ? "BUY_GOLD" : "BUY_SILVER",
            asset: sip.asset,
            grams: 0,
            amount,
            pricePerGram,
            status: "FAILED",
          });
          continue;
        }

        const grams = parseFloat((amount / pricePerGram).toFixed(4));

        // Deduct wallet, add asset
        user.walletBalance -= amount;
        if (sip.asset === "GOLD") user.goldBalance += grams;
        else user.silverBalance += grams;

        await user.save();

        // Save transaction
        await Transaction.create({
          user: user._id,
          type: sip.asset === "GOLD" ? "BUY_GOLD" : "BUY_SILVER",
          asset: sip.asset,
          grams,
          amount,
          pricePerGram,
          status: "SUCCESS",
        });

        // Update last executed
        sip.lastExecutedAt = new Date();
        await sip.save();

        console.log(
          `✅ SIP ${sip._id}: Bought ${grams}g of ${sip.asset} for ₹${amount} for user ${user._id}`
        );
      } catch (sipErr) {
        console.error(`❌ SIP ${sip._id} failed:`, sipErr.message);
      }
    }
  } catch (err) {
    console.error("SIP Cron error:", err.message);
  }
};

export default SipController;