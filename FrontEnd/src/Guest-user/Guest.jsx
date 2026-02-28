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

  // Fetch prices from YOUR backend (not GoldAPI directly)
  useEffect(() => {
    dispatch(fetchCurrentPrices());
    const interval = setInterval(() => {
      dispatch(fetchCurrentPrices());
    }, 180000); // refresh every 3 mins
    return () => clearInterval(interval);
  }, [dispatch]);

  const liveGold = current.gold?.pricePerGram ?? 0;
  const liveSilver = current.silver?.pricePerGram ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="text-xl font-semibold tracking-wide">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={Logo}
                alt="Luna Gold"
                className="w-10 h-10 rounded-full shadow-xl object-cover"
              />
              <div>
                <span className="text-white">Luna </span>
                <span className="text-gray-200 text-sm">pvt </span>
                <span className="text-yellow-300 font-bold">Gold</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex gap-6 font-medium">
            <Link to="/" className="hover:text-yellow-300 transition">
              Home
            </Link>
            <Link
              to="/calculators/sip"
              className="hover:text-yellow-300 transition"
            >
              Calculator
            </Link>
            <Link to="/about" className="hover:text-yellow-300 transition">
              About
            </Link>
            <Link to="/contact" className="hover:text-yellow-300 transition">
              Contact Us
            </Link>
          </nav>

          {/* Live Prices */}
          <div className="hidden lg:flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="animate-pulse text-yellow-300">((•))</span>
              {loading
                ? "Loading..."
                : error
                  ? "Unavailable"
                  : `Live Gold ₹${liveGold}/gm`}
            </div>

            <div className="flex items-center gap-2">
              <span className="animate-pulse text-gray-300">((•))</span>
              {loading
                ? "Loading..."
                : error
                  ? "Unavailable"
                  : `Live Silver ₹${liveSilver}/gm`}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hover:text-yellow-300 transition font-medium"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-6 py-10">
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
    </div>
  );
}
