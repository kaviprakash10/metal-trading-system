import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

/* ================= ASYNC THUNKS ================= */

export const fetchTransactions = createAsyncThunk(
  "transaction/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/transaction/history", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch transactions";
      return rejectWithValue(msg);
    }
  }
);

/* ================= SLICE ================= */

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transactions: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTransactions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.transactions = action.payload.data;
      state.total = action.payload.total;
    });
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default transactionSlice.reducer;