import User from "../models/UserModel.js";
import GoldPrice from "../models/GoldPriceModel.js";
import SilverPrice from "../models/SilverPriceModel.js";
import Transaction from "../models/Transaction.js";

const PortfolioController = {};

PortfolioController.getPortfolio = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user balances
    const user = await User.findById(userId).select(
      "goldBalance silverBalance walletBalance"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    // Get latest prices
    const goldPrice = await GoldPrice.findOne().sort({ createdAt: -1 });
    const silverPrice = await SilverPrice.findOne().sort({ createdAt: -1 });

    const goldPricePerGram = goldPrice?.pricePerGram || 0;
    const silverPricePerGram = silverPrice?.pricePerGram || 0;

    // Current value of holdings
    const goldCurrentValue = parseFloat(
      (user.goldBalance * goldPricePerGram).toFixed(2)
    );
    const silverCurrentValue = parseFloat(
      (user.silverBalance * silverPricePerGram).toFixed(2)
    );

    // Calculate total invested amount from transactions
    const goldBuys = await Transaction.find({
      user: userId,
      type: "BUY_GOLD",
      status: "SUCCESS",
    });
    const silverBuys = await Transaction.find({
      user: userId,
      type: "BUY_SILVER",
      status: "SUCCESS",
    });
    const goldSells = await Transaction.find({
      user: userId,
      type: "SELL_GOLD",
      status: "SUCCESS",
    });
    const silverSells = await Transaction.find({
      user: userId,
      type: "SELL_SILVER",
      status: "SUCCESS",
    });

    const totalGoldInvested = goldBuys.reduce((sum, t) => sum + t.amount, 0);
    const totalGoldReturned = goldSells.reduce((sum, t) => sum + t.amount, 0);
    const netGoldInvested = parseFloat(
      (totalGoldInvested - totalGoldReturned).toFixed(2)
    );

    const totalSilverInvested = silverBuys.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const totalSilverReturned = silverSells.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const netSilverInvested = parseFloat(
      (totalSilverInvested - totalSilverReturned).toFixed(2)
    );

    // P&L
    const goldPnL = parseFloat((goldCurrentValue - netGoldInvested).toFixed(2));
    const silverPnL = parseFloat(
      (silverCurrentValue - netSilverInvested).toFixed(2)
    );

    // Returns %
    const goldReturnsPercent =
      netGoldInvested > 0
        ? parseFloat(((goldPnL / netGoldInvested) * 100).toFixed(2))
        : 0;
    const silverReturnsPercent =
      netSilverInvested > 0
        ? parseFloat(((silverPnL / netSilverInvested) * 100).toFixed(2))
        : 0;

    const totalInvested = parseFloat(
      (netGoldInvested + netSilverInvested).toFixed(2)
    );
    const totalCurrentValue = parseFloat(
      (goldCurrentValue + silverCurrentValue).toFixed(2)
    );
    const totalPnL = parseFloat((totalCurrentValue - totalInvested).toFixed(2));
    const totalReturnsPercent =
      totalInvested > 0
        ? parseFloat(((totalPnL / totalInvested) * 100).toFixed(2))
        : 0;

    res.status(200).json({
      portfolio: {
        gold: {
          grams: user.goldBalance,
          pricePerGram: goldPricePerGram,
          currentValue: goldCurrentValue,
          invested: netGoldInvested,
          pnl: goldPnL,
          returnsPercent: goldReturnsPercent,
        },
        silver: {
          grams: user.silverBalance,
          pricePerGram: silverPricePerGram,
          currentValue: silverCurrentValue,
          invested: netSilverInvested,
          pnl: silverPnL,
          returnsPercent: silverReturnsPercent,
        },
        summary: {
          totalInvested,
          totalCurrentValue,
          totalPnL,
          totalReturnsPercent,
          walletBalance: user.walletBalance,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
};

export default PortfolioController;