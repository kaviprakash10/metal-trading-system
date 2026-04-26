import Product from "../models/Product.js";
import GoldPrice from "../models/GoldPriceModel.js";
import SilverPrice from "../models/SilverPriceModel.js";

const productController = {};

// Get all products with live price attached
productController.getAll = async (req, res) => {
  try {
    const products = await Product.find({ inStock: true }).sort({
      sortOrder: 1,
    });

    // Fetch current live prices
    const goldPrice = await GoldPrice.findOne().sort({ createdAt: -1 });
    const silverPrice = await SilverPrice.findOne().sort({ createdAt: -1 });

    // Calculate price for each product = weightGrams × pricePerGram
    const withPrices = products.map((p) => ({
      ...p.toObject(),
      pricePerGram:
        p.metal === "GOLD"
          ? goldPrice?.pricePerGram
          : silverPrice?.pricePerGram,
      totalPrice:
        p.weightGrams *
        (p.metal === "GOLD"
          ? goldPrice?.pricePerGram
          : silverPrice?.pricePerGram),
    }));

    res.json({ products: withPrices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

productController.getOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

productController.create = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

productController.update = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

productController.delete = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

productController.toggleStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.inStock = !product.inStock;
    await product.save();
    res.json({ message: "Stock updated", inStock: product.inStock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default productController;
