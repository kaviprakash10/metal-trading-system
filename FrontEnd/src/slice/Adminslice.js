import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

const adminHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/* ================= ASYNC THUNKS ================= */

export const fetchAdminStats = createAsyncThunk(
  "admin/fetchAdminStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/admin/stats", {
        headers: adminHeaders(),
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch stats");
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 20, search = "", kycStatus = "All" } = params;
      const response = await axios.get("/admin/users", {
        params: { page, limit, search, kycStatus },
        headers: adminHeaders(),
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch users");
    }
  }
);

export const updateKycStatus = createAsyncThunk(
  "admin/updateKycStatus",
  async ({ userId, kycStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/admin/users/${userId}/kyc`,
        { kycStatus },
        { headers: adminHeaders() }
      );
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update KYC");
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/admin/users/${userId}/role`,
        { role },
        { headers: adminHeaders() }
      );
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update role");
    }
  }
);

export const fetchAllTransactions = createAsyncThunk(
  "admin/fetchAllTransactions",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 20, search = "", type = "All", asset = "All", userId = "", sort = "-createdAt" } = params;
      const response = await axios.get("/admin/transactions", {
        params: { page, limit, search, type, asset, userId, sort },
        headers: adminHeaders(),
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch transactions");
    }
  }
);

export const setGoldPrice = createAsyncThunk(
  "admin/setGoldPrice",
  async ({ pricePerGram }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/admin/prices/gold",
        { pricePerGram },
        { headers: adminHeaders() }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update gold price");
    }
  }
);

export const setSilverPrice = createAsyncThunk(
  "admin/setSilverPrice",
  async ({ pricePerGram }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/admin/prices/silver",
        { pricePerGram },
        { headers: adminHeaders() }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update silver price");
    }
  }
);

/* ================= SLICE ================= */

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: null,
    recentTrades: [],
    users: [],
    transactions: [],
    total: 0,
    verifiedCount: 0,
    pendingCount: 0,
    totalVolume: 0,
    totalGst: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearAdminMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Stats
    builder.addCase(fetchAdminStats.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAdminStats.fulfilled, (state, action) => {
      state.loading = false;
      state.stats = action.payload.stats;
      state.recentTrades = action.payload.recentTrades;
    });
    builder.addCase(fetchAdminStats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // All Users
    builder.addCase(fetchAllUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload.users;
      state.total = action.payload.total;
      state.verifiedCount = action.payload.verifiedCount || 0;
      state.pendingCount = action.payload.pendingCount || 0;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
    });
    builder.addCase(fetchAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update KYC
    builder.addCase(updateKycStatus.fulfilled, (state, action) => {
      const index = state.users.findIndex((u) => u._id === action.payload._id);
      if (index !== -1) state.users[index] = action.payload;
      state.successMessage = "KYC status updated";
    });
    builder.addCase(updateKycStatus.rejected, (state, action) => {
      state.error = action.payload;
    });

    // Update Role
    builder.addCase(updateUserRole.fulfilled, (state, action) => {
      const index = state.users.findIndex((u) => u._id === action.payload._id);
      if (index !== -1) state.users[index] = action.payload;
      state.successMessage = "User role updated";
    });
    builder.addCase(updateUserRole.rejected, (state, action) => {
      state.error = action.payload;
    });

    // All Transactions
    builder.addCase(fetchAllTransactions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.transactions = action.payload.transactions;
      state.total = action.payload.total;
      state.totalVolume = action.payload.totalVolume || 0;
      state.totalGst = action.payload.totalGst || 0;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
    });
    builder.addCase(fetchAllTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Set Gold Price
    builder.addCase(setGoldPrice.fulfilled, (state, action) => {
      state.successMessage = `Gold price updated to ₹${action.payload.pricePerGram}/g`;
    });
    builder.addCase(setGoldPrice.rejected, (state, action) => {
      state.error = action.payload;
    });

    // Set Silver Price
    builder.addCase(setSilverPrice.fulfilled, (state, action) => {
      state.successMessage = `Silver price updated to ₹${action.payload.pricePerGram}/g`;
    });
    builder.addCase(setSilverPrice.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export const { clearAdminMessages } = adminSlice.actions;
export default adminSlice.reducer;