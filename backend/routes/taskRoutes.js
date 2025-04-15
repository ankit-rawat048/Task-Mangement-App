const express = require("express");
const Task = require("../models/Task");
const Project = require("../models/Project");
const { createTask } = require("../controllers/taskController");
const auth = require("../middleware/auth");

const router = express.Router();

// ✅ Create standalone or subtask
router.post("/", auth, createTask);

// ✅ Create task and attach to project directly
router.post("/projects/:projectId/tasks", auth, async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const { projectId } = req.params;

    const task = new Task({ title, description, deadline, project: projectId });
    await task.save();

    await Project.findByIdAndUpdate(projectId, { $push: { tasks: task._id } });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
});

// ✅ Get all tasks
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find().populate("project");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
});

// ✅ Get single task
router.get("/:taskId", auth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId).populate("project subtasks");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error: error.message });
  }
});

// ✅ Get all tasks by project ID
router.get("/projects/:projectId", auth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks by project", error: error.message });
  }
});

// ✅ Update task
router.put("/:taskId", auth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, deadline, status } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (title) task.title = title;
    if (deadline) task.deadline = deadline;
    if (status) task.status = status;

    await task.save();

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
});

// ✅ Delete task
router.delete("/:taskId", auth, async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await Task.findByIdAndDelete(taskId);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
});

module.exports = router;
