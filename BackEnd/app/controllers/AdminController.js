import User from "../models/UserModel.js";
import Transaction from "../models/Transaction.js";
import GoldPrice from "../models/GoldPriceModel.js";
import SilverPrice from "../models/SilverPriceModel.js";

const AdminController = {};

/* ================= OVERVIEW STATS ================= */

AdminController.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalTransactions = await Transaction.countDocuments();

    const totalBuyGold = await Transaction.countDocuments({ type: "BUY_GOLD" });
    const totalSellGold = await Transaction.countDocuments({
      type: "SELL_GOLD",
    });
    const totalBuySilver = await Transaction.countDocuments({
      type: "BUY_SILVER",
    });
    const totalSellSilver = await Transaction.countDocuments({
      type: "SELL_SILVER",
    });

    const recentTrades = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "userName email");

    const goldPrice = await GoldPrice.findOne().sort({ createdAt: -1 });
    const silverPrice = await SilverPrice.findOne().sort({ createdAt: -1 });

    res.status(200).json({
      stats: {
        totalUsers,
        totalTransactions,
        breakdown: {
          buyGold: totalBuyGold,
          sellGold: totalSellGold,
          buySilver: totalBuySilver,
          sellSilver: totalSellSilver,
        },
        currentPrices: {
          gold: goldPrice?.pricePerGram || 0,
          silver: silverPrice?.pricePerGram || 0,
        },
      },
      recentTrades,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

/* ================= MANAGE USERS ================= */

AdminController.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ total: users.length, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

AdminController.updateKycStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { kycStatus } = req.body;

    const validStatuses = ["PENDING", "VERIFIED", "REJECTED"];
    if (!validStatuses.includes(kycStatus)) {
      return res.status(400).json({ message: "Invalid KYC status" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { kycStatus },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "KYC status updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update KYC status" });
  }
};

AdminController.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ["user", "admin", "staff"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User role updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update role" });
  }
};

/* ================= ALL TRANSACTIONS (AUDIT TRAIL) ================= */

AdminController.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .populate("user", "userName email");

    res.status(200).json({ total: transactions.length, transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

/* ================= PRICE MANAGEMENT ================= */

AdminController.setGoldPrice = async (req, res) => {
  try {
    const { pricePerGram } = req.body;

    if (!pricePerGram || pricePerGram <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    const newPrice = await GoldPrice.create({ pricePerGram });

    res.status(200).json({
      message: "Gold price updated successfully",
      pricePerGram: newPrice.pricePerGram,
      updatedAt: newPrice.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update gold price" });
  }
};

AdminController.setSilverPrice = async (req, res) => {
  try {
    const { pricePerGram } = req.body;

    if (!pricePerGram || pricePerGram <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    const newPrice = await SilverPrice.create({ pricePerGram });

    res.status(200).json({
      message: "Silver price updated successfully",
      pricePerGram: newPrice.pricePerGram,
      updatedAt: newPrice.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update silver price" });
  }
};

export default AdminController;