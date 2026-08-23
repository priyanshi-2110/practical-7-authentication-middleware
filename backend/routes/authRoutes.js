const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// REGISTER
// ========================================
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});


// ========================================
// LOGIN
// ========================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.status(200).json({
      message: "Login successful",
      token: token
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});


// ========================================
// ME - CURRENT LOGGED-IN USER
// ========================================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error("ME endpoint error:", error);

    res.status(500).json({
      message: "Failed to get user",
      error: error.message
    });
  }
});


// ========================================
// Export Router
// ========================================
module.exports = router;