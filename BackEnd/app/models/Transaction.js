import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["WALLET_ADD", "BUY_GOLD", "SELL_GOLD", "BUY_SILVER", "SELL_SILVER"],
      required: true,
    },

    asset: {
      type: String,
      enum: ["GOLD", "SILVER", "WALLET"],
      required: true,
    },

    grams: {
      type: Number,
      default: 0,
    },

    amount: {
      type: Number, 
      required: true,
    },

    pricePerGram: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", transactionSchema);
