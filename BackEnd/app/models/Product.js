
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },   
  description: { type: String, default: "" },
  metal:       { type: String, enum: ["GOLD", "SILVER"], required: true },
  weightGrams: { type: Number, required: true },     // 2, 5, 10, 20, 50
  purity:      { type: String, default: "999.9" },
  imageUrl:    { type: String, required: true },     // Cloudinary URL
  imagePublicId: { type: String },                   // Cloudinary public_id
  inStock:     { type: Boolean, default: true },
  isLimited:   { type: Boolean, default: false },    // LIMITED EDITION badge
  category:    { type: String, default: "standard" }, // coin | bar | special   
  sortOrder:   { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);