import axios from "axios";
import GoldPrice from "../models/GoldPriceModel.js";
import SilverPrice from "../models/SilverPriceModel.js";

/* ── Fetch live USD → INR exchange rate from frankfurter.app ─────────────── */

const getUsdToInrRate = async () => {
  const res = await axios.get(
    "https://api.frankfurter.app/latest?from=USD&to=INR",
  );
  console.log("frankfurter response:", JSON.stringify(res.data));
  const rate = Number(res.data?.rates?.INR);
  if (!Number.isFinite(rate) || rate <= 0)
    throw new Error("Invalid exchange rate received");
  return rate;
};

/* ── Main price fetch ────────────────────────────────────────────────────── */

export const fetchPrices = async () => {
  try {
    const API_KEY = process.env.GOLD_API_KEY || "goldapi-dpqtzqsml6a7f72-io";

    // 1. Fetch live USD → INR rate
    const usdToInr = await getUsdToInrRate();
    console.log(`💱 Exchange rate: 1 USD = ₹${usdToInr}`);

    // 2. Fetch gold price in USD
    const goldRes = await axios.get("https://api.gold-api.com/price/XAU");
    console.log("goldapi XAU response:", JSON.stringify(goldRes.data));
    // The API returns price per Troy Ounce. Convert to price per gram (1 Troy Ounce = 31.1034768 grams)
    const goldPerGramUSD = Number(goldRes.data?.price) / 31.1034768;

    // 3. Fetch silver price in USD
    const silverRes = await axios.get("https://api.gold-api.com/price/XAG");
    console.log("goldapi XAG response:", JSON.stringify(silverRes.data));
    // The API returns price per Troy Ounce. Convert to price per gram
    const silverPerGramUSD = Number(silverRes.data?.price) / 31.1034768;

    if (
      !Number.isFinite(goldPerGramUSD) ||
      goldPerGramUSD <= 0 ||
      !Number.isFinite(silverPerGramUSD) ||
      silverPerGramUSD <= 0
    ) {
      throw new Error("API returned zero or invalid prices");
    }

    // 4. Convert USD → INR
    const goldPerGramINR = parseFloat((goldPerGramUSD * usdToInr).toFixed(2));
    const silverPerGramINR = parseFloat(
      (silverPerGramUSD * usdToInr).toFixed(2),
    );

    // 5. Save INR prices to DB
    await GoldPrice.create({ pricePerGram: goldPerGramINR });
    await SilverPrice.create({ pricePerGram: silverPerGramINR });

    console.log(`✅ Live prices updated (converted to INR)`);
    console.log(`   Gold  : $${goldPerGramUSD}/g  → ₹${goldPerGramINR}/g`);
    console.log(`   Silver: $${silverPerGramUSD}/g → ₹${silverPerGramINR}/g`);
  } catch (err) {
    console.error("⚠️  Price fetch failed:", err.stack || err.message);
    if (err && err.response) {
      try {
        console.error("Axios response status:", err.response.status);
        console.error(
          "Axios response data:",
          JSON.stringify(err.response.data),
        );
        console.error(
          "Axios response headers:",
          JSON.stringify(err.response.headers),
        );
      } catch (e) {
        console.error("Failed to log axios response details:", e.message);
      }
    }
    console.log("🔁 Falling back to .env prices...");
    await useFallbackPrices();
  }
};

/* ── Fallback: use .env prices if API fails ──────────────────────────────── */

const useFallbackPrices = async () => {
  try {
    const goldEnvPrice = Number(process.env.GOLD_PRICE);
    const silverEnvPrice = Number(process.env.SILVER_PRICE);

    if (!goldEnvPrice || goldEnvPrice <= 0) {
      console.error("❌ GOLD_PRICE missing or invalid in .env");
      return;
    }
    if (!silverEnvPrice || silverEnvPrice <= 0) {
      console.error("❌ SILVER_PRICE missing or invalid in .env");
      return;
    }

    // Only insert if DB has no price at all
    const goldExists = await GoldPrice.findOne();
    const silverExists = await SilverPrice.findOne();

    if (!goldExists) {
      await GoldPrice.create({ pricePerGram: goldEnvPrice });
      console.log(`📦 Gold fallback price set from .env: ₹${goldEnvPrice}/g`);
    } else {
      console.log("ℹ️  Gold: existing DB price retained.");
    }

    if (!silverExists) {
      await SilverPrice.create({ pricePerGram: silverEnvPrice });
      console.log(
        `📦 Silver fallback price set from .env: ₹${silverEnvPrice}/g`,
      );
    } else {
      console.log("ℹ️  Silver: existing DB price retained.");
    }
  } catch (fallbackErr) {
    console.error("❌ Fallback price insert also failed:", fallbackErr.message);
  }
};
