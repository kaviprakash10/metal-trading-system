import mongoose from "mongoose";
const silverPriceSchema = new mongoose.Schema(
  {
    pricePerGram: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SilverPrice", silverPriceSchema);