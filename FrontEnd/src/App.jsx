import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "./slice/Authslice";

// Guest Layout (contains its own sub-routes)
import Guest from "./Guest-user/Guest";

// Auth Pages
import SigninPage from "./Pages/SigninPage";
import SignupPage from "./Pages/SignupPage";

import Dashboard from "./user/Dashboard";

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

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

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

      {/* ── Guest / Public Routes (Includes Login/Register) ── */}
      <Route path="/*" element={<Guest />} />
    </Routes>
  );
}

export default App;
