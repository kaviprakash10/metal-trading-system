import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

/* ================= ASYNC THUNKS ================= */

export const fetchPortfolio = createAsyncThunk(
  "portfolio/fetchPortfolio",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/portfolio", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data.portfolio;
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch portfolio";
      return rejectWithValue(msg);
    }
  }
);

/* ================= SLICE ================= */

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: {
    gold: null,
    silver: null,
    summary: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPortfolio.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPortfolio.fulfilled, (state, action) => {
      state.loading = false;
      state.gold = action.payload.gold;
      state.silver = action.payload.silver;
      state.summary = action.payload.summary;
    });
    builder.addCase(fetchPortfolio.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default portfolioSlice.reducer;