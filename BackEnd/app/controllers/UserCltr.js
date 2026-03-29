import User from "../models/UserModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  UserRegisterValidationSchema,
  UserloginValidationSchema,
} from "../validations/Validation.js";

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

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export default UserCltr;
