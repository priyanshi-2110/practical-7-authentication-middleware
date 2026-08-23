const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(
        `${req.method} ${req.url} - ${new Date().toISOString()}`
    );
    next();
});

// ========================================
// Connect to MongoDB
// ========================================
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// ========================================
// Routes
// ========================================
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ========================================
// 404 Handler
// ========================================
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// ========================================
// Global Error Handler
// ========================================
app.use((err, req, res, next) => {
    console.error(err);

    if (err.name === "ValidationError") {
        const errors = {};

        for (const field in err.errors) {
            errors[field] = err.errors[field].message;
        }

        return res.status(400).json({
            error: "Validation failed",
            details: errors
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            error: "Invalid ID format"
        });
    }

    res.status(500).json({
        error: "Something went wrong",
        details: err.message
    });
});

// ========================================
// Start Server
// ========================================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});