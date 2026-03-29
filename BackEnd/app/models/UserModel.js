import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: 4,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    walletBalance: {
      type: Number,
      default: 0,
      min: 0, // no negative balance
    },

    goldBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    silverBalance: {
      type: Number,
      default: 0,
      min: 0,
    },

    role: {
      type: String,
      enum: ["user", "admin", "staff"],
      default: "user",
    },

    kycStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },

    // ── Personal Info ──
    phone:   { type: String, default: "" },
    address: { type: String, default: "" },
    city:    { type: String, default: "" },
    state:   { type: String, default: "" },
    pincode: { type: String, default: "" },

    // ── Payment Details ──
    upiId:         { type: String, default: "" },
    accountName:   { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    ifscCode:      { type: String, default: "" },
    bankName:      { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

const User = model("User", userSchema);

export default User;
