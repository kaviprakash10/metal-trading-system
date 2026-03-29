import "./G-styles.css";
import "./G-head.css";
import Logo from "../assets/Logo.png";
import Home from "./G-Home"; // Capitalized H to match filename
import Calculator from "./Calculator";
import About from "./About";
import Contact from "./Contact";
import SigninPage from "../Pages/SigninPage";
import SignupPage from "../Pages/SignupPage";
import { Link, Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentPrices } from "../slice/Priceslice";

export default function Guest() {
  const dispatch = useDispatch();
  const { current, loading, error } = useSelector((state) => state.price);

  useEffect(() => {
    dispatch(fetchCurrentPrices());
    const interval = setInterval(() => {
      dispatch(fetchCurrentPrices());
    }, 180000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const liveGold = current.gold?.pricePerGram ?? 0;
  const liveSilver = current.silver?.pricePerGram ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Premium Sticky Header with Glassmorphism */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="group">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity"></div>
                <img
                  src={Logo}
                  alt="Luna Gold"
                  className="w-11 h-11 rounded-full shadow-lg object-cover relative z-10 transition-transform group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-black text-gray-900 tracking-tight">
                  LUNA GOLD
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-amber-600 font-bold">
                  Private Limited
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8 font-semibold text-gray-500">
            {["Home", "Calculator", "About", "Contact"].map((item) => (
              <Link
                key={item}
                to={
                  item === "Home"
                    ? "/"
                    : item === "Calculator"
                      ? "/calculators/sip"
                      : `/${item.toLowerCase()}`
                }
                className="relative py-1 group hover:text-gray-900 transition-colors"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Live Price Tickers */}
          <div className="hidden xl:flex items-center gap-6 bg-gray-50/50 px-6 py-2 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2 text-sm font-bold">
              <div className="flex items-center justify-center w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
              <span className="text-gray-400 uppercase tracking-tighter text-[10px]">
                Gold
              </span>
              <span className="text-gray-900">
                ₹{liveGold.toLocaleString("en-IN")}/gm
              </span>
            </div>
            <div className="w-px h-4 bg-gray-200"></div>
            <div className="flex items-center gap-2 text-sm font-bold">
              <div className="flex items-center justify-center w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
              <span className="text-gray-400 uppercase tracking-tighter text-[10px]">
                Silver
              </span>
              <span className="text-gray-900">
                ₹{liveSilver.toLocaleString("en-IN")}/gm
              </span>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 transition font-bold"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-amber-600 shadow-xl shadow-gray-200 transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 animate-fade-in">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/calculators/sip" element={<Calculator />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<SigninPage />} />
          <Route path="/register" element={<SignupPage />} />
        </Routes>
      </main>

      {/* Modern Footer (Optional expansion, keeping content clean for now) */}
    </div>
  );
}
