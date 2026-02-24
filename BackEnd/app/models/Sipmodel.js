import mongoose from "mongoose";

const sipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    asset: {
      type: String,
      enum: ["GOLD", "SILVER"],
      required: true,
    },

    amountPerMonth: {
      type: Number,
      required: true,
      min: 1,
    },

    dayOfMonth: {
      type: Number,
      required: true,
      min: 1,
      max: 28, // max 28 to avoid month-end issues
    },

    status: {
      type: String,
      enum: ["ACTIVE", "PAUSED"],
      default: "ACTIVE",
    },

    lastExecutedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SIP", sipSchema);