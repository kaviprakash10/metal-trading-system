import GoldPrice from "../models/GoldPriceModel.js";
import SilverPrice from "../models/SilverPriceModel.js";

const PriceController = {};

/* ================= CURRENT PRICES ================= */

PriceController.getCurrentPrices = async (req, res) => {
  try {
    const goldPrice = await GoldPrice.findOne().sort({ createdAt: -1 });
    const silverPrice = await SilverPrice.findOne().sort({ createdAt: -1 });

    if (!goldPrice || !silverPrice) {
      return res.status(404).json({ message: "Prices not available yet" });
    }

    res.status(200).json({
      gold: {
        pricePerGram: goldPrice.pricePerGram,
        updatedAt: goldPrice.createdAt,
      },
      silver: {
        pricePerGram: silverPrice.pricePerGram,
        updatedAt: silverPrice.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch prices" });
  }
};

/* ================= PRICE HISTORY (TREND) ================= */

PriceController.getPriceHistory = async (req, res) => {
  try {
    // Default: last 30 records, or use ?limit=N from query
    const limit = parseInt(req.query.limit) || 30;
    const asset = req.query.asset?.toUpperCase(); // GOLD or SILVER

    if (asset && !["GOLD", "SILVER"].includes(asset)) {
      return res.status(400).json({ message: "Asset must be GOLD or SILVER" });
    }

    if (!asset || asset === "GOLD") {
      const goldHistory = await GoldPrice.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("pricePerGram createdAt");

      if (!asset) {
        // Return both
        const silverHistory = await SilverPrice.find()
          .sort({ createdAt: -1 })
          .limit(limit)
          .select("pricePerGram createdAt");

        return res.status(200).json({
          gold: goldHistory.reverse(), // oldest to newest for chart
          silver: silverHistory.reverse(),
        });
      }

      return res.status(200).json({
        gold: goldHistory.reverse(),
      });
    }

    // Silver only
    const silverHistory = await SilverPrice.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("pricePerGram createdAt");

    res.status(200).json({
      silver: silverHistory.reverse(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch price history" });
  }
};

/* ================= PRICE SUMMARY (HIGH / LOW / CHANGE) ================= */

PriceController.getPriceSummary = async (req, res) => {
  try {
    // Last 30 records for gold and silver
    const goldRecords = await GoldPrice.find()
      .sort({ createdAt: -1 })
      .limit(30);
    const silverRecords = await SilverPrice.find()
      .sort({ createdAt: -1 })
      .limit(30);

    const summarize = (records) => {
      if (!records.length) return null;

      const prices = records.map((r) => r.pricePerGram);
      const latest = prices[0];
      const oldest = prices[prices.length - 1];
      const high = Math.max(...prices);
      const low = Math.min(...prices);
      const change = parseFloat((latest - oldest).toFixed(2));
      const changePercent = parseFloat(
        (((latest - oldest) / oldest) * 100).toFixed(2)
      );

      return {
        current: latest,
        high,
        low,
        change,
        changePercent,
        trend: change >= 0 ? "UP" : "DOWN",
      };
    };

    res.status(200).json({
      gold: summarize(goldRecords),
      silver: summarize(silverRecords),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch price summary" });
  }
};

export default PriceController;