import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentPrices } from "../slice/Priceslice";
import { buyGold, buySilver, redeemGold, redeemSilver, clearAssetMessages } from "../slice/Assetslice";
import { fetchWallet } from "../slice/Walletslice";
import { fetchPortfolio } from "../slice/Portfolioslice";
import UserLayout from "./userLayout";
import axios from "../config/axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  ArrowLeft, 
  Wallet, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  Package,
  Sparkles,
  ChevronRight,
  Plus,
  Minus,
  X,
  Gem,
  Activity,
  History,
  ShieldCheck,
  ArrowUpRight,
  LayoutGrid,
  Clock,
  Loader2
} from "lucide-react";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

export default function GalleryPage() {
  const dispatch = useDispatch();
  const { current } = useSelector((state) => state.price);
  const { walletBalance } = useSelector((state) => state.wallet);
  const portfolio = useSelector((state) => state.portfolio);
  const { loading: assetLoading, successMessage, error } = useSelector((state) => state.asset);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customGrams, setCustomGrams] = useState(0);
  const [activeImage, setActiveImage] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Items");

  useEffect(() => {
    dispatch(fetchCurrentPrices());
    dispatch(fetchWallet());
    dispatch(fetchPortfolio());
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

    const grams = product.availableWeights?.length > 0 ? product.availableWeights[0] : product.weightGrams;
    return (grams * pricePerGram).toFixed(2);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setCustomGrams(0);
    setActiveImage("");
    dispatch(clearAssetMessages());
  };

  const handleBuy = async () => {
    if (!selectedProduct) return;
    const isGold = selectedProduct.metal === "GOLD";
    const pricePerGram = isGold ? current.gold?.pricePerGram : current.silver?.pricePerGram;
    const totalGrams = customGrams * quantity;
    const heldGrams = isGold ? (portfolio.gold?.grams || 0) : (portfolio.silver?.grams || 0);

    if (heldGrams < totalGrams) {
      const missingGrams = parseFloat((totalGrams - heldGrams).toFixed(6));
      const costForMissing = missingGrams * pricePerGram * 1.03; 

      const confirmBuy = window.confirm(
        `Insufficient holdings. Buy the remaining ${missingGrams}g (approx ₹${fmt(costForMissing)})?`
      );
      if (!confirmBuy) return;
      if (costForMissing > walletBalance) { alert("Insufficient wallet balance!"); return; }

      try {
        const buyAction = isGold ? buyGold({ pricePerGram, grams: missingGrams }) : buySilver({ pricePerGram, grams: missingGrams });
        await dispatch(buyAction).unwrap();
        const redeemAction = isGold ? redeemGold({ grams: totalGrams }) : redeemSilver({ grams: totalGrams });
        await dispatch(redeemAction).unwrap();
        dispatch(fetchWallet());
        dispatch(fetchPortfolio());
      } catch (err) { console.error(err); }
    } else {
      try {
        const redeemAction = isGold ? redeemGold({ grams: totalGrams }) : redeemSilver({ grams: totalGrams });
        await dispatch(redeemAction).unwrap();
        dispatch(fetchPortfolio());
      } catch (err) { console.error(err); }
    }
  };

  if (loading) {
    return (
      <UserLayout active="/user/gallery">
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
           <div className="w-12 h-12 border-4 border-[#BA943A]/10 border-t-[#BA943A] rounded-full animate-spin" />
           <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Syncing Marketplace Feed...</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout active="/user/gallery">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section (Staff-Matched) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight leading-none mb-3">
               Vault Gallery<span className="text-amber-500">.</span>
            </h1>
            <p className="text-slate-500 font-medium flex items-center gap-2.5">
               <Sparkles size={18} className="text-[#BA943A]" />
               Premium Redemptions
               <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-2" />
               <Activity size={16} className="text-emerald-500" />
               Live Inventory
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6 bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm"
          >
             <div className="px-6 py-1 border-r border-slate-100 text-center">
                <p className="text-slate-400 text-[9px] font-black tracking-widest uppercase mb-1">Liquidity</p>
                <p className="font-serif font-black text-slate-900 text-2xl tracking-tight">₹{fmt(walletBalance)}</p>
             </div>
             <div className="pr-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                   <Wallet size={22} />
                </div>
             </div>
          </motion.div>
        </div>

        {/* Categories (Staff-Matched Scale) */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-100 max-w-fit overflow-x-auto no-scrollbar">
          {["All Items", "Gold Coins", "Silver Coins", "Gold Bars", "Silver Bars", "Jewellery"].map((cat, i) => (
            <button 
              key={i} 
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                ${activeCategory === cat ? "bg-white text-slate-900 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {products.filter(p => {
          if (activeCategory === "All Items") return true;
          if (activeCategory === "Gold Coins") return p.metal === "GOLD" && p.category === "coin";
          if (activeCategory === "Silver Coins") return p.metal === "SILVER" && p.category === "coin";
          if (activeCategory === "Gold Bars") return p.metal === "GOLD" && p.category === "bar";
          if (activeCategory === "Silver Bars") return p.metal === "SILVER" && p.category === "bar";
          if (activeCategory === "Jewellery") return p.category === "jewellery" || p.category === "special";
          return true;
        }).length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-24 text-center border border-slate-200/50">
            <Package size={48} className="mx-auto text-slate-100 mb-4" strokeWidth={1} />
            <p className="text-slate-400 font-medium italic">No assets found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products
              .filter(p => {
                if (activeCategory === "All Items") return true;
                if (activeCategory === "Gold Coins") return p.metal === "GOLD" && p.category === "coin";
                if (activeCategory === "Silver Coins") return p.metal === "SILVER" && p.category === "coin";
                if (activeCategory === "Gold Bars") return p.metal === "GOLD" && p.category === "bar";
                if (activeCategory === "Silver Bars") return p.metal === "SILVER" && p.category === "bar";
                if (activeCategory === "Jewellery") return p.category === "jewellery" || p.category === "special";
                return true;
              })
              .map((product, i) => {
              const livePrice = getLivePrice(product);
              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setSelectedProduct(product);
                    setActiveImage(product.imageUrl);
                    setCustomGrams(product.availableWeights?.length > 0 ? product.availableWeights[0] : product.weightGrams);
                    setQuantity(1);
                    dispatch(clearAssetMessages());
                  }}
                  className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col h-full"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-50">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {product.isLimited && (
                      <div className="absolute top-4 right-4 bg-rose-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                        Limited
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-slate-900 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/50 shadow-sm">
                      {product.metal}
                    </div>
                  </div>
                  
                  <div className="p-7 flex-1 flex flex-col">
                    <div className="mb-8">
                       <h3 className="font-serif text-xl font-black text-slate-900 leading-tight group-hover:text-[#BA943A] transition-colors duration-500 tracking-tight">
                         {product.name}
                       </h3>
                       <p className="text-slate-400 text-[11px] font-medium leading-relaxed italic opacity-80 mt-2 line-clamp-2">
                         {product.description}
                       </p>
                    </div>

                    <div className="mt-auto flex items-end justify-between pt-6 border-t border-slate-50">
                      <div>
                        <span className="text-slate-300 text-[9px] font-black tracking-widest uppercase">From</span>
                        <p className="text-[#BA943A] font-serif text-2xl font-black tracking-tighter leading-none">₹{fmt(livePrice)}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center bg-slate-50 group-hover:bg-slate-900 group-hover:text-[#BA943A] transition-all duration-500">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Simple Product Modal (Staff-Matched Scale) */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white shadow-xl text-slate-900 hover:scale-110 transition-all"
              >
                <X size={20} />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-1/2 bg-slate-50 p-10 flex flex-col items-center justify-center">
                <div className="w-full aspect-square relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                  <motion.img
                    key={activeImage}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    src={activeImage}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedProduct.additionalImages?.length > 0 && (
                  <div className="flex gap-4 mt-6 overflow-x-auto pb-2 w-full justify-center no-scrollbar">
                    <div 
                      onClick={() => setActiveImage(selectedProduct.imageUrl)}
                      className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 cursor-pointer transition-all ${activeImage === selectedProduct.imageUrl ? 'border-[#BA943A] scale-105 shadow-lg' : 'border-transparent opacity-60'}`}
                    >
                      <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" />
                    </div>
                    {selectedProduct.additionalImages.map((img, i) => (
                      <div 
                        key={i} 
                        onClick={() => setActiveImage(img.url)}
                        className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 cursor-pointer transition-all bg-white ${activeImage === img.url ? 'border-[#BA943A] scale-105 shadow-lg' : 'border-transparent opacity-60'}`}
                      >
                        <img src={img.url} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Details Side */}
              <div className="w-full md:w-1/2 p-12 flex flex-col overflow-y-auto no-scrollbar">
                <div className="mb-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border ${selectedProduct.metal === "GOLD" ? "bg-yellow-50 text-[#BA943A] border-yellow-100" : "bg-slate-50 text-slate-600 border-slate-100"}`}>
                      {selectedProduct.metal} {selectedProduct.category}
                    </span>
                    <span className="text-slate-300 font-black">•</span>
                    <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{selectedProduct.purity}</span>
                  </div>
                  <h2 className="font-serif text-4xl font-black text-slate-900 tracking-tight leading-none">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed italic opacity-90 max-w-sm">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Configuration Blocks */}
                <div className="space-y-6 mb-10">
                   <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                      <p className="text-slate-900 font-black text-[10px] uppercase tracking-widest mb-4">Select Mass (g)</p>
                      <div className="grid grid-cols-3 gap-3">
                        {(selectedProduct.category === "coin" || selectedProduct.category === "bar") ? (
                          (selectedProduct.availableWeights?.length > 0 ? selectedProduct.availableWeights : [selectedProduct.weightGrams]).map(w => (
                            <button
                              key={w}
                              disabled={successMessage}
                              onClick={() => setCustomGrams(w)}
                              className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${customGrams === w ? "bg-slate-900 text-[#BA943A] border-slate-900 shadow-lg" : "bg-white text-slate-400 border-slate-100 hover:border-[#BA943A] hover:text-[#BA943A]"}`}
                            >
                              {w}g
                            </button>
                          ))
                        ) : (
                          <div className="col-span-3 py-3 px-6 rounded-xl bg-white border border-[#BA943A] text-[#BA943A] font-black flex justify-between items-center text-[10px] tracking-widest uppercase">
                            <span>Fixed Mass</span>
                            <span>{selectedProduct.weightGrams}g</span>
                          </div>
                        )}
                      </div>
                   </div>

                   <div className="flex items-center justify-between bg-slate-900 p-8 rounded-[2rem] shadow-xl">
                      <span className="text-white font-black text-[10px] uppercase tracking-widest">Quantity</span>
                      <div className="flex items-center gap-8">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={successMessage || quantity <= 1}
                          className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-[#BA943A] hover:text-black hover:border-[#BA943A] transition-all disabled:opacity-10"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="font-serif text-3xl font-black text-[#D8B452] w-8 text-center">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(quantity + 1)}
                          disabled={successMessage}
                          className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-[#BA943A] hover:text-black hover:border-[#BA943A] transition-all disabled:opacity-10"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                   </div>
                </div>

                {/* Messages */}
                {successMessage && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-center gap-3 text-xs font-black uppercase tracking-widest">
                    <CheckCircle2 size={18} /> {successMessage}
                  </motion.div>
                )}

                {/* CTA */}
                <div className="mt-auto pt-8 border-t border-slate-50 space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-slate-300 text-[9px] font-black tracking-widest uppercase">Gross Mass</p>
                      <p className="font-serif text-4xl font-black text-slate-900 tracking-tighter">{(customGrams * quantity).toFixed(2)}<span className="text-xl font-medium text-slate-300 ml-1">g</span></p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-1">
                        <Package size={10} /> Holdings: {(selectedProduct.metal === "GOLD" ? (portfolio?.gold?.grams || 0) : (portfolio?.silver?.grams || 0)).toFixed(2)}g
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleBuy}
                    disabled={assetLoading || successMessage}
                    className={`w-full py-6 rounded-[2rem] font-black text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-4 active:scale-[0.98]
                      ${successMessage ? "bg-emerald-500 text-white" : "bg-slate-900 text-[#BA943A] hover:bg-black"}`}
                  >
                    {assetLoading ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : successMessage ? (
                      <>Order Confirmed <CheckCircle2 size={24} /></>
                    ) : (
                      <>Redeem Assets <ChevronRight size={24} /></>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </UserLayout>
  );
}