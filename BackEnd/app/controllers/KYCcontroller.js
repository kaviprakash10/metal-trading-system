import User from "../models/KYCmodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserCltr = {};

/* ── Register ── */
UserCltr.register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or username already exists" });
    }

    const usersCount = await User.countDocuments();
    const role = usersCount === 0 ? "admin" : "user"; // first user = admin

    const user = new User({ userName, email, password, role });
    await user.save();

    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ── Login ── */
UserCltr.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ── Get Profile ── */
UserCltr.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ── Update Profile ── */
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
    res.status(500).json({ error: err.message });
  }
};

export default UserCltr;