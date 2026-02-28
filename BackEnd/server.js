import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import cors from "cors";
import cron from "node-cron";
import { fileURLToPath } from "url";
// Admin access
import admin from "./app/middlewares/authAdmin.js";
import AdminController from "./app/controllers/AdminController.js";
import configureDB from "./config/db.js";
import { fetchPrices } from "./app/utils/priceFetcher.js";

// user controler
import userCltr from "./app/controllers/UserCltr.js";

// public route
import PublicPrice from "./app/utils/Pricecontroller .js";
// wallet controler
import Wallet from "./app/controllers/walletController.js";
// Assest controler
import asset from "./app/controllers/assetController.js";
import auth from "./app/middlewares/authUser.js";

// TransactionHistory
import TransactionHistory from "./app/controllers/transactionController.js";
import GoldPrice from "./app/models/GoldPriceModel.js";
import SilverPrice from "./app/models/SilverPriceModel.js";

// SIP controlers
import SipController from "./app/controllers/Sipcontroller .js";
import Sip from "./app/models/Sipmodel.js";

// PortfolioController
import Portfolio from "./app/controllers/PortfolioController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect DB first, then fetch live prices on startup
configureDB().then(async () => {
  console.log("🚀 Fetching prices on startup...");
  await fetchPrices(); // live API → fallback to .env if it fails
});

// Access log
app.use(
  morgan("combined", {
    stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
      flags: "a",
    }),
  }),
);

// ── User Routes
app.post("/api/user/register", userCltr.register);
app.post("/api/user/login", userCltr.login);
app.get("/api/user/profile", auth, userCltr.getProfile);

// To buy and sell the assest
app.post("/api/gold/buy", auth, asset.buyGold);
app.post("/api/silver/buy", auth, asset.buySilver);
app.post("/api/gold/sell", auth, asset.sellGold);
app.post("/api/silver/sell", auth, asset.sellSilver);

// Portfolio API
app.get("/api/Portfolio", auth, Portfolio.getPortfolio);

// To check handle to money and transaction
app.get("/api/transaction/history", auth, TransactionHistory.getMyTransactions);
app.post("/api/wallet/addAmount", auth, Wallet.addMoney);
app.get("/api/wallet/checkAmount", auth, Wallet.getWallet);

// ── Admin Routes (auth + adminOnly middleware on all) ──
app.get("/api/admin/stats", auth, admin, AdminController.getStats);
app.get("/api/admin/users", auth, admin, AdminController.getAllUsers);
app.patch(
  "/api/admin/users/:userId/kyc",
  auth,
  admin,
  AdminController.updateKycStatus,
);
app.patch(
  "/api/admin/users/:userId/role",
  auth,
  admin,
  AdminController.updateUserRole,
);
app.get(
  "/api/admin/transactions",
  auth,
  admin,
  AdminController.getAllTransactions,
);
app.post("/api/admin/prices/gold", auth, admin, AdminController.setGoldPrice);
app.post(
  "/api/admin/prices/silver",
  auth,
  admin,
  AdminController.setSilverPrice,
);
// ── SIP Routes ──
app.post("/api/sip/create", auth, SipController.createSip);
app.get("/api/sip/my", auth, SipController.getMySips);
app.patch("/api/sip/:sipId/pause", auth, SipController.pauseSip);
app.patch("/api/sip/:sipId/resume", auth, SipController.resumeSip);
app.delete("/api/sip/:sipId", auth, SipController.deleteSip);

// Public Route to see the price history
app.get("/api/prices/current", PublicPrice.getCurrentPrices);
app.get("/api/prices/history", PublicPrice.getPriceHistory);
app.get("/api/prices/summary", PublicPrice.getPriceSummary);

// To fetch the price
app.get("/api/prices", async (req, res) => {
  const gold = await GoldPrice.findOne().sort({ createdAt: -1 });
  const silver = await SilverPrice.findOne().sort({ createdAt: -1 });
  res.json({
    gold: gold?.pricePerGram,
    silver: silver?.pricePerGram,
  });
});
// ── Cron: refresh prices every 2 hours ────────────────────────────────
cron.schedule("0 */2 * * *", () => {
  console.log("⏰ Cron: refreshing prices...");
  fetchPrices();
});
// ── SIP Cron: runs every day at midnight ──
cron.schedule("0 0 * * *", () => {
  console.log("⏰ Running SIP cron...");
  executeSips();
});

app.listen(port, () => {
  console.log(`Your GoldPlatform is running on port ${port}`);
});
