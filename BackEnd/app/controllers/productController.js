// app/controllers/productController.js
import Product from "../models/Product.js";
import GoldPrice from "../models/GoldPriceModel.js";
import SilverPrice from "../models/SilverPriceModel.js";
import { cloudinary } from "../middlewares/upload.js";

const productController = {};

// Get all products with live pricing
productController.getAll = async (req, res) => {
  try {
    const products = await Product.find({ inStock: true }).sort({ sortOrder: 1 });

    const goldPrice = await GoldPrice.findOne().sort({ createdAt: -1 });
    const silverPrice = await SilverPrice.findOne().sort({ createdAt: -1 });

    const withPrices = products.map((p) => ({
      ...p.toObject(),
      pricePerGram: p.metal === "GOLD" ? goldPrice?.pricePerGram : silverPrice?.pricePerGram,
      totalPrice: (p.weightGrams * (p.metal === "GOLD" ? goldPrice?.pricePerGram : silverPrice?.pricePerGram || 0)).toFixed(2),
    }));

    res.json({ success: true, products: withPrices });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create Product (Staff + Admin)
productController.create = async (req, res) => {
  try {
    const { name, description, metal, weightGrams, purity, category, isLimited, sortOrder } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one product image is required" });
    }

    const mainImage = req.files[0];
    const additionalImages = req.files.slice(1).map(f => ({ url: f.path, publicId: f.filename }));

    const product = new Product({
      name,
      description: description || "",
      metal: metal.toUpperCase(),
      weightGrams: Number(weightGrams),
      purity: purity || (metal.toUpperCase() === "GOLD" ? "22K" : "999"),
      imageUrl: mainImage.path,           // Cloudinary secure URL
      imagePublicId: mainImage.filename,  // Cloudinary public_id
      additionalImages,
      category: category || "standard",
      isLimited: isLimited === "true" || false,
      sortOrder: Number(sortOrder) || 0,
      inStock: true,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Other methods (keep as they are)
productController.getOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

productController.update = async (req, res) => {
  try {
    const { name, description, metal, weightGrams, purity, category, isLimited, sortOrder, retainedImages } = req.body;
    
    let parsedRetained = [];
    try {
      if (retainedImages) parsedRetained = JSON.parse(retainedImages);
    } catch(e) {}

    const newUploaded = (req.files || []).map(f => ({ url: f.path, publicId: f.filename }));
    const finalImages = [...parsedRetained, ...newUploaded];

    if (finalImages.length === 0) {
      return res.status(400).json({ success: false, message: "At least one product image is required" });
    }

    const mainImage = finalImages[0];
    const additionalImages = finalImages.slice(1);

    // Optional: Find which ones were deleted and remove from Cloudinary
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const oldImages = [{url: product.imageUrl, publicId: product.imagePublicId}, ...(product.additionalImages || [])];
    oldImages.forEach(img => {
      if (img.publicId && !finalImages.find(f => f.publicId === img.publicId)) {
        cloudinary.uploader.destroy(img.publicId).catch(console.error);
      }
    });

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description: description || "",
        metal: metal?.toUpperCase(),
        weightGrams: Number(weightGrams),
        purity: purity || (metal?.toUpperCase() === "GOLD" ? "22K" : "999"),
        category: category || "standard",
        isLimited: isLimited === "true" || false,
        sortOrder: Number(sortOrder) || 0,
        imageUrl: mainImage.url,
        imagePublicId: mainImage.publicId,
        additionalImages
      },
      { new: true }
    );
    res.json({ success: true, message: "Product updated", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

productController.toggleStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    product.inStock = !product.inStock;
    await product.save();

    res.json({ success: true, message: "Stock status updated", product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

productController.delete = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product?.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export default productController;