import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ formData, redirect }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/user/register", formData);
      alert("Account created successfully!");
      redirect();
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed";
      return rejectWithValue(msg);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ formData, redirect }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/user/login", formData);
      localStorage.setItem("token", response.data.token);

      // Fetch full user profile after login
      const userResponse = await axios.get("/user/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      redirect();
      return userResponse.data;
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed";
      return rejectWithValue(msg);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/user/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch user";
      return rejectWithValue(msg);
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isLoggedIn = true;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.isLoggedIn = false;
    });

    // Fetch User
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    });
    builder.addCase(fetchUser.rejected, (state) => {
      state.user = null;
      state.isLoggedIn = false;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;