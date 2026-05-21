const Task = require("../models/Task");

// Create task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || "medium",
      dueDate,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tasks (admin sees all, user sees only theirs)
exports.getTasks = async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.id);

    let tasks;
    if (user.role === "admin") {
      // Admin sees all tasks
      tasks = await Task.find().sort({ createdAt: -1 });
    } else {
      // User sees only their tasks
      tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    }

    res.json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user owns this task
    if (task.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this task" });
    }

    res.json({
      message: "Task fetched successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const User = require("../models/User");
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user owns this task or is admin
    const user = await User.findById(req.user.id);
    if (task.userId.toString() !== req.user.id && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    // Update fields
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const User = require("../models/User");
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user owns this task or is admin
    const user = await User.findById(req.user.id);
    if (task.userId.toString() !== req.user.id && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
