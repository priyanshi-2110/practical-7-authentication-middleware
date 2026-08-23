const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const validateTask = require("../middleware/validationMiddleware");

const Task = require("../models/Task");

// GET tasks - Get all tasks
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// GET task by ID
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

// CREATE task
router.post("/", authMiddleware, validateTask, async (req, res, next) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed,
      priority: req.body.priority
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// UPDATE task
router.put("/:id", authMiddleware, async (req, res, next) => {
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

    res.json(task);
  } catch (error) {
    next(error);
  }
});

// DELETE task
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    res.json({
      message: "Task deleted successfully",
      task
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
