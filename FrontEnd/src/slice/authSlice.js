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
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ formData, redirect }, { rejectWithValue }) => {
    try {
      // Step 1: Login → get token
      const response = await axios.post("/user/login", formData);
      localStorage.setItem("token", response.data.token);

      // Step 2: Fetch full profile → get role
      const userResponse = await axios.get("/user/profile", {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });

      const user = userResponse.data;

      // Step 3: Redirect based on role AFTER we have the user data
      if (redirect) {
        if (user.role === "admin") {
          redirect("/admin/dashboard");
        } else if (user.role === "staff") {
          redirect("/staff/dashboard");
        } else {
          redirect("/user/dashboard");
        }
      }

      return user;
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed";
      return rejectWithValue(msg);
    }
  },
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
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.patch("/user/profile", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data.user;
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to update profile";
      return rejectWithValue(msg);
    }
  },
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
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isLoggedIn = true;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.isLoggedIn = false;
      state.error = action.payload;
      localStorage.removeItem("token");
    });

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload; // updated user object
      state.error = null;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
