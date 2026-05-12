import User from "../models/UserModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  UserRegisterValidationSchema,
  UserloginValidationSchema,
} from "../validations/Validation.js";
import { sendOTP, verifyOTP, sendManualSMS } from "../utils/twilio.js";

const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  // If it already starts with +, return it
  if (phone.startsWith("+")) return phone;
  // If it's a 10 digit number, assume +91 (India) as per project context
  if (phone.length === 10) return `+91${phone}`;
  // Otherwise, just prepend + if missing (risky but better than nothing)
  return phone.startsWith("+") ? phone : `+${phone}`;
};

const UserCltr = {};

/* ================= REGISTER ================= */

UserCltr.register = async (req, res) => {
  const { body } = req;

  const { error, value } = UserRegisterValidationSchema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      error: error.details.map((err) => err.message),
    });
  }

  try {
    const userExists = await User.findOne({ email: value.email });

    if (userExists) {
      return res.status(400).json({
        error: "Email already present",
      });
    }

    // Format phone number
    value.phone = formatPhoneNumber(value.phone);

    const user = new User(value);

    // Hash password
    const salt = await bcryptjs.genSalt();
    const hashPassword = await bcryptjs.hash(value.password, salt);
    user.password = hashPassword;

    // Make first user admin
    const usersCount = await User.countDocuments();

    if (usersCount === 0) {
      user.role = "admin";
    }

    await user.save();

    // Remove password before sending
    const userData = user.toObject();
    delete userData.password;

    res.status(201).json(userData);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

/* ================= LOGIN ================= */

UserCltr.login = async (req, res) => {
  const { body } = req;

  const { error, value } = UserloginValidationSchema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      error: error.details.map((ele) => ele.message),
    });
  }

  try {
    const user = await User.findOne({ email: value.email });

    if (!user) {
      return res.status(400).json({
        error: "Invalid email",
      });
    }

    const isPassword = await bcryptjs.compare(value.password, user.password);

    if (!isPassword) {
      return res.status(400).json({
        error: "Invalid password",
      });
    }

    // Check if OTP verification is required
    if (user.needsVerification) {
      if (!user.phone) {
        return res
          .status(400)
          .json({ error: "Phone number not found. Please contact support." });
      }

      const formattedPhone = formatPhoneNumber(user.phone);

      try {
        if (process.env.TWILIO_SERVICE_SID) {
          await sendOTP(formattedPhone);
        } else {
          // Manual OTP generation
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          user.otpCode = otp;
          user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
          await user.save();

          await sendManualSMS(
            formattedPhone,
            `Your GoldVault login OTP is: ${otp}. Valid for 10 minutes.`,
          );
        }

        return res.status(202).json({
          requiresOtp: true,
          phone: user.phone,
          email: user.email,
          message: "OTP sent to your registered phone number",
        });
      } catch (otpErr) {
        console.error("OTP send failed:", otpErr);
        return res
          .status(500)
          .json({ error: "Failed to send OTP. Please try again later." });
      }
    }

    // Generate JWT (FIXED userId)
    const tokenData = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.json({ token });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Login failed",
    });
  }
};
/* ================= GET LOGGED-IN USER ================= */

UserCltr.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT middleware

    const user = await User.findById(userId).select(
      "-password", // exclude password
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Failed to fetch profile",
    });
  }
};

/* ================= UPDATE PROFILE ================= */
UserCltr.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fields user is allowed to update
    const allowedFields = [
      "userName",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
      "upiId",
      "accountName",
      "accountNumber",
      "ifscCode",
      "bankName",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Check userName uniqueness if it's being changed
    if (updates.userName) {
      const existing = await User.findOne({
        userName: updates.userName,
        _id: { $ne: userId },
      });
      if (existing) {
        return res.status(400).json({ error: "Username already taken" });
      }
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if phone is being updated
    if (updates.phone && updates.phone !== user.phone) {
      updates.needsVerification = true;
    }

    Object.assign(user, updates);
    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

/* ================= VERIFY LOGIN OTP ================= */
UserCltr.verifyLoginOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.needsVerification) {
      return res.status(400).json({ error: "Verification not required" });
    }

    const formattedPhone = formatPhoneNumber(user.phone);
    let isApproved = false;

    if (process.env.TWILIO_SERVICE_SID) {
      isApproved = await verifyOTP(formattedPhone, otp);
    } else {
      // Manual verification
      if (user.otpCode === otp && user.otpExpires > new Date()) {
        isApproved = true;
        // Clear OTP after use
        user.otpCode = undefined;
        user.otpExpires = undefined;
      }
    }

    if (isApproved) {
      // Mark as verified
      user.needsVerification = false;
      await user.save();

      // Generate JWT
      const tokenData = {
        userId: user._id,
        role: user.role,
      };

      const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
        expiresIn: "2d",
      });

      return res.json({ token, message: "Verification successful" });
    } else {
      return res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Verification failed" });
  }
};

/* ================= GOOGLE AUTH ================= */
UserCltr.googleAuth = async (req, res) => {
  const { email, userName, googleId } = req.body;
  if (!email || !googleId) {
    return res.status(400).json({ error: "Email and Google ID required" });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Create new Google user (Signup Flow)
      user = new User({
        email,
        userName: userName || email.split("@")[0],
        googleId,
        authProvider: "google",
        password: await bcryptjs.hash(googleId + process.env.JWT_SECRET, 10), // dummy password
      });
      const usersCount = await User.countDocuments();
      if (usersCount === 0) user.role = "admin";
      await user.save();
    } else if (user.authProvider === "local") {
      // Link Google ID if local user logs in with Google
      user.googleId = googleId;
      user.authProvider = "google";
      await user.save();
    }

    // Login Flow: If user already has a phone, require OTP verification
    if (user.phone) {
      user.needsVerification = true;
      const formattedPhone = formatPhoneNumber(user.phone);

      if (process.env.TWILIO_SERVICE_SID) {
        try {
          await sendOTP(formattedPhone);
        } catch (err) {
          console.warn("Twilio sendOTP failed:", err.message);
        }
      } else {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otpCode = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        console.log(`[DEVELOPMENT ONLY] OTP for Google Login (${formattedPhone}) is: ${otp}`);
        try {
          await sendManualSMS(formattedPhone, `Your GoldVault login OTP is: ${otp}. Valid for 10 minutes.`);
        } catch (err) {
          console.warn("Twilio sendManualSMS failed:", err.message);
        }
      }

      await user.save();
      return res.status(202).json({
        requiresOtp: true,
        phone: user.phone,
        email: user.email,
        message: "OTP sent to your registered phone number"
      });
    }

    // Direct Login (Signup or no phone yet)
    const tokenData = { userId: user._id, role: user.role };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.json({
      token,
      user,
      needsPhone: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Google authentication failed" });
  }
};

/* ================= UPDATE PHONE & SEND OTP ================= */
UserCltr.updatePhone = async (req, res) => {
  const { phone } = req.body;
  const userId = req.user.userId;

  if (!phone) return res.status(400).json({ error: "Phone number required" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const formattedPhone = formatPhoneNumber(phone);
    user.phone = formattedPhone;
    user.phoneVerified = false;

    if (process.env.TWILIO_SERVICE_SID) {
      try {
        await sendOTP(formattedPhone);
      } catch (smsErr) {
        console.warn("Twilio sendOTP failed:", smsErr.message);
      }
    } else {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otpCode = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      console.log(`[DEVELOPMENT ONLY] OTP for ${formattedPhone} is: ${otp}`);
      try {
        await sendManualSMS(formattedPhone, `Your GoldVault phone verification OTP is: ${otp}. Valid for 10 minutes.`);
      } catch (smsErr) {
        console.warn("Twilio sendManualSMS failed:", smsErr.message);
      }
    }

    await user.save();
    res.json({ message: "OTP sent to phone", phone: formattedPhone });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update phone and send OTP" });
  }
};

/* ================= VERIFY PHONE OTP ================= */
UserCltr.verifyPhoneOtp = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.userId;

  if (!otp) return res.status(400).json({ error: "OTP required" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    let isApproved = false;
    const formattedPhone = formatPhoneNumber(user.phone);

    if (process.env.TWILIO_SERVICE_SID) {
      isApproved = await verifyOTP(formattedPhone, otp);
    } else {
      if (user.otpCode === otp && user.otpExpires > new Date()) {
        isApproved = true;
        user.otpCode = undefined;
        user.otpExpires = undefined;
      }
    }

    if (isApproved) {
      user.phoneVerified = true;
      user.needsVerification = false;
      await user.save();
      res.json({ message: "Phone verified successfully", user });
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Phone verification failed" });
  }
};

export default UserCltr;
