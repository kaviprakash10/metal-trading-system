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

export const googleAuthUser = createAsyncThunk(
  "auth/googleAuthUser",
  async ({ email, userName, googleId, redirect }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/user/google-auth", {
        email,
        userName,
        googleId,
      });

      if (response.status === 202 && response.data.requiresOtp) {
        return { requiresOtp: true, phone: response.data.phone, email: response.data.email };
      }

      localStorage.setItem("token", response.data.token);

      const userResponse = await axios.get("/user/profile", {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });
      const user = userResponse.data;

      if (redirect) {
        if (response.data.needsPhone || !user.phone || !user.phoneVerified) {
          redirect("/update-phone");
        } else if (user.role === "admin") {
          redirect("/admin/dashboard");
        } else if (user.role === "staff") {
          redirect("/staff/dashboard");
        } else {
          redirect("/user/dashboard");
        }
      }
      return { user };
    } catch (err) {
      const msg = err.response?.data?.error || "Google Auth failed";
      return rejectWithValue(msg);
    }
  },
);


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ formData, redirect }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/user/login", formData);

      // If OTP is required (202 status)
      if (response.status === 202 && response.data.requiresOtp) {
        return {
          requiresOtp: true,
          phone: response.data.phone,
          email: response.data.email,
        };
      }

      localStorage.setItem("token", response.data.token);

      const userResponse = await axios.get("/user/profile", {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });

      const user = userResponse.data;

      if (redirect) {
        if (user.role === "admin") redirect("/admin/dashboard");
        else if (user.role === "staff") redirect("/staff/dashboard");
        else redirect("/user/dashboard");
      }

      return user;
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed";
      return rejectWithValue(msg);
    }
  },
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp, redirect }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/user/verify-login", { email, otp });
      localStorage.setItem("token", response.data.token);

      const userResponse = await axios.get("/user/profile", {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });

      const user = userResponse.data;

      if (redirect) {
        if (user.role === "admin") redirect("/admin/dashboard");
        else if (user.role === "staff") redirect("/staff/dashboard");
        else redirect("/user/dashboard");
      }

      return user;
    } catch (err) {
      const msg = err.response?.data?.error || "Verification failed";
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
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.patch("/user/profile", profileData);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to update profile";
      return rejectWithValue(msg);
    }
  },
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.patch("/user/update-password", { oldPassword, newPassword });
      return response.data.message;
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to update password";
      return rejectWithValue(msg);
    }
  }
);

export const sendPhoneVerification = createAsyncThunk(
  "auth/sendPhoneVerification",
  async ({ phone }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/user/update-phone",
        { phone },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send verification";
      return rejectWithValue(msg);
    }
  },
);

export const verifyUpdatedPhone = createAsyncThunk(
  "auth/verifyUpdatedPhone",
  async ({ otp, redirect }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/user/verify-phone-otp",
        { otp },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      const user = response.data.user;
      if (redirect) {
        if (user.role === "admin") redirect("/admin/dashboard");
        else if (user.role === "staff") redirect("/staff/dashboard");
        else redirect("/user/dashboard");
      }
      return user;
    } catch (err) {
      const msg = err.response?.data?.error || "OTP Verification failed";
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
    requiresOtp: false,
    otpPhone: null,
    otpEmail: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      state.requiresOtp = false;
      state.otpPhone = null;
      state.otpEmail = null;
      localStorage.removeItem("token");
    },
    clearOtpState: (state) => {
      state.requiresOtp = false;
      state.otpPhone = null;
      state.otpEmail = null;
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

    // Google Auth
    builder.addCase(googleAuthUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(googleAuthUser.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.requiresOtp) {
        state.requiresOtp = true;
        state.otpPhone = action.payload.phone;
        state.otpEmail = action.payload.email;
      } else {
        state.user = action.payload.user;
        state.isLoggedIn = true;
        state.requiresOtp = false;
        state.error = null;
      }
    });
    builder.addCase(googleAuthUser.rejected, (state, action) => {
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
      if (action.payload.requiresOtp) {
        state.requiresOtp = true;
        state.otpPhone = action.payload.phone;
        state.otpEmail = action.payload.email;
      } else {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.requiresOtp = false;
      }
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.isLoggedIn = false;
    });

    // Verify OTP
    builder.addCase(verifyOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isLoggedIn = true;
      state.requiresOtp = false;
      state.otpPhone = null;
      state.otpEmail = null;
      state.error = null;
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
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
    // Verify Updated Phone
    builder.addCase(verifyUpdatedPhone.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyUpdatedPhone.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(verifyUpdatedPhone.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { logout, clearOtpState } = authSlice.actions;
export default authSlice.reducer;
