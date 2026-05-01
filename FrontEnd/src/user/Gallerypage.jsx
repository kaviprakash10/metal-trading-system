import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentPrices } from "../slice/Priceslice";
import { Link } from "react-router-dom";
import UserLayout from "./userLayout";
import axios from "../config/axios";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

export default function GalleryPage() {
  const dispatch = useDispatch();
  const { current } = useSelector((s) => s.price);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchCurrentPrices());
    fetchProducts();
  }, [dispatch]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLivePrice = (product) => {
    const pricePerGram = product.metal === "GOLD" 
      ? (current.gold?.pricePerGram || 0)
      : (current.silver?.pricePerGram || 0);
    
    return (product.weightGrams * pricePerGram).toFixed(2);
  };

  if (loading) {
    return <UserLayout><div style={{textAlign:"center", padding:"4rem"}}>Loading Collection...</div></UserLayout>;
  }

  return (
    <UserLayout active="/user/gallery">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.8rem", textAlign: "center", marginBottom: "0.5rem" }}>
          Our Collection
        </h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "3rem" }}>
          Premium Gold & Silver Coins • Bars • Jewellery
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
          {products.map((product) => {
            const livePrice = getLivePrice(product);
            return (
              <div
                key={product._id}
                onClick={() => setSelectedProduct(product)}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: "100%", height: "280px", objectFit: "cover" }}
                />
                <div style={{ padding: "1.25rem" }}>
                  <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.3rem" }}>{product.name}</h3>
                  <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1rem", minHeight: "44px" }}>
                    {product.description}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "0.85rem", color: "#888" }}>
                        {product.weightGrams}g • {product.purity}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, color: "#c9a84c", fontSize: "1.4rem" }}>
                      ₹{livePrice}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: "20px", maxWidth: "500px", width: "90%", padding: "2rem" }}>
            <img src={selectedProduct.imageUrl} alt="" style={{ width: "100%", borderRadius: "12px", marginBottom: "1rem" }} />
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.description}</p>
            <p><strong>Weight:</strong> {selectedProduct.weightGrams} grams</p>
            <p><strong>Purity:</strong> {selectedProduct.purity}</p>
            
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#c9a84c", margin: "1rem 0" }}>
              ₹{getLivePrice(selectedProduct)}
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <Link
                to={selectedProduct.metal === "GOLD" ? "/user/buy/gold" : "/user/buy/silver"}
                style={{ flex: 1, padding: "1rem", background: "#c9a84c", color: "#000", textAlign: "center", borderRadius: "12px", textDecoration: "none", fontWeight: 700 }}
              >
                Buy Now
              </Link>
              <button 
                onClick={() => setSelectedProduct(null)}
                style={{ flex: 1, padding: "1rem", border: "1px solid #ddd", borderRadius: "12px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}