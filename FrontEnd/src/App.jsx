import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "./slice/Authslice";

// Guest Layout (contains its own sub-routes)
import Guest from "./Guest-user/Guest";

// User Layout
import Dashboard from "./user/Dashboard";
import BuyPage from "./user/metalBuyPage";
import SellPage from "./user/metalSellPage";
import PortfolioPage from "./user/portfolioPage";
import WalletPage from "./user/walletPage";
import TransactionsPage from "./user/transactionsPage";
import SIPPage from "./user/SIPpage";

/* ── Protected Route: logged-in users only ── */
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="w-10 h-10 border-4 border-[#BA943A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

/* ── Admin Route: admin users only ── */
const AdminRoute = ({ children }) => {
  const { isLoggedIn, user, loading } = useSelector((state) => state.auth);

  if (loading) return null;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/user/dashboard" replace />;
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn, loading } = useSelector((state) => state.auth);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  if (localStorage.getItem("token") && isLoggedIn === false) {
    return <p>...loading</p>;
  }

  return (
    // User Page LayOut Form
    <Routes>
      {/* ── User Protected Routes ── */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/buy/:type"
        element={
          <ProtectedRoute>
            <BuyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/sell/:type"
        element={
          <ProtectedRoute>
            <SellPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/portfolio"
        element={
          <ProtectedRoute>
            <PortfolioPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/wallet"
        element={
          <ProtectedRoute>
            <WalletPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/transactions"
        element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/sip"
        element={
          <ProtectedRoute>
            <SIPPage />
          </ProtectedRoute>
        }
      />

      {/* ── Guest / Public Routes (Includes Login/Register) ── */}
      <Route path="/*" element={<Guest />} />
    </Routes>
  );
}

export default App;
