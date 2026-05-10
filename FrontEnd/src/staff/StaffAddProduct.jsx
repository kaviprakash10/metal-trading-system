import { useState, useEffect } from "react";
import axios from "../config/axios";
import StaffLayout from "./StaffLayout";
import { Trash2, Edit, PackageX, PackageCheck, Plus, X, Image as ImageIcon } from "lucide-react";

export default function StaffAddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    metal: "GOLD",
    weightGrams: "",
    availableWeights: "",
    purity: "",
    category: "coin",
    isLimited: false,
    sortOrder: 0,
    makingCost: "",           // ← New field
  });

  const [images, setImages] = useState([]); // New file objects
  const [imagePreviews, setImagePreviews] = useState([]); // Previews for new files
  const [existingImages, setExistingImages] = useState([]); // {url, publicId} from DB

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState("All Items");

  useEffect(() => {
    fetchProducts(page);
  }, [page, activeCategory]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  const fetchProducts = async (pageNumber = 1) => {
    try {
      let url = `/products?page=${pageNumber}&limit=12&isAdmin=true`;
      if (activeCategory === "Gold Coins") url += "&metal=GOLD&category=coin";
      else if (activeCategory === "Silver Coins") url += "&metal=SILVER&category=coin";
      else if (activeCategory === "Gold Bars") url += "&metal=GOLD&category=bar";
      else if (activeCategory === "Silver Bars") url += "&metal=SILVER&category=bar";
      else if (activeCategory === "Jewellery") url += "&category=jewellery_all";

      const res = await axios.get(url);
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || Math.ceil((res.data.total || 0) / 12));
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalCount = existingImages.length + images.length + files.length;

    if (totalCount > 5) {
      setMessage("❌ You can only have up to 5 images in total.");
      e.target.value = null;
      return;
    }

    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);
      setImagePreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    }

    e.target.value = null;
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const totalImages = existingImages.length + images.length;
    if (totalImages === 0) {
      setMessage("❌ Please select at least one image");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("metal", formData.metal);
    data.append("weightGrams", formData.weightGrams);
    data.append("availableWeights", formData.availableWeights);
    data.append("purity", formData.purity);
    data.append("category", formData.category);
    data.append("isLimited", formData.isLimited);
    data.append("sortOrder", formData.sortOrder);
    
    // Making Cost for Jewellery
    if (formData.category === "jewellery") {
      data.append("makingCost", formData.makingCost || 0);
    }

    if (editingId) {
      data.append("retainedImages", JSON.stringify(existingImages));
    }

    images.forEach(img => data.append("images", img));

    try {
      if (editingId) {
        await axios.put(`/products/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setMessage("✅ Product updated successfully!");
      } else {
        await axios.post("/products", data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setMessage("✅ Product added successfully!");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      setMessage("❌ Failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "", description: "", metal: "GOLD", weightGrams: "", availableWeights: "",
      purity: "", category: "coin", isLimited: false, sortOrder: 0, makingCost: ""
    });
    setImages([]);
    setImagePreviews([]);
    setExistingImages([]);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      metal: product.metal,
      weightGrams: product.weightGrams || "",
      availableWeights: product.availableWeights ? product.availableWeights.join(", ") : "",
      purity: product.purity,
      category: product.category,
      isLimited: product.isLimited,
      sortOrder: product.sortOrder,
      makingCost: product.makingCost || "",        // ← New
    });

    const dbImages = [];
    if (product.imageUrl) {
      dbImages.push({ url: product.imageUrl, publicId: product.imagePublicId });
    }
    if (product.additionalImages?.length) {
      dbImages.push(...product.additionalImages);
    }
    setExistingImages(dbImages);
    setImages([]);
    setImagePreviews([]);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    }
  };

  const handleToggleStock = async (id) => {
    try {
      await axios.patch(`/products/${id}/stock`);
      fetchProducts();
    } catch (err) {
      alert("Failed to update stock: " + err.message);
    }
  };

  const totalSelectedImages = existingImages.length + images.length;

  return (
    <StaffLayout>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}>

        {/* FORM SECTION */}
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>
            {editingId ? "Edit Product Details" : "Add New Product"}
          </h1>

          {message && <div style={{ padding: "1rem", background: message.includes("✅") ? "#d4edda" : "#f8d7da", marginBottom: "1rem", borderRadius: "8px" }}>{message}</div>}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required style={inputStyle} />

              <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
                <option value="coin">Coin</option>
                <option value="bar">Bar</option>
                <option value="jewellery">Jewellery</option>
              </select>

              <select name="metal" value={formData.metal} onChange={handleChange} style={inputStyle}>
                <option value="GOLD">Gold</option>
                <option value="SILVER">Silver</option>
              </select>

              {(formData.category === "coin" || formData.category === "bar") ? (
                <input type="text" name="availableWeights" placeholder="Available Weights (comma separated)" value={formData.availableWeights} onChange={handleChange} required style={inputStyle} />
              ) : (
                <input type="number" step="0.01" name="weightGrams" placeholder="Weight in Grams" value={formData.weightGrams} onChange={handleChange} required style={inputStyle} />
              )}

              <input type="text" name="purity" placeholder="Purity (e.g. 22K or 999)" value={formData.purity} onChange={handleChange} style={inputStyle} />

              {/* Making Cost - Only for Jewellery */}
              {formData.category === "jewellery" && (
                <input 
                  type="number" 
                  name="makingCost" 
                  placeholder="Making Cost (₹)" 
                  value={formData.makingCost} 
                  onChange={handleChange} 
                  style={inputStyle} 
                />
              )}

              <input type="number" name="sortOrder" placeholder="Sort Order" value={formData.sortOrder} onChange={handleChange} style={inputStyle} />
            </div>

            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, width: "100%" }} rows={3} />

            <div style={{ margin: "1rem 0" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" name="isLimited" checked={formData.isLimited} onChange={handleChange} style={{ width: "18px", height: "18px" }} />
                <strong>Limited Edition</strong>
              </label>
            </div>

            {/* Images Section */}
            <div style={{ margin: "1.5rem 0", padding: "1.5rem", border: "1px dashed #ccc", borderRadius: "12px", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#333", fontWeight: 600 }}>Product Images</h3>
                <span style={{ fontSize: "0.85rem", color: totalSelectedImages >= 5 ? "#dc3545" : "#666" }}>
                  {totalSelectedImages} / 5 Images
                </span>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "1rem" }}>
                {/* Existing Images */}
                {existingImages.map((img, idx) => (
                  <div key={`existing-${idx}`} style={{ position: "relative", aspectRatio: "1/1", borderRadius: "10px", overflow: "hidden", border: "1px solid #eee", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                    <img src={img.url} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(220, 38, 38, 0.9)", color: "white", border: "none", borderRadius: "50%", cursor: "pointer", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }}
                    >
                      <X size={14} />
                    </button>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", color: "white", fontSize: "10px", textAlign: "center", padding: "2px 0" }}>Existing</div>
                  </div>
                ))}

                {/* New Previews */}
                {imagePreviews.map((url, idx) => (
                  <div key={`new-${idx}`} style={{ position: "relative", aspectRatio: "1/1", borderRadius: "10px", overflow: "hidden", border: "1px solid #dcfce7", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                    <img src={url} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(220, 38, 38, 0.9)", color: "white", border: "none", borderRadius: "50%", cursor: "pointer", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }}
                    >
                      <X size={14} />
                    </button>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(22, 163, 74, 0.8)", color: "white", fontSize: "10px", textAlign: "center", padding: "2px 0" }}>New</div>
                  </div>
                ))}

                {/* Upload Placeholder */}
                {totalSelectedImages < 5 && (
                  <label style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    border: "2px dashed #d1d5db", borderRadius: "10px", cursor: "pointer", background: "#fff",
                    aspectRatio: "1/1", transition: "all 0.3s ease", color: "#6b7280"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "#d4af37"; e.currentTarget.style.color = "#d4af37"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.color = "#6b7280"; }}
                  >
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                    <Plus size={24} />
                    <span style={{ fontSize: "0.8rem", marginTop: "4px", fontWeight: 500 }}>Add Image</span>
                  </label>
                )}
              </div>
              <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "1rem" }}>
                * Maximum 5 images. The first image will be the primary display image.
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button type="submit" disabled={loading} style={{ flex: 1, padding: "1rem", background: "#1a1a1a", color: "#d4af37", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "1.1rem", cursor: "pointer", transition: "0.2s" }}>
                {loading ? "Processing..." : (editingId ? "Save Changes" : "Upload Product")}
              </button>

              {editingId && (
                <button type="button" onClick={resetForm} style={{ padding: "1rem 2rem", background: "#f0f0f0", color: "#333", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LIST SECTION - Show Making Cost for Jewellery */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Manage Existing Products</h2>
            <div style={{ display: "flex", gap: "0.5rem", background: "#f5f5f5", padding: "4px", borderRadius: "10px" }}>
              {["All Items", "Gold Coins", "Silver Coins", "Gold Bars", "Silver Bars", "Jewellery"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    background: activeCategory === cat ? "#fff" : "transparent",
                    color: activeCategory === cat ? "#1a1a1a" : "#666",
                    boxShadow: activeCategory === cat ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
                    transition: "0.2s"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {products.length === 0 ? (
              <p style={{ color: "#777" }}>No products found in the database.</p>
            ) : (
              products.map(product => (
                <div key={product._id} style={{ display: "flex", alignItems: "center", background: "#fff", padding: "1rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", opacity: product.inStock ? 1 : 0.6 }}>
                  <img src={product.imageUrl} alt={product.name} style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover", marginRight: "1.5rem" }} />

                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 0.25rem", fontSize: "1.1rem" }}>{product.name}</h3>
                    <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                      {product.metal} • {product.category} • {product.weightGrams}g
                    </p>
                    {product.category === "jewellery" && product.makingCost && (
                      <p style={{ margin: "4px 0 0", color: "#c9a84c", fontSize: "0.85rem", fontWeight: 600 }}>
                        Making Cost: ₹{product.makingCost}
                      </p>
                    )}
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: product.inStock ? "#28a745" : "#dc3545", fontWeight: 600 }}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => handleToggleStock(product._id)} title={product.inStock ? "Mark Out of Stock" : "Mark In Stock"} style={{ padding: "0.5rem", border: "1px solid #ddd", background: "#fff", borderRadius: "8px", cursor: "pointer", color: product.inStock ? "#d97706" : "#059669" }}>
                      {product.inStock ? <PackageX size={20} /> : <PackageCheck size={20} />}
                    </button>
                    <button onClick={() => handleEdit(product)} title="Edit Details" style={{ padding: "0.5rem", border: "1px solid #ddd", background: "#fff", borderRadius: "8px", cursor: "pointer", color: "#2563eb" }}>
                      <Edit size={20} />
                    </button>
                    <button onClick={() => handleDelete(product._id)} title="Delete Product" style={{ padding: "0.5rem", border: "1px solid #ddd", background: "#fff", borderRadius: "8px", cursor: "pointer", color: "#dc2626" }}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "2rem" }}>
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page <= 1}
                style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #ddd", background: page <= 1 ? "#f5f5f5" : "#fff", cursor: page <= 1 ? "not-allowed" : "pointer" }}
              >
                Previous
              </button>
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#666" }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page >= totalPages}
                style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #ddd", background: page >= totalPages ? "#f5f5f5" : "#fff", cursor: page >= totalPages ? "not-allowed" : "pointer" }}
              >
                Next
              </button>
            </div>
          )}
        </div>

      </div>
    </StaffLayout>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  background: "#fdfdfd"
};