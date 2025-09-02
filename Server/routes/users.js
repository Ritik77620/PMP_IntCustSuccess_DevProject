import express from "express";
import User from "../models/User.js";

const router = express.Router();

// @desc Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// @desc Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, userId, passCode, role, email } = req.body;

    if (!name || !userId || !passCode || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await User.findOne({ $or: [{ userId }, { email }] });
    if (existing) {
      return res.status(400).json({ error: "User ID or Email already exists" });
    }

    const user = new User({ name, userId, passCode, role, email });
    const saved = await user.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// @desc Update a user
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// @desc Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// ✅ @desc Login route
router.post("/login", async (req, res) => {
  const { email, passCode } = req.body;

  try {
    // 1️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2️⃣ Check password
    if (user.passCode !== passCode) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // 3️⃣ Login success (you can add JWT later)
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to login" });
  }
});

export default router;
