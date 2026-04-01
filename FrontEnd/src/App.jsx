import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "./slice/Authslice";

// Guest Layout
import Guest from "./Guest-user/Guest";

// User Pages
import Dashboard from "./user/Dashboard";
import BuyPage from "./user/metalBuyPage";
import SellPage from "./user/metalSellPage";
import PortfolioPage from "./user/portfolioPage";
import WalletPage from "./user/walletPage";
import TransactionsPage from "./user/transactionsPage";
import SIPPage from "./user/SIPpage";
import AccountPage from "./user/Accountpage";

// Admin Pages
import AdminDashboard from "./admin/Admindashboard";
import ManageUsers from "./admin/manageUser";
import AllTransactions from "./admin/Alltransactions";
import PriceManagement from "./admin/priceUpdate";
import KycManagement from "./admin/KycManagement";

// Staff Pages
import StaffDashboard from "./staff/StaffDashboard";
import StaffUsers from "./staff/StaffUsers";
import StaffTransactions from "./staff/StaffTransactions";
import StaffKyc from "./staff/StaffKyc";

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

/* ── Staff Route: staff or admin users only ── */
const StaffRoute = ({ children }) => {
  const { isLoggedIn, user, loading } = useSelector((state) => state.auth);

  if (loading) return null;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role !== "staff" && user?.role !== "admin") {
    return <Navigate to="/user/dashboard" replace />;
  }
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

  const hasToken = localStorage.getItem("token");
  const isAuthenticating = hasToken && !isLoggedIn;

  if (isAuthenticating || (hasToken && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#BA943A] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-serif text-[#BA943A] animate-pulse">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  return (
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
      <Route
        path="/user/account"
        element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        }
      />

      {/* ── Admin Protected Routes ── */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/transactions"
        element={
          <AdminRoute>
            <AllTransactions />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/prices"
        element={
          <AdminRoute>
            <PriceManagement />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/kyc"
        element={
          <AdminRoute>
            <KycManagement />
          </AdminRoute>
        }
      />

      {/* ── Staff Protected Routes ── */}
      <Route
        path="/staff/dashboard"
        element={
          <StaffRoute>
            <StaffDashboard />
          </StaffRoute>
        }
      />
      <Route
        path="/staff/users"
        element={
          <StaffRoute>
            <StaffUsers />
          </StaffRoute>
        }
      />
      <Route
        path="/staff/transactions"
        element={
          <StaffRoute>
            <StaffTransactions />
          </StaffRoute>
        }
      />
      <Route
        path="/staff/kyc"
        element={
          <StaffRoute>
            <StaffKyc />
          </StaffRoute>
        }
      />

      {/* ── Guest / Public Routes (Login, Register, Landing) ── */}
      <Route path="/*" element={<Guest />} />
    </Routes>
  );
}

export default App;
