const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Task = require("./models/Task");

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
// GET - Get all tasks
// ========================================

app.get("/tasks", async (req, res, next) => {
    try {
        const tasks = await Task.find();

        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});

// ========================================
// GET - Get task by ID
// ========================================

app.get("/tasks/:id", async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

// ========================================
// POST - Create a task
// ========================================

app.post("/tasks", async (req, res, next) => {
    try {
        const newTask = await Task.create({
            title: req.body.title,
            description: req.body.description,
            completed: req.body.completed,
            priority: req.body.priority
        });

        res.status(201).json(newTask);
    } catch (err) {
        next(err);
    }
});

// ========================================
// PUT - Update a task
// ========================================

app.put("/tasks/:id", async (req, res, next) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description,
                completed: req.body.completed,
                priority: req.body.priority
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

// ========================================
// DELETE - Delete a task
// ========================================

app.delete("/tasks/:id", async (req, res, next) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully",
            task: deletedTask
        });
    } catch (err) {
        next(err);
    }
});

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

    // Mongoose validation error
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

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        return res.status(400).json({
            error: "Invalid task ID"
        });
    }

    res.status(500).json({
        error: "Something went wrong"
    });
});

// ========================================
// Start server
// ========================================

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});