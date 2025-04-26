const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Project = require("../models/Project");
const {
  createTask,
  updateTaskNotes
} = require("../controllers/taskController");
const auth = require("../middleware/auth");

// 🔹 Create standalone task or subtask (supports notes)
router.post("/", auth, createTask);

// 🔹 Create and attach task to a specific project (optional shortcut)
router.post("/projects/:projectId/tasks", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      deadline,
      status,
      priority,
      assignedTo,
      tags,
      notes // ✅ Notes supported here too
    } = req.body;

    const { projectId } = req.params;

    const task = new Task({
      title,
      description,
      deadline,
      status,
      priority,
      assignedTo,
      tags,
      notes, // ✅ assign notes
      project: projectId
    });

    await task.save();

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.tasks.push(task._id);
    await project.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
});

// 🔹 Get all tasks
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find().populate("project");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
});

// 🔹 Get a single task by ID
router.get("/:taskId", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId).populate("project subtasks");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error: error.message });
  }
});

// 🔹 Get all tasks under a project
router.get("/projects/:projectId", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate("subtasks");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks by project", error: error.message });
  }
});

// 🔹 Update task
router.put("/:taskId", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      deadline,
      status,
      priority,
      assignedTo,
      tags,
      progress,
      notes // ✅ Optional: update notes inline
    } = req.body;

    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (deadline !== undefined) task.deadline = deadline;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (tags !== undefined) task.tags = tags;
    if (progress !== undefined) task.progress = progress;
    if (notes !== undefined) task.notes = notes; // ✅ Inline notes update if needed

    await task.save();
    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
});

// 🔹 Delete task
router.delete("/:taskId", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project);
    if (project) {
      project.tasks = project.tasks.filter(id => id.toString() !== task._id.toString());
      await project.save();
    }

    await Task.findByIdAndDelete(req.params.taskId);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
});

// 🔹 Update notes only
router.put("/:id/notes", auth, updateTaskNotes);

module.exports = router;
