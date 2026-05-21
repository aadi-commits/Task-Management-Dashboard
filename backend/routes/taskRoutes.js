const express = require("express");
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all tasks and create task
router.get("/", getTasks);
router.post("/", createTask);

// Get, update, delete single task
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
