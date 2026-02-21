import mongoose from "mongoose";
const goldPriceSchema = new mongoose.Schema(
  {
    pricePerGram: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("GoldPrice", goldPriceSchema);
