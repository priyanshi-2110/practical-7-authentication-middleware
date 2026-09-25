const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const validateTask = require("../middleware/validationMiddleware");

const Task = require("../models/Task");

// ========================================
// GET tasks - Get all tasks (Protected)
// ========================================
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

// ========================================
// GET task by ID (Protected)
// ========================================
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// ========================================
// CREATE task (Protected + Input Validated)
// ========================================
router.post("/", authMiddleware, validateTask, async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body || {};

    const newTask = await Task.create({
      title: title.trim(),
      description: description || "",
      completed: completed === true,
      priority: priority || "medium"
    });

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

// ========================================
// UPDATE task (Protected)
// ========================================
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const updateData = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.completed !== undefined) updateData.completed = req.body.completed;
    if (req.body.priority !== undefined) updateData.priority = req.body.priority;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// ========================================
// DELETE task (Protected)
// ========================================
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      task
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
