import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

/* ================= ASYNC THUNKS ================= */

export const fetchCurrentPrices = createAsyncThunk(
  "price/fetchCurrentPrices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/prices/current");
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch prices";
      return rejectWithValue(msg);
    }
  }
);

export const fetchPriceHistory = createAsyncThunk(
  "price/fetchPriceHistory",
  async ({ asset = null, limit = 30 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (asset) params.append("asset", asset);
      if (limit) params.append("limit", limit);

      const response = await axios.get(`/prices/history?${params.toString()}`);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch price history";
      return rejectWithValue(msg);
    }
  }
);

export const fetchPriceSummary = createAsyncThunk(
  "price/fetchPriceSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/prices/summary");
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch price summary";
      return rejectWithValue(msg);
    }
  }
);

/* ================= SLICE ================= */

const priceSlice = createSlice({
  name: "price",
  initialState: {
    current: {
      gold: null,
      silver: null,
    },
    history: {
      gold: [],
      silver: [],
    },
    summary: {
      gold: null,
      silver: null,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Current Prices
    builder.addCase(fetchCurrentPrices.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentPrices.fulfilled, (state, action) => {
      state.loading = false;
      state.current.gold = action.payload.gold;
      state.current.silver = action.payload.silver;
    });
    builder.addCase(fetchCurrentPrices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Price History
    builder.addCase(fetchPriceHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPriceHistory.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.gold) state.history.gold = action.payload.gold;
      if (action.payload.silver) state.history.silver = action.payload.silver;
    });
    builder.addCase(fetchPriceHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Price Summary
    builder.addCase(fetchPriceSummary.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPriceSummary.fulfilled, (state, action) => {
      state.loading = false;
      state.summary.gold = action.payload.gold;
      state.summary.silver = action.payload.silver;
    });
    builder.addCase(fetchPriceSummary.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default priceSlice.reducer;
