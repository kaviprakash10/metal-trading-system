import User from "../models/UserModel.js";
import GoldPrice from "../models/GoldPriceModel.js";
import SilverPrice from "../models/SilverPriceModel.js";
import Transaction from "../models/Transaction.js";

const assetController = {};

/* ================= BUY GOLD ================= */

assetController.buyGold = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { grams, pricePerGram } = req.body;

    if (!grams || grams <= 0)
      return res.status(400).json({ message: "Invalid grams" });

    if (!pricePerGram || pricePerGram <= 0)
      return res.status(400).json({ message: "Invalid price" });

    const dbPrice = await GoldPrice.findOne().sort({ createdAt: -1 });

    if (!dbPrice)
      return res.status(404).json({ message: "Gold price not available" });

    const serverPrice = Number(dbPrice.pricePerGram);

    if (Number(pricePerGram) !== serverPrice)
      return res.status(400).json({ message: "Price changed. Refresh." });

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const totalCost = grams * serverPrice;

    if (user.walletBalance < totalCost)
      return res.status(400).json({ message: "Insufficient balance" });

    user.walletBalance -= totalCost;
    user.goldBalance += grams;

    await user.save();

    // ✅ Save Transaction
    await Transaction.create({
      user: user._id,
      type: "BUY_GOLD",
      asset: "GOLD",
      grams,
      amount: totalCost,
      pricePerGram: serverPrice,
      status: "SUCCESS",
    });

    res.status(200).json({
      message: "Gold purchased successfully",
      goldBalance: user.goldBalance,
      walletBalance: user.walletBalance,
      usedPrice: serverPrice,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ================= BUY SILVER ================= */

assetController.buySilver = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { grams, pricePerGram } = req.body;

    if (!grams || grams <= 0)
      return res.status(400).json({ message: "Invalid grams" });

    if (!pricePerGram || pricePerGram <= 0)
      return res.status(400).json({ message: "Invalid price" });

    const dbPrice = await SilverPrice.findOne().sort({ createdAt: -1 });

    if (!dbPrice)
      return res.status(404).json({ message: "Silver price not available" });

    const serverPrice = Number(dbPrice.pricePerGram);

    if (Number(pricePerGram) !== serverPrice)
      return res.status(400).json({ message: "Price changed. Refresh." });

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const totalCost = grams * serverPrice;

    if (user.walletBalance < totalCost)
      return res.status(400).json({ message: "Insufficient balance" });

    user.walletBalance -= totalCost;
    user.silverBalance += grams;

    await user.save();

    // ✅ Save Transaction
    await Transaction.create({
      user: user._id,
      type: "BUY_SILVER",
      asset: "SILVER",
      grams,
      amount: totalCost,
      pricePerGram: serverPrice,
      status: "SUCCESS",
    });

    res.json({
      message: "Silver purchased successfully",
      silverBalance: user.silverBalance,
      walletBalance: user.walletBalance,
      usedPrice: serverPrice,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ================= SELL GOLD ================= */

assetController.sellGold = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { grams, pricePerGram } = req.body;

    if (!grams || grams <= 0)
      return res.status(400).json({ message: "Invalid grams" });

    if (!pricePerGram || pricePerGram <= 0)
      return res.status(400).json({ message: "Invalid price" });

    const dbPrice = await GoldPrice.findOne().sort({ createdAt: -1 });

    if (!dbPrice)
      return res.status(404).json({ message: "Gold price not available" });

    const serverPrice = Number(dbPrice.pricePerGram);

    if (Number(pricePerGram) !== serverPrice)
      return res.status(400).json({ message: "Price changed. Refresh." });

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.goldBalance < grams)
      return res.status(400).json({ message: "Not enough gold" });

    const totalAmount = grams * serverPrice;

    user.goldBalance -= grams;
    user.walletBalance += totalAmount;

    await user.save();

    // ✅ Save Transaction
    await Transaction.create({
      user: user._id,
      type: "SELL_GOLD",
      asset: "GOLD",
      grams,
      amount: totalAmount,
      pricePerGram: serverPrice,
      status: "SUCCESS",
    });

    res.json({
      message: "Gold sold successfully",
      goldBalance: user.goldBalance,
      walletBalance: user.walletBalance,
      usedPrice: serverPrice,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ================= SELL SILVER ================= */

assetController.sellSilver = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { grams, pricePerGram } = req.body;

    if (!grams || grams <= 0)
      return res.status(400).json({ message: "Invalid grams" });

    if (!pricePerGram || pricePerGram <= 0)
      return res.status(400).json({ message: "Invalid price" });

    const dbPrice = await SilverPrice.findOne().sort({ createdAt: -1 });

    if (!dbPrice)
      return res.status(404).json({ message: "Silver price not available" });

    const serverPrice = Number(dbPrice.pricePerGram);

    if (Number(pricePerGram) !== serverPrice)
      return res.status(400).json({ message: "Price changed. Refresh." });

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.silverBalance < grams)
      return res.status(400).json({ message: "Not enough silver" });

    const totalAmount = grams * serverPrice;

    user.silverBalance -= grams;
    user.walletBalance += totalAmount;

    await user.save();

    // ✅ Save Transaction
    await Transaction.create({
      user: user._id,
      type: "SELL_SILVER",
      asset: "SILVER",
      grams,
      amount: totalAmount,
      pricePerGram: serverPrice,
      status: "SUCCESS",
    });

    res.json({
      message: "Silver sold successfully",
      silverBalance: user.silverBalance,
      walletBalance: user.walletBalance,
      usedPrice: serverPrice,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

export default assetController;
