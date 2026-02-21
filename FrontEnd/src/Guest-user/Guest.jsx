import "./G-styles.css";
import "./G-head.css";
import Home from "./G-home";
import Calculator from "./Calculator";
import About from "./About";
import Contact from "./Contact";
import SignIn from "./SignIn";
import axios from "axios";
import { Link, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Guest() {
  // useState to update the price for the Gold & Silver
  const [liveGold, setliveGold] = useState(0);
  const [liveSilver, setLiveSilver] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to update the price 
  // useEffect(() => {

  //   const API_KEY = 'goldapi-dpqtzqsml6a7f72-io';
  //   const fetchPrice = async () => {
  //     try {
  //       const response = await axios.get('https://www.goldapi.io/api/XAU/INR', {
  //         headers: {
  //           'x-access-token': 'goldapi-dpqtzqsml6a7f72-io',
  //           'Content-Type': 'application/json',
  //         },
  //       })
  //       const goldPerGram = response.data.price_gram_24k?.toFixed(2) || 0;

  //       // fetching for silver
  //       const silverRes = await axios.get('https://www.goldapi.io/api/XAG/INR', {
  //         headers: {
  //           'x-access-token': 'goldapi-dpqtzqsml6a7f72-io',
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //       const silverPerGram = silverRes.data.price_gram_24k?.toFixed(2) || 0;
  //       setliveGold(goldPerGram);
  //       setLiveSilver(silverPerGram);
  //       setLoading(false);
  //     }
  //     catch (err) {
  //       console.error('Failed to fetch metal prices:', err);
  //       setError('Unable to load live prices');
  //       setLoading(false);
  //     }
  //   }
  //   fetchPrice();
  //     const interval = setInterval(fetchPrice, 180000);
  //     // To rest the price for every 3 mins 
  //     return () => clearInterval(interval);
  // }, []);
  // if (loading) {
  //   return <span>Loading live prices...</span>;
  // }

  // if (error) {
  //   return <span style={{ color: 'red' }}>{error}</span>;
  // }


  return (
    // home page design of the top 
    <div className="guest-layout">
      <header className="luna-header">
        <div className="header-container">
          {/* Head Section of the Brand name */}
          <div className="logo">
            <span className="luna-text"> Luna </span>
            <span className="pvt"> pvt </span>
            <span className="gold-text"> Gold</span>
          </div>
          {/* Head Section Nav Bar */}
          <nav className="main-nav">
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/calculators/sip" className="nav-link">Calculator</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact Us</Link>
          </nav>
          {/* To list the live Price */}
          <div className="live-price">
            <div className="price-item gold">
              <span className="wave-icon">((•))</span>
              Live Gold Price ₹{liveGold}/gm
            </div>
            <div className="price-item silver">
              <span className="wave-icon">((•))</span>
              Live Gold Price ₹{liveSilver}/gm
            </div>
          </div>
          {/* Sign Up btn */}
          <Link to="/signup" className="signup-btn">Sign Up</Link>
        </div>
      </header>
      {/* Main content area */}
      <main className="main-content">
        <Routes>
          < Route path="/home" element={<Home />} />
          <Route path="/calculators/sip" element={<Calculator />} />
          < Route path="/about" element={<About />} />
          < Route path="/contact" element={<Contact />} />
          < Route path="/signup" element={<SignIn />} />
        </Routes>
      </main>

    </div>
  );
}