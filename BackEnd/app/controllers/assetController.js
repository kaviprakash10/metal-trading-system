import User from "../models/UserModel.js";
import GoldPrice from "../models/GoldPriceModel.js";
import SilverPrice from "../models/SilverPriceModel.js";
import Transaction from "../models/Transaction.js";

const assetController = {};

const GST_RATE = 0.03; // 3% GST on purchases only

/* ── helper: get latest price from DB ── */
const getLatestPrice = async (Model) => {
  const dbPrice = await Model.findOne().sort({ createdAt: -1 });
  if (!dbPrice) return null;
  return Number(dbPrice.pricePerGram);
};

/* ── helper: validate client price matches server ── */
const isPriceValid = (clientPrice, serverPrice) =>
  Number(clientPrice) === serverPrice;

/* ================= BUY GOLD ================= */

assetController.buyGold = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { grams, amount, pricePerGram } = req.body;

    // Must send either grams OR amount (not both, not neither)
    const isByAmount = !!amount && !grams;
    const isByGrams = !!grams && !amount;

    if (!isByAmount && !isByGrams)
      return res
        .status(400)
        .json({ message: "Send either 'amount' (₹) or 'grams'" });

    if (!pricePerGram || pricePerGram <= 0)
      return res.status(400).json({ message: "Invalid price" });

    // Validate price against DB
    const serverPrice = await getLatestPrice(GoldPrice);
    if (!serverPrice)
      return res.status(404).json({ message: "Gold price not available" });

    if (!isPriceValid(pricePerGram, serverPrice))
      return res
        .status(400)
        .json({ message: "Price changed. Please refresh." });

    // Calculate grams and base amount depending on mode
    let finalGrams, baseAmount;

    if (isByAmount) {
      // ── BY AMOUNT MODE: user sends ₹3000 ──
      baseAmount = parseFloat(parseFloat(amount).toFixed(2));
      finalGrams = parseFloat((baseAmount / serverPrice).toFixed(6));
    } else {
      // ── BY GRAMS MODE: user sends 1.5g ──
      finalGrams = parseFloat(parseFloat(grams).toFixed(6));
      baseAmount = parseFloat((finalGrams * serverPrice).toFixed(2));
    }

    if (finalGrams <= 0 || baseAmount <= 0)
      return res.status(400).json({ message: "Invalid quantity" });

    // GST on top of base amount
    const gstAmount = parseFloat((baseAmount * GST_RATE).toFixed(2));
    const totalCost = parseFloat((baseAmount + gstAmount).toFixed(2));

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.walletBalance < totalCost)
      return res.status(400).json({ message: "Insufficient balance" });

    // Update balances
    user.walletBalance -= totalCost;
    user.goldBalance += finalGrams;
    await user.save();

    // Save transaction with GST fields
    await Transaction.create({
      user: user._id,
      type: "BUY_GOLD",
      asset: "GOLD",
      grams: finalGrams,
      amount: baseAmount,
      gstAmount,
      totalAmount: totalCost,
      pricePerGram: serverPrice,
      status: "SUCCESS",
    });

    res.status(200).json({
      message: "Gold purchased successfully",
      grams: finalGrams,
      baseAmount,
      gstAmount,
      totalAmount: totalCost,
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
    const { grams, amount, pricePerGram } = req.body;

    const isByAmount = !!amount && !grams;
    const isByGrams = !!grams && !amount;

    if (!isByAmount && !isByGrams)
      return res
        .status(400)
        .json({ message: "Send either 'amount' (₹) or 'grams'" });

    if (!pricePerGram || pricePerGram <= 0)
      return res.status(400).json({ message: "Invalid price" });

    const serverPrice = await getLatestPrice(SilverPrice);
    if (!serverPrice)
      return res.status(404).json({ message: "Silver price not available" });

    if (!isPriceValid(pricePerGram, serverPrice))
      return res
        .status(400)
        .json({ message: "Price changed. Please refresh." });

    let finalGrams, baseAmount;

    if (isByAmount) {
      baseAmount = parseFloat(parseFloat(amount).toFixed(2));
      finalGrams = parseFloat((baseAmount / serverPrice).toFixed(6));
    } else {
      finalGrams = parseFloat(parseFloat(grams).toFixed(6));
      baseAmount = parseFloat((finalGrams * serverPrice).toFixed(2));
    }

    if (finalGrams <= 0 || baseAmount <= 0)
      return res.status(400).json({ message: "Invalid quantity" });

    const gstAmount = parseFloat((baseAmount * GST_RATE).toFixed(2));
    const totalCost = parseFloat((baseAmount + gstAmount).toFixed(2));

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.walletBalance < totalCost)
      return res.status(400).json({ message: "Insufficient balance" });

    user.walletBalance -= totalCost;
    user.silverBalance += finalGrams;
    await user.save();

    await Transaction.create({
      user: user._id,
      type: "BUY_SILVER",
      asset: "SILVER",
      grams: finalGrams,
      amount: baseAmount,
      gstAmount,
      totalAmount: totalCost,
      pricePerGram: serverPrice,
      status: "SUCCESS",
    });

    res.json({
      message: "Silver purchased successfully",
      grams: finalGrams,
      baseAmount,
      gstAmount,
      totalAmount: totalCost,
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
// No GST on selling — user receives full market value

assetController.sellGold = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { grams, pricePerGram } = req.body;

    if (!grams || grams <= 0)
      return res.status(400).json({ message: "Invalid grams" });

    if (!pricePerGram || pricePerGram <= 0)
      return res.status(400).json({ message: "Invalid price" });

    const serverPrice = await getLatestPrice(GoldPrice);
    if (!serverPrice)
      return res.status(404).json({ message: "Gold price not available" });

    if (!isPriceValid(pricePerGram, serverPrice))
      return res
        .status(400)
        .json({ message: "Price changed. Please refresh." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.goldBalance < grams)
      return res.status(400).json({ message: "Not enough gold" });

    const totalAmount = parseFloat((grams * serverPrice).toFixed(2));

    user.goldBalance -= grams;
    user.walletBalance += totalAmount;
    await user.save();

    await Transaction.create({
      user: user._id,
      type: "SELL_GOLD",
      asset: "GOLD",
      grams,
      amount: totalAmount,
      gstAmount: 0,
      totalAmount,
      pricePerGram: serverPrice,
      status: "SUCCESS",
    });

    res.json({
      message: "Gold sold successfully",
      grams,
      totalAmount,
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

    const serverPrice = await getLatestPrice(SilverPrice);
    if (!serverPrice)
      return res.status(404).json({ message: "Silver price not available" });

    if (!isPriceValid(pricePerGram, serverPrice))
      return res
        .status(400)
        .json({ message: "Price changed. Please refresh." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.silverBalance < grams)
      return res.status(400).json({ message: "Not enough silver" });

    const totalAmount = parseFloat((grams * serverPrice).toFixed(2));

    user.silverBalance -= grams;
    user.walletBalance += totalAmount;
    await user.save();

    await Transaction.create({
      user: user._id,
      type: "SELL_SILVER",
      asset: "SILVER",
      grams,
      amount: totalAmount,
      gstAmount: 0,
      totalAmount,
      pricePerGram: serverPrice,
      status: "SUCCESS",
    });

    res.json({
      message: "Silver sold successfully",
      grams,
      totalAmount,
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
