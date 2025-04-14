const express = require("express");
const Task = require("../models/Task");
const Project = require("../models/Project");
const { createTask } = require("../controllers/taskController");
const auth = require("../middleware/auth");

const router = express.Router();

// ✅ Original generic task creation
router.post("/", auth, createTask);

// ✅ New route to create task and attach to a project
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

// ✅ Update Task Info
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
  

// ✅ Delete Task
router.delete("/:taskId", auth, async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }

    await Task.findByIdAndDelete(taskId);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
});

module.exports = router;
