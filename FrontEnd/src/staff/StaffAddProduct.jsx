import { useState, useEffect } from "react";
import axios from "../config/axios";
import StaffLayout from "./StaffLayout";
import { Trash2, Edit, PackageX, PackageCheck } from "lucide-react";

export default function StaffAddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    metal: "GOLD",
    weightGrams: "",
    purity: "",
    category: "coin",
    isLimited: false,
    sortOrder: 0,
  });

  const [images, setImages] = useState([]); // New file objects
  const [imagePreviews, setImagePreviews] = useState([]); // Previews for new files
  const [existingImages, setExistingImages] = useState([]); // {url, publicId} from DB
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      setProducts(res.data.products || []);
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
    data.append("purity", formData.purity);
    data.append("category", formData.category);
    data.append("isLimited", formData.isLimited);
    data.append("sortOrder", formData.sortOrder);
    
    // For updates, send the retained images
    if (editingId) {
      data.append("retainedImages", JSON.stringify(existingImages));
    }
    
    // Append any new files
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
      name: "", description: "", metal: "GOLD", weightGrams: "",
      purity: "", category: "coin", isLimited: false, sortOrder: 0
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
      weightGrams: product.weightGrams,
      purity: product.purity,
      category: product.category,
      isLimited: product.isLimited,
      sortOrder: product.sortOrder,
    });
    
    // Populate existing images
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

              <input type="number" name="weightGrams" placeholder="Weight in Grams" value={formData.weightGrams} onChange={handleChange} required style={inputStyle} />

              <input type="text" name="purity" placeholder="Purity (e.g. 22K or 999)" value={formData.purity} onChange={handleChange} style={inputStyle} />
              
              <input type="number" name="sortOrder" placeholder="Sort Order" value={formData.sortOrder} onChange={handleChange} style={inputStyle} />
            </div>

            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} style={{...inputStyle, width: "100%"}} rows={3} />

            <div style={{ margin: "1rem 0" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" name="isLimited" checked={formData.isLimited} onChange={handleChange} style={{ width: "18px", height: "18px" }} />
                <strong>Limited Edition</strong>
              </label>
            </div>

            <div style={{ margin: "1.5rem 0", padding: "1.5rem", border: "1px dashed #ccc", borderRadius: "12px", background: "#fafafa" }}>
              <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem", color: "#555" }}>Product Images</h3>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                
                {/* Existing Images (When Editing) */}
                {existingImages.map((img, i) => (
                  <div key={`exist-${i}`} style={{ position: "relative" }}>
                    <img src={img.url} alt="existing" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }} />
                    <button 
                      type="button" 
                      onClick={() => removeExistingImage(i)}
                      style={{ position: "absolute", top: "-8px", right: "-8px", background: "#ff4444", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* New Images */}
                {imagePreviews.map((src, i) => (
                  <div key={`new-${i}`} style={{ position: "relative" }}>
                    <img src={src} alt="new preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "2px solid #c9a84c" }} />
                    <button 
                      type="button" 
                      onClick={() => removeNewImage(i)}
                      style={{ position: "absolute", top: "-8px", right: "-8px", background: "#ff4444", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                
                {/* Upload Button */}
                {totalSelectedImages < 5 && (
                  <label style={{ width: "100px", height: "100px", borderRadius: "8px", border: "2px dashed #bbb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#fff", transition: "0.2s" }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#f0f0f0"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#fff"}
                  >
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: "none" }} />
                    <span style={{ fontSize: "2rem", color: "#aaa" }}>+</span>
                  </label>
                )}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#888", marginTop: "12px" }}>
                {totalSelectedImages} / 5 images selected. (First image will be the primary cover)
              </div>
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

        {/* LIST SECTION */}
        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Manage Existing Products</h2>
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
                      {product.metal} • {product.weightGrams}g • {product.category}
                    </p>
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