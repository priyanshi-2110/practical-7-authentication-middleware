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

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    // Generate JWT token (1 hour expiry)
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET || "supersecretjwtsecretkey_practical7_2026",
      {
        expiresIn: "1h"
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      token: token,
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

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

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

    // Generate JWT (1 hour expiry)
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET || "supersecretjwtsecretkey_practical7_2026",
      {
        expiresIn: "1h"
      }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        email: user.email
      }
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
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("ME endpoint error:", error);

    res.status(500).json({
      message: "Failed to get user profile",
      error: error.message
    });
  }
});

module.exports = router;
