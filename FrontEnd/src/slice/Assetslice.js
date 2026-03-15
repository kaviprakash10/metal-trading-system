import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios.js";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

/* ── Generic buy/sell thunk factory ── */
const makeBuyThunk = (name, endpoint) =>
  createAsyncThunk(`asset/${name}`, async (payload, { rejectWithValue }) => {
    try {
      // payload can be:
      // { amount, pricePerGram }   ← buy by ₹ amount
      // { grams,  pricePerGram }   ← buy by grams
      const res = await axios.post(endpoint, payload, authHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || `${name} failed`
      );
    }
  });

const makeSellThunk = (name, endpoint) =>
  createAsyncThunk(`asset/${name}`, async (payload, { rejectWithValue }) => {
    try {
      // payload: { grams, pricePerGram }
      const res = await axios.post(endpoint, payload, authHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || `${name} failed`
      );
    }
  });

export const buyGold    = makeBuyThunk("buyGold",    "/gold/buy");
export const buySilver  = makeBuyThunk("buySilver",  "/silver/buy");
export const sellGold   = makeSellThunk("sellGold",  "/gold/sell");
export const sellSilver = makeSellThunk("sellSilver","/silver/sell");

const assetSlice = createSlice({
  name: "asset",
  initialState: {
    loading:        false,
    error:          null,
    successMessage: null,
    lastTransaction: null,  // stores last response for UI display
  },
  reducers: {
    clearAssetMessages(state) {
      state.error          = null;
      state.successMessage = null;
      state.lastTransaction = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading        = true;
      state.error          = null;
      state.successMessage = null;
    };
    const fulfilled = (state, action) => {
      state.loading        = false;
      state.successMessage = action.payload.message;
      // Store full response so BuyPage can show grams received etc.
      state.lastTransaction = {
        grams:       action.payload.grams,
        baseAmount:  action.payload.baseAmount,
        gstAmount:   action.payload.gstAmount,
        totalAmount: action.payload.totalAmount,
        usedPrice:   action.payload.usedPrice,
      };
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    };

    [buyGold, buySilver, sellGold, sellSilver].forEach((thunk) => {
      builder
        .addCase(thunk.pending,   pending)
        .addCase(thunk.fulfilled, fulfilled)
        .addCase(thunk.rejected,  rejected);
    });
  },
});

export const { clearAssetMessages } = assetSlice.actions;
export default assetSlice.reducer;