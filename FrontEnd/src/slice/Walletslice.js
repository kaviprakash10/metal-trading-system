import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

/* ================= ASYNC THUNKS ================= */

export const fetchWallet = createAsyncThunk(
  "wallet/fetchWallet",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/wallet/checkAmount", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch wallet";
      return rejectWithValue(msg);
    }
  }
);

export const addMoney = createAsyncThunk(
  "wallet/addMoney",
  async ({ amount }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/wallet/addAmount",
        { amount },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add money";
      return rejectWithValue(msg);
    }
  }
);

/* ================= SLICE ================= */

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    walletBalance: 0,
    goldBalance: 0,
    silverBalance: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Wallet
    builder.addCase(fetchWallet.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWallet.fulfilled, (state, action) => {
      state.loading = false;
      state.walletBalance = action.payload.walletBalance;
      state.goldBalance = action.payload.goldBalance;
      state.silverBalance = action.payload.silverBalance;
    });
    builder.addCase(fetchWallet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add Money
    builder.addCase(addMoney.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addMoney.fulfilled, (state, action) => {
      state.loading = false;
      state.walletBalance = action.payload.balance;
    });
    builder.addCase(addMoney.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default walletSlice.reducer;