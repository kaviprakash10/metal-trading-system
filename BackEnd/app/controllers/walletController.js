import User from "../models/UserModel.js";
const Wallet = {};
// Add Money
Wallet.addMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const userId = req.user.userId || req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.walletBalance += Number(amount);

    await user.save();

    res.json({
      message: "Money added successfully",
      balance: user.walletBalance,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Wallet
Wallet.getWallet = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    console.log("Searching user:", userId);
    const user = await User.findById(userId).select(
      "walletBalance goldBalance silverBalance",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default Wallet;
