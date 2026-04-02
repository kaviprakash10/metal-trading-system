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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { search, kycStatus, sort = "-createdAt" } = req.query;

    const query = {};
    if (kycStatus && kycStatus !== "All") {
      query.kycStatus = kycStatus;
    }
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Determine sort object
    let sortQuery = { createdAt: -1 };
    if (sort === "newest") sortQuery = { createdAt: -1 };
    if (sort === "oldest") sortQuery = { createdAt: 1 };
    if (sort === "wallet") sortQuery = { walletBalance: -1 };
    if (sort === "name")   sortQuery = { userName: 1 };

    const total = await User.countDocuments(query);
    const verifiedCount = await User.countDocuments({ kycStatus: "VERIFIED" });
    const pendingCount = await User.countDocuments({ kycStatus: "PENDING" });
    
    const users = await User.find(query)
      .select("-password")
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      verifiedCount,
      pendingCount,
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      limit,
    });
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

    const targetUser = await User.findById(userId);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    // Staff / others cannot change an admin's KYC status
    if (targetUser.role === "admin" && req.user.role !== "admin") {
      return res.status(403).json({ message: "You cannot modify admin details." });
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

    const targetUser = await User.findById(userId);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    // Protect existing admin accounts
    if (targetUser.role === "admin" && req.user.role !== "admin") {
      return res.status(403).json({ message: "You cannot modify admin roles." });
    }

    // Per user request: "admin only able to change their details"
    // If target is admin, requester must be that same admin
    if (targetUser.role === "admin" && req.user._id.toString() !== targetUser._id.toString()) {
       return res.status(403).json({ message: "Only the admin themselves can modify their own account." });
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { search, type, asset, userId, sort = "-createdAt" } = req.query;

    const query = {};
    if (userId) query.user = userId;
    if (type && type !== "All") query.type = type;
    if (asset && asset !== "All") query.asset = asset;
    
    if (search) {
      // Find users matching search first if search is by name/email
      const matchingUsers = await User.find({
        $or: [
          { userName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ]
      }).select("_id");
      
      const userIds = matchingUsers.map(u => u._id);
      
      query.$or = [
        { _id: search.length === 24 ? search : null }, // Match by ID if valid
        { user: { $in: userIds } },
        { type: { $regex: search, $options: "i" } }
      ].filter(condition => condition._id !== null);
    }

    const total = await Transaction.countDocuments(query);
    
    // Global stats for the current view (filtered by query)
    const statsResult = await Transaction.aggregate([
      { $match: query },
      { $group: { 
          _id: null, 
          totalVol: { $sum: { $ifNull: ["$totalAmount", "$amount"] } },
          totalGst: { $sum: { $ifNull: ["$gstAmount", 0] } }
        } 
      }
    ]);
    
    const totalVolume = statsResult[0]?.totalVol || 0;
    const totalGst = statsResult[0]?.totalGst || 0;

    const transactions = await Transaction.find(query)
      .sort(sort)
      .populate("user", "userName email")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      totalVolume,
      totalGst,
      transactions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      limit,
    });
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