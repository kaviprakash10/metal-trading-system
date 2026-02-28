import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

/* ================= ASYNC THUNKS ================= */

export const fetchMySips = createAsyncThunk(
  "sip/fetchMySips",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/sip/my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch SIPs";
      return rejectWithValue(msg);
    }
  }
);

export const createSip = createAsyncThunk(
  "sip/createSip",
  async ({ asset, amountPerMonth, dayOfMonth }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/sip/create",
        { asset, amountPerMonth, dayOfMonth },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data.sip;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create SIP";
      return rejectWithValue(msg);
    }
  }
);

export const pauseSip = createAsyncThunk(
  "sip/pauseSip",
  async ({ sipId }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/sip/${sipId}/pause`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data.sip;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to pause SIP";
      return rejectWithValue(msg);
    }
  }
);

export const resumeSip = createAsyncThunk(
  "sip/resumeSip",
  async ({ sipId }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/sip/${sipId}/resume`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data.sip;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resume SIP";
      return rejectWithValue(msg);
    }
  }
);

export const deleteSip = createAsyncThunk(
  "sip/deleteSip",
  async ({ sipId }, { rejectWithValue }) => {
    try {
      await axios.delete(`/sip/${sipId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return sipId;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete SIP";
      return rejectWithValue(msg);
    }
  }
);

/* ================= SLICE ================= */

const sipSlice = createSlice({
  name: "sip",
  initialState: {
    sips: [],
    total: 0,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSipMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch SIPs
    builder.addCase(fetchMySips.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMySips.fulfilled, (state, action) => {
      state.loading = false;
      state.sips = action.payload.sips;
      state.total = action.payload.total;
    });
    builder.addCase(fetchMySips.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create SIP
    builder.addCase(createSip.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createSip.fulfilled, (state, action) => {
      state.loading = false;
      state.sips.unshift(action.payload);
      state.successMessage = "SIP created successfully";
    });
    builder.addCase(createSip.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Pause SIP
    builder.addCase(pauseSip.fulfilled, (state, action) => {
      const index = state.sips.findIndex((s) => s._id === action.payload._id);
      if (index !== -1) state.sips[index] = action.payload;
      state.successMessage = "SIP paused";
    });
    builder.addCase(pauseSip.rejected, (state, action) => {
      state.error = action.payload;
    });

    // Resume SIP
    builder.addCase(resumeSip.fulfilled, (state, action) => {
      const index = state.sips.findIndex((s) => s._id === action.payload._id);
      if (index !== -1) state.sips[index] = action.payload;
      state.successMessage = "SIP resumed";
    });
    builder.addCase(resumeSip.rejected, (state, action) => {
      state.error = action.payload;
    });

    // Delete SIP
    builder.addCase(deleteSip.fulfilled, (state, action) => {
      state.sips = state.sips.filter((s) => s._id !== action.payload);
      state.successMessage = "SIP deleted";
    });
    builder.addCase(deleteSip.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export const { clearSipMessages } = sipSlice.actions;
export default sipSlice.reducer;