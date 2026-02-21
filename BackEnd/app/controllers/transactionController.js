import Transaction from "../models/Transaction.js";
const TransactionController = {};
TransactionController.getMyTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const transactions = await Transaction.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      total: transactions.length,
      data: transactions,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to fetch transactions",
    });
  }
};
export default TransactionController;
