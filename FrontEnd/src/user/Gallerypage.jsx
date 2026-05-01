import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentPrices } from "../slice/Priceslice";
import { buyGold, buySilver, clearAssetMessages } from "../slice/Assetslice";
import { fetchWallet } from "../slice/Walletslice";
import UserLayout from "./userLayout";
import axios from "../config/axios";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

export default function GalleryPage() {
  const dispatch = useDispatch();
  const { current } = useSelector((state) => state.price);
  const { walletBalance } = useSelector((state) => state.wallet);
  const { loading: assetLoading, successMessage, error } = useSelector((state) => state.asset);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customGrams, setCustomGrams] = useState(0);

  useEffect(() => {
    dispatch(fetchCurrentPrices());
    dispatch(fetchWallet());
    fetchProducts();
  }, [dispatch]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getLivePrice = (product) => {
    if (!product) return 0;
    const pricePerGram = product.metal === "GOLD"
      ? (current.gold?.pricePerGram || 0)
      : (current.silver?.pricePerGram || 0);

    return (product.weightGrams * pricePerGram).toFixed(2);
  };

  const getTotalCost = (product, qty, grams) => {
    if (!product) return 0;
    const pricePerGram = product.metal === "GOLD"
      ? (current.gold?.pricePerGram || 0)
      : (current.silver?.pricePerGram || 0);
    const base = grams * qty * pricePerGram;
    return (base * 1.03).toFixed(2); // 3% GST
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setCustomGrams(0);
    dispatch(clearAssetMessages());
  };

  const handleBuy = () => {
    if (!selectedProduct) return;
    const pricePerGram = selectedProduct.metal === "GOLD" 
      ? current.gold?.pricePerGram 
      : current.silver?.pricePerGram;
      
    const totalGrams = customGrams * quantity;
    const totalCost = parseFloat(getTotalCost(selectedProduct, quantity, customGrams));

    if (totalCost > walletBalance) {
      alert(`Insufficient wallet balance! You have ₹${fmt(walletBalance)} but need ₹${fmt(totalCost)}.`);
      return;
    }

    if (selectedProduct.metal === "GOLD") {
      dispatch(buyGold({ pricePerGram, grams: totalGrams }));
    } else {
      dispatch(buySilver({ pricePerGram, grams: totalGrams }));
    }
  };

  if (loading) {
    return (
      <UserLayout active="/user/gallery">
        <div style={{ textAlign: "center", padding: "4rem", fontSize: "1.2rem" }}>
          Loading Our Collection...
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout active="/user/gallery">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ 
          fontFamily: "'Cormorant Garamond', serif", 
          fontSize: "2.8rem", 
          textAlign: "center", 
          marginBottom: "0.5rem",
          color: "#1a1200"
        }}>
          Our Collection
        </h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "3rem", fontSize: "1.1rem" }}>
          Premium Gold & Silver Coins • Bars • Jewellery
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2rem", padding: "0 1rem" }}>
          <div style={{ background: "#f0ead8", padding: "0.75rem 1.5rem", borderRadius: "12px", fontWeight: 600 }}>
            Wallet Balance: <span style={{ color: "#c9a84c" }}>₹{fmt(walletBalance)}</span>
          </div>
        </div>

        {products.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", fontSize: "1.2rem" }}>
            No products available at the moment.
          </p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "2rem"
          }}>
            {products.map((product) => {
              const livePrice = getLivePrice(product);
              return (
                <div
                  key={product._id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setCustomGrams(product.weightGrams);
                    setQuantity(1);
                    dispatch(clearAssetMessages());
                  }}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.12)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 6px 25px rgba(0,0,0,0.08)";
                  }}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "280px",
                      objectFit: "cover"
                    }}
                  />
                  <div style={{ padding: "1.25rem" }}>
                    <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem" }}>
                      {product.name}
                    </h3>
                    <p style={{ 
                      color: "#666", 
                      fontSize: "0.9rem", 
                      marginBottom: "1rem",
                      minHeight: "48px"
                    }}>
                      {product.description}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: "0.85rem", color: "#888" }}>
                          {product.weightGrams}g • {product.purity}
                        </span>
                        {product.isLimited && (
                          <span style={{ marginLeft: "8px", color: "#e63939", fontSize: "0.8rem", fontWeight: 600 }}>
                            LIMITED
                          </span>
                        )}
                      </div>
                      <div style={{ 
                        fontWeight: 700, 
                        color: "#c9a84c", 
                        fontSize: "1.45rem" 
                      }}>
                        ₹{fmt(livePrice)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            maxWidth: "520px",
            width: "90%",
            padding: "2rem",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <div style={{ display: "flex", overflowX: "auto", gap: "10px", marginBottom: "1.5rem", paddingBottom: "10px" }}>
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                style={{ width: "100%", maxWidth: "350px", borderRadius: "12px", objectFit: "cover", flexShrink: 0 }}
              />
              {selectedProduct.additionalImages?.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={`${selectedProduct.name} ${i + 1}`}
                  style={{ width: "100%", maxWidth: "350px", borderRadius: "12px", objectFit: "cover", flexShrink: 0 }}
                />
              ))}
            </div>

            <h2 style={{ margin: "0 0 0.5rem" }}>{selectedProduct.name}</h2>
            <p style={{ color: "#555", marginBottom: "1rem" }}>{selectedProduct.description}</p>

            <div style={{ margin: "1.5rem 0", lineHeight: "1.8", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ background: "#fafafa", padding: "1rem", borderRadius: "12px", border: "1px solid #eee" }}>
                <p style={{ margin: "0 0 0.5rem", fontWeight: 600, color: "#333", fontSize: "0.9rem", textTransform: "uppercase" }}>Customize Weight</p>
                <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                  <input 
                    type="number" 
                    min="0.1" 
                    step="0.1"
                    value={customGrams} 
                    onChange={(e) => setCustomGrams(Number(e.target.value))}
                    disabled={successMessage}
                    style={{ width: "100%", padding: "0.75rem", paddingRight: "2.5rem", borderRadius: "8px", border: "1px solid #c9a84c", fontSize: "1.2rem", fontWeight: 700, color: "#111", outline: "none", background: successMessage ? "#f5f5f5" : "#fff" }}
                  />
                  <span style={{ position: "absolute", right: "1rem", color: "#888", fontWeight: 600 }}>g</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "1rem" }}>
                <p style={{ margin: "0 0 0.25rem" }}><strong>Purity:</strong> {selectedProduct.purity}</p>
                <p style={{ margin: "0 0 0.25rem" }}><strong>Category:</strong> {selectedProduct.category}</p>
                <p style={{ margin: 0 }}><strong>Metal:</strong> {selectedProduct.metal}</p>
              </div>
            </div>

            <div style={{ background: "#fafafa", padding: "1.5rem", borderRadius: "12px", border: "1px solid #eee", marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#333" }}>Quantity to Order:</label>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  disabled={successMessage}
                  style={{ padding: "0.5rem 1rem", fontSize: "1.2rem", background: "#fff", border: "1px solid #ddd", borderRadius: "8px", cursor: successMessage ? "not-allowed" : "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
                >
                  -
                </button>
                <span style={{ fontSize: "1.3rem", fontWeight: 700, minWidth: "40px", textAlign: "center" }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  disabled={successMessage}
                  style={{ padding: "0.5rem 1rem", fontSize: "1.2rem", background: "#fff", border: "1px solid #ddd", borderRadius: "8px", cursor: successMessage ? "not-allowed" : "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
                >
                  +
                </button>
              </div>
              <p style={{ margin: 0, color: "#666", fontSize: "0.95rem" }}>
                Total Metal: <strong style={{ color: "#111" }}>{(customGrams * quantity).toFixed(2)} grams</strong>
              </p>
            </div>

            {successMessage && <div style={{ padding: "1rem", background: "#dcfce7", color: "#15803d", borderRadius: "8px", marginBottom: "1rem", fontWeight: 500, border: "1px solid #86efac" }}>✅ {successMessage}</div>}
            {error && <div style={{ padding: "1rem", background: "#fee2e2", color: "#dc2626", borderRadius: "8px", marginBottom: "1rem", fontWeight: 500, border: "1px solid #fca5a5" }}>❌ {error}</div>}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Total Cost</div>
                <div style={{ fontSize: "2.2rem", fontWeight: 700, color: "#c9a84c", lineHeight: 1 }}>
                  ₹{fmt(getTotalCost(selectedProduct, quantity, customGrams))}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#999", marginTop: "0.25rem" }}>Includes 3% GST</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={closeModal}
                style={{
                  flex: 1,
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  background: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseOver={(e) => e.target.style.background = "#f5f5f5"}
                onMouseOut={(e) => e.target.style.background = "#fff"}
              >
                Close
              </button>
              <button
                onClick={handleBuy}
                disabled={assetLoading || successMessage}
                style={{
                  flex: 2,
                  padding: "1rem",
                  background: successMessage ? "#4ade80" : "#c9a84c",
                  color: "#000",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  cursor: (assetLoading || successMessage) ? "not-allowed" : "pointer",
                  transition: "transform 0.1s, opacity 0.2s",
                  opacity: assetLoading ? 0.7 : 1
                }}
                onMouseDown={(e) => { if(!assetLoading && !successMessage) e.target.style.transform = "scale(0.98)" }}
                onMouseUp={(e) => { if(!assetLoading && !successMessage) e.target.style.transform = "scale(1)" }}
              >
                {assetLoading ? "Processing..." : successMessage ? "Purchased!" : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}