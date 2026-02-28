import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

/* ================= ASYNC THUNKS ================= */

export const buyGold = createAsyncThunk(
  "asset/buyGold",
  async ({ grams, pricePerGram }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/gold/buy",
        { grams, pricePerGram },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to buy gold";
      return rejectWithValue(msg);
    }
  }
);

export const sellGold = createAsyncThunk(
  "asset/sellGold",
  async ({ grams, pricePerGram }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/gold/sell",
        { grams, pricePerGram },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to sell gold";
      return rejectWithValue(msg);
    }
  }
);

export const buySilver = createAsyncThunk(
  "asset/buySilver",
  async ({ grams, pricePerGram }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/silver/buy",
        { grams, pricePerGram },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to buy silver";
      return rejectWithValue(msg);
    }
  }
);

export const sellSilver = createAsyncThunk(
  "asset/sellSilver",
  async ({ grams, pricePerGram }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/silver/sell",
        { grams, pricePerGram },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to sell silver";
      return rejectWithValue(msg);
    }
  }
);

/* ================= SLICE ================= */

const assetSlice = createSlice({
  name: "asset",
  initialState: {
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearAssetMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    };
    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.successMessage = action.payload.message;
      state.error = null;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.successMessage = null;
    };

    // Buy Gold
    builder.addCase(buyGold.pending, handlePending);
    builder.addCase(buyGold.fulfilled, handleFulfilled);
    builder.addCase(buyGold.rejected, handleRejected);

    // Sell Gold
    builder.addCase(sellGold.pending, handlePending);
    builder.addCase(sellGold.fulfilled, handleFulfilled);
    builder.addCase(sellGold.rejected, handleRejected);

    // Buy Silver
    builder.addCase(buySilver.pending, handlePending);
    builder.addCase(buySilver.fulfilled, handleFulfilled);
    builder.addCase(buySilver.rejected, handleRejected);

    // Sell Silver
    builder.addCase(sellSilver.pending, handlePending);
    builder.addCase(sellSilver.fulfilled, handleFulfilled);
    builder.addCase(sellSilver.rejected, handleRejected);
  },
});

export const { clearAssetMessages } = assetSlice.actions;
export default assetSlice.reducer;