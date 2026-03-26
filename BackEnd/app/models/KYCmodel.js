import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    // ── Auth ──
    userName: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // ── Role & KYC ──
    role:      { type: String, enum: ["user", "admin", "staff"], default: "user" },
    kycStatus: { type: String, enum: ["PENDING", "VERIFIED", "REJECTED"], default: "PENDING" },

    // ── Balances ──
    walletBalance: { type: Number, default: 0 },
    goldBalance:   { type: Number, default: 0 },
    silverBalance: { type: Number, default: 0 },

    // ── Personal Info (editable by user) ──
    phone:   { type: String, default: "" },
    address: { type: String, default: "" },
    city:    { type: String, default: "" },
    state:   { type: String, default: "" },
    pincode: { type: String, default: "" },

    // ── Payment Details (editable by user) ──
    upiId:         { type: String, default: "" },
    accountName:   { type: String, default: "" },
    accountNumber: { type: String, default: "" }, // store hashed in production
    ifscCode:      { type: String, default: "" },
    bankName:      { type: String, default: "" },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;