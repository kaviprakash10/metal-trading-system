// // seedProducts.js
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Product from "../models/Product.js";
// import db from "../../config/db.js";

// dotenv.config();

// const sampleProducts = [
//   {
//     name: "22K Gold Coin - 10g",
//     description: "Beautifully designed 10 gram 22K gold coin with Lakshmi motif",
//     metal: "GOLD",
//     weightGrams: 10,
//     purity: "22K",
//     imageUrl: "https://res.cloudinary.com/your-cloud-name/image/upload/v1740000000/gold-coin-10g.jpg",
//     imagePublicId: "gold-coin-10g",
//     category: "coin",
//     sortOrder: 1,
//   },
//   {
//     name: "24K Gold Bar - 50g",
//     description: "Premium Swiss-style 50 gram 24K gold bar",
//     metal: "GOLD",
//     weightGrams: 50,
//     purity: "24K",
//     imageUrl: "https://res.cloudinary.com/your-cloud-name/image/upload/v1740000000/gold-bar-50g.jpg",
//     imagePublicId: "gold-bar-50g",
//     category: "bar",
//     sortOrder: 2,
//   },
//   {
//     name: "999 Pure Silver Coin - 100g",
//     description: "100 gram pure silver coin with intricate design",
//     metal: "SILVER",
//     weightGrams: 100,
//     purity: "999",
//     imageUrl: "https://res.cloudinary.com/your-cloud-name/image/upload/v1740000000/silver-coin-100g.jpg",
//     imagePublicId: "silver-coin-100g",
//     category: "coin",
//     sortOrder: 3,
//   },
//   {
//     name: "22K Gold Necklace - 20g",
//     description: "Elegant lightweight 22K gold necklace",
//     metal: "GOLD",
//     weightGrams: 20,
//     purity: "22K",
//     imageUrl: "https://res.cloudinary.com/your-cloud-name/image/upload/v1740000000/gold-necklace.jpg",
//     imagePublicId: "gold-necklace",
//     category: "jewellery",
//     sortOrder: 4,
//   },
// ];

// const seedDB = async () => {
//   try {
//     await db();
//     await Product.deleteMany({}); // Clear existing
//     await Product.insertMany(sampleProducts);
//     console.log("✅ Sample products seeded successfully!");
//     process.exit();
//   } catch (err) {
//     console.error("❌ Seeding failed:", err);
//     process.exit(1);
//   }
// };

// seedDB();